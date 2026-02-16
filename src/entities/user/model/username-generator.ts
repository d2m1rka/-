import { nanoid } from "nanoid"
import { ANIMALS } from "@/shared/config"

export const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `anonymous-${word}-${nanoid(5)}`
}
