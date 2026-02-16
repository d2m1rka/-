"use client"

import { useState, useRef } from "react"
import { useSendMessage } from "@/features/send-message"

interface MessageInputProps {
  roomId: string
  username: string
  onMessageSent?: () => void
}

export const MessageInput = ({
  roomId,
  username,
  onMessageSent,
}: MessageInputProps) => {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: sendMessage, isPending } = useSendMessage()

  const handleSend = () => {
    if (!input.trim()) return

    sendMessage(
      { roomId, sender: username, text: input },
      {
        onSuccess: () => {
          setInput("")
          inputRef.current?.focus()
          onMessageSent?.()
        },
      }
    )
  }

  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
            {">"}
          </span>
          <input
            ref={inputRef}
            placeholder="Напишите сообщение..."
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                handleSend()
              }
            }}
            type="text"
            className="w-full bg-black border border-zinc-800 focus:border-zinc-700
                            focus:outline-none transition-colors text-zinc-100
                            placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || isPending}
          className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all
                 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-400 cursor-pointer"
        >
          ОТПРАВИТЬ
        </button>
      </div>
    </div>
  )
}
