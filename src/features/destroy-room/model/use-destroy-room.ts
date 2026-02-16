"use client"

import { useMutation } from "@tanstack/react-query"
import { roomApi } from "@/entities/room"

export const useDestroyRoom = (roomId: string) => {
  return useMutation({
    mutationFn: async () => {
      await roomApi.destroyRoom(roomId)
    },
  })
}
