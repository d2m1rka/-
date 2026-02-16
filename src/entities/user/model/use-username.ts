import { useEffect, useState } from "react"
import { STORAGE_KEY } from "@/shared/config"
import { generateUsername } from "./username-generator"

export const useUsername = () => {
    const [username, setUsername] = useState("")

    useEffect  (() => {
        const main = () => {
          const stored = localStorage.getItem(STORAGE_KEY)
    
          if(stored) {
            setUsername(stored)
            return
          }
    
          const generated = generateUsername()
          localStorage.setItem(STORAGE_KEY, generated)
          setUsername(generated)
        }
    
        main()
      }, [])

      return { username }
}