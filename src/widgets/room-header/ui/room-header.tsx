"use client"

import { CopyLinkButton } from "@/features/copy-room-link"
import { DestroyRoomButton } from "@/features/destroy-room"
import { formatTimeRemaining } from "@/shared/lib/format"

interface RoomHeaderProps {
  roomId: string
  timeRemaining: number | null
}

export const RoomHeader = ({ roomId, timeRemaining }: RoomHeaderProps) => {
  return (
    <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase">код комнаты:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-green-500">{roomId}</span>
            <CopyLinkButton />
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-800" />

        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 uppercase">
            Само-Уничтожение
          </span>
          <span
            className={`text-sm font-bold flex items-center gap-2 ${
              timeRemaining !== null && timeRemaining < 60
                ? "text-red-500"
                : "text-amber-500"
            }`}
          >
            {timeRemaining !== null
              ? formatTimeRemaining(timeRemaining)
              : "--:--"}
          </span>
        </div>
      </div>

      <DestroyRoomButton roomId={roomId} />
    </header>
  )
}
