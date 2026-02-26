"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useRoomTTL } from "@/entities/room"

export const useRoomTimer = (roomId: string) => {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { data: ttlData } = useRoomTTL(roomId)

  useEffect(() => {
    if (ttlData?.ttl === undefined || intervalRef.current !== null) return

    setTimeRemaining(ttlData.ttl)

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          router.push("/?destroyed=true")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [ttlData, router])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { timeRemaining }
}
