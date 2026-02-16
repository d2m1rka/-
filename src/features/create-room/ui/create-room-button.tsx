"use client"

import { useCreateRoom } from "../model/use-create-room"

export const CreateRoomButton = () => {
  const { mutate: createRoom, isPending } = useCreateRoom()

  return (
    <button
      onClick={() => createRoom()}
      disabled={isPending}
      className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
    >
      СОЗДАТЬ ПРИВАТНЫЙ ЧАТ
    </button>
  )
}
