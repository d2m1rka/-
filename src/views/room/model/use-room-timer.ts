"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRoomTTL } from "@/entities/room"

export const useRoomTimer = (roomId: string) => {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  const { data: ttlData } = useRoomTTL(roomId)

  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      setTimeRemaining(ttlData.ttl)
    }
  }, [ttlData])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    if (timeRemaining === 0) {
      router.push("/?destroyed=true")
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, router])

  return { timeRemaining }
}
