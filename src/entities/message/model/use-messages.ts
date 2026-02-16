"use client"

import { useQuery } from "@tanstack/react-query"
import { messagesApi } from "../api/messages-api"

export const useMessages = (roomId: string) => {
  return useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      return messagesApi.getMessages(roomId)
    },
  })
}
