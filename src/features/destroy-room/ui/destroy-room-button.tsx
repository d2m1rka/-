"use client"

import { useDestroyRoom } from "../model/use-destroy-room"

interface DestroyRoomButtonProps {
  roomId: string
}

export const DestroyRoomButton = ({ roomId }: DestroyRoomButtonProps) => {
  const { mutate: destroyRoom, isPending } = useDestroyRoom(roomId)

  return (
    <button
      onClick={() => destroyRoom()}
      disabled={isPending}
      className="text-xs bg-zinc-800 hover:bg-red-600 px-3 py-1.5 rounded
            text-zinc-400 hover:text-white font-bold
            transition-all group flex items-center gap-2 disabled:opacity-50"
    >
      <span className="group-hover:animate-pulse">💥</span>
      УНИЧТОЖИТЬ НАХУЙ
    </button>
  )
}
