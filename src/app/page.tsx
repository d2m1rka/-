import { Suspense } from "react"
import { LobbyPage } from "@/views/lobby"

export default function Page() {
  return (
    <Suspense>
      <LobbyPage />
    </Suspense>
  )
}
