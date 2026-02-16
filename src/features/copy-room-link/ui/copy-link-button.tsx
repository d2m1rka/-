"use client"

import { useCopyLink } from "../model/use-copy-link"

export const CopyLinkButton = () => {
  const { copyStatus, copyLink } = useCopyLink()

  return (
    <button
      onClick={copyLink}
      className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded
                         text-zinc-400 hover:text-zinc-200 transition-colors"
    >
      {copyStatus}
    </button>
  )
}
