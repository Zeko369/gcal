import React from "react"
import { Button } from "@chakra-ui/core"
import { useRouter } from "next/router"
import googleAuth from "app/mutations/googleAuth"

export const RestGoogleToken: React.FC<{ redirect?: string }> = ({ redirect }) => {
  const router = useRouter()
  const auth = async () => {
    const authorizeUrl = await googleAuth({ redirect })
    router.push(authorizeUrl)
  }

  return <Button onClick={auth}>Google auth</Button>
}
