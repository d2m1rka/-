import { redis } from "@/shared/api/redis"
import { InferRealtimeEvents, Realtime } from "@upstash/realtime"
import z from "zod"
import { messageSchema } from "@/entities/message"

const message = messageSchema


const schema = {
    chat: {
            message, 
            destroy: z.object({
                isDestroyed: z.literal(true),
            }),
    },
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
export type { Message } from "@/entities/message"