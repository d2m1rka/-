"use client"

import { useQuery } from "@tanstack/react-query"
import { roomApi } from "../api/room-api"

export const useRoomTTL = (roomId: string) => {
  return useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      return roomApi.getRoomTTL(roomId)
    },
  })
}
