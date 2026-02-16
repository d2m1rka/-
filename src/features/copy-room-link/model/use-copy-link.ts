"use client"

import { useState } from "react"

export const useCopyLink = () => {
  const [copyStatus, setCopyStatus] = useState("СКОПИРОВАТЬ")

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopyStatus("УСПЕШНО!")
    setTimeout(() => setCopyStatus("СКОПИРОВАТЬ"), 2000)
  }

  return { copyStatus, copyLink }
}
