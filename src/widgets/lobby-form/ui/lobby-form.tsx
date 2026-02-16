"use client"

import { useUsername } from "@/entities/user"
import { CreateRoomButton } from "@/features/create-room"

export const LobbyForm = () => {
  const { username } = useUsername()

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="flex items-center text-zinc-500">
            Ваш Идентификатор:
          </label>

          <div className="flex items-center gap-3">
            <div className="flex-1 bf-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
              {username}
            </div>
          </div>
        </div>

        <CreateRoomButton />
      </div>
    </div>
  )
}
