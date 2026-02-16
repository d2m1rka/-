"use client"

import { type Message } from "@/entities/message"
import { format } from "date-fns"

interface MessageListProps {
  messages: Message[]
  currentUsername: string
}

export const MessageList = ({ messages, currentUsername }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-600 text-sm font-mono">
          Пока нет сообщений, начните беседу.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col items-start">
          <div className="max-w-[80%] group">
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className={`text-xs font-bold ${
                  msg.sender === currentUsername
                    ? "text-green-500"
                    : "text-blue-500"
                }`}
              >
                {msg.sender === currentUsername ? "ВЫ" : msg.sender}
              </span>

              <span className="text-[10px] text-zinc-600">
                {format(msg.timestamp, "HH:mm")}
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed break-all">
              {msg.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
