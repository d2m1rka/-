"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { roomApi } from "@/entities/room"

export const useCreateRoom = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const data = await roomApi.createRoom()
      if (data?.roomId) {
        router.push(`/room/${data.roomId}`)
      }
    },
  })
}
