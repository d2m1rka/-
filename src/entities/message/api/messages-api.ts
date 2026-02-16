import { client } from "@/shared/api/client"

export const messagesApi = {
  getMessages: async (roomId: string) => {
    const res = await client.messages.get({ query: { roomId } })
    return res.data
  },

  sendMessage: async (roomId: string, sender: string, text: string) => {
    await client.messages.post({ sender, text }, { query: { roomId } })
  },
}
