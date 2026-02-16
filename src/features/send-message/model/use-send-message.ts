"use client"

import { useMutation } from "@tanstack/react-query"
import { messagesApi } from "@/entities/message"

interface SendMessageParams {
  roomId: string
  sender: string
  text: string
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ roomId, sender, text }: SendMessageParams) => {
      await messagesApi.sendMessage(roomId, sender, text)
    },
  })
}
