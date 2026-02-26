"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useRoomTTL } from "@/entities/room"

export const useRoomTimer = (roomId: string) => {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const initialized = useRef(false)

  const { data: ttlData } = useRoomTTL(roomId)

  useEffect(() => {
    if (ttlData?.ttl === undefined || initialized.current) return
    initialized.current = true
    setTimeRemaining(ttlData.ttl)
  }, [ttlData])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          router.push("/?destroyed=true")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return { timeRemaining }
}
