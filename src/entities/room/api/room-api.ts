import { client } from "@/shared/api/client"

export const roomApi = {
  createRoom: async () => {
    const res = await client.room.create.post()
    return res.data
  },

  getRoomTTL: async (roomId: string) => {
    const res = await client.room.ttl.get({ query: { roomId } })
    return res.data
  },

  destroyRoom: async (roomId: string) => {
    await client.room.delete(null, { query: { roomId } })
  },
}
