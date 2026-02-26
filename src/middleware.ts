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

        // Block bots/crawlers (e.g. Telegram link preview) from consuming room slots
        const userAgent = req.headers.get("user-agent") ?? ""
        const isBot = /bot|crawler|spider|preview|facebookexternalhit|telegrambot|whatsapp|twitter/i.test(userAgent)
        if (isBot) {
            return NextResponse.next()
        }

        const existingToken = req.cookies.get("x-auth-token")?.value

        if(existingToken && connected.includes(existingToken)) {
            return NextResponse.next()
        }

        // Atomically add a new token to the room if there is capacity
        const token = nanoid()
        const result = await redis.eval(ADD_TO_ROOM_SCRIPT, [`meta:${roomId}`], [token])

        if (result === 0) {
            return NextResponse.redirect(new URL("/?error=room-full", req.url))
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