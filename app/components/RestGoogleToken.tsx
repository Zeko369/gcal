import React from "react"
import { Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import googleAuth from "app/mutations/googleAuth"
import { useMutation } from "blitz"

export const RestGoogleToken: React.FC<{ redirect?: string }> = ({ redirect }) => {
  const router = useRouter()
  const [googleAuthMutation] = useMutation(googleAuth)

  const auth = async () => {
    const authorizeUrl = await googleAuthMutation({ redirect })
    router.push(authorizeUrl)
  }

  return <Button onClick={auth}>Google auth</Button>
}
