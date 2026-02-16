"use client"

import { useParams, useRouter } from "next/navigation"
import { useUsername } from "@/entities/user"
import { useMessages } from "@/entities/message"
import { useRealtime } from "@/shared/api/realtime"
import { RoomHeader } from "@/widgets/room-header"
import { MessageList } from "@/widgets/message-list"
import { MessageInput } from "@/widgets/message-input"
import { useRoomTimer } from "../model/use-room-timer"

export const RoomPage = () => {
  const params = useParams()
  const roomId = params.roomId as string
  const router = useRouter()

  const { username } = useUsername()
  const { data: messages, refetch } = useMessages(roomId)
  const { timeRemaining } = useRoomTimer(roomId)

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch()
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    },
  })

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <RoomHeader roomId={roomId} timeRemaining={timeRemaining} />

      {messages && (
        <MessageList
          messages={messages.messages}
          currentUsername={username}
        />
      )}

      <MessageInput roomId={roomId} username={username} />
    </main>
  )
}
