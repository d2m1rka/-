import { NextRequest, NextResponse } from "next/server"
import { redis } from "./shared/api/redis"
import { nanoid } from "nanoid"

// Lua script: atomically adds token to connected if room has capacity.
// Returns 1 on success, 0 if room is full, -1 if token already in connected.
const ADD_TO_ROOM_SCRIPT = `
local connected_raw = redis.call('HGET', KEYS[1], 'connected')
local arr = {}
if connected_raw and connected_raw ~= '' then
    arr = cjson.decode(connected_raw)
end
local token = ARGV[1]
for i, v in ipairs(arr) do
    if v == token then return -1 end
end
if #arr >= 2 then return 0 end
table.insert(arr, token)
redis.call('HSET', KEYS[1], 'connected', cjson.encode(arr))
return 1
`

export default async function middleware(req: NextRequest) {
    try {
        const pathname = req.nextUrl.pathname

        const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
        if(!roomMatch) return NextResponse.redirect(new URL("/", req.url))

        const roomId = roomMatch[1]

        const meta = await redis.hgetall<{connected: string | string[]; createdAt: number }>(`meta:${roomId}`)

        if(!meta) {
            return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
        }

        const connected: string[] = Array.isArray(meta.connected)
            ? meta.connected
            : typeof meta.connected === "string"
                ? JSON.parse(meta.connected)
                : []

        const existingToken = req.cookies.get("x-auth-token")?.value

        if(existingToken && connected.includes(existingToken)) {
            return NextResponse.next()
        }

        // Use IP-based deduplication to prevent multiple slots from the same browser
        // (e.g. when navigating from an external link where sameSite=lax still applies,
        //  or when Next.js fires multiple concurrent requests before the cookie is set)
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
            req.headers.get("x-real-ip") ||
            "unknown"
        const joinKey = `join:${ip}:${roomId}`

        // Try to atomically claim a join slot for this IP (SET NX with 24h TTL)
        const newToken = nanoid()
        const claimed = await redis.set(joinKey, newToken, { nx: true, ex: 86400 })

        let token: string
        if (claimed) {
            // This IP hasn't joined yet — try to add atomically
            const result = await redis.eval(ADD_TO_ROOM_SCRIPT, [`meta:${roomId}`], [newToken])

            if (result === 0) {
                // Room is full — release the claim
                await redis.del(joinKey)
                return NextResponse.redirect(new URL("/?error=room-full", req.url))
            }

            token = newToken
        } else {
            // Another request from this IP already claimed a slot — reuse that token
            const pendingToken = await redis.get<string>(joinKey)
            if (!pendingToken) {
                return NextResponse.redirect(new URL("/?error=server-error", req.url))
            }
            token = pendingToken
        }

        const response = NextResponse.next()
        response.cookies.set("x-auth-token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        return response
    } catch (err) {
        console.error("[middleware] error:", err)
        return NextResponse.redirect(new URL("/?error=server-error", req.url))
    }
}

export const config = {
    matcher: "/room/:path*",
}