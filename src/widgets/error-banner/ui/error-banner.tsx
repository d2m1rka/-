"use client"

interface ErrorBannerProps {
  type: "destroyed" | "room-not-found" | "room-full" | null
}

export const ErrorBanner = ({ type }: ErrorBannerProps) => {
  if (!type) return null

  const messages = {
    destroyed: {
      title: "КОМНАТА БЫЛА УНИЧТОЖЕНА",
      description: "Все сообщения были удалены навсегда.",
    },
    "room-not-found": {
      title: "КОМНАТА НЕ НАЙДЕНА",
      description: "Возможно, срок действия комнаты истек или её вовсе не существовало.",
    },
    "room-full": {
      title: "КОМНАТА ЗАПОЛНЕНА",
      description: "К комнате уже подключено более 2 пользователей.",
    },
  }

  const message = messages[type]

  return (
    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
      <p className="text-red-500 text-sm font-bold">{message.title}</p>
      <p className="text-zinc-500 text-xs mt-1">{message.description}</p>
    </div>
  )
}
