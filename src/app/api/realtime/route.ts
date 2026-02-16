import { handle } from "@upstash/realtime"
import { realtime } from "@/shared/api/realtime"

export const GET = handle({ realtime })
