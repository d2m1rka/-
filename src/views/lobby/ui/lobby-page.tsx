"use client"

import { useSearchParams } from "next/navigation"
import { ErrorBanner } from "@/widgets/error-banner"
import { LobbyForm } from "@/widgets/lobby-form"

export const LobbyPage = () => {
  const searchParams = useSearchParams()
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error") as
    | "room-not-found"
    | "room-full"
    | null

  const errorType = wasDestroyed
    ? "destroyed"
    : error === "room-not-found"
      ? "room-not-found"
      : error === "room-full"
        ? "room-full"
        : null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <ErrorBanner type={errorType} />

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            teleGGrama
          </h1>
          <p className="text-zinc-500 text-sm">
            Приватный, самоудаляющийся чат. АНАЛог Телеги
          </p>
        </div>

        <LobbyForm />
      </div>
    </main>
  )
}
