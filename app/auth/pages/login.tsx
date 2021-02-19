import React from "react"
import { useRouter, BlitzPage } from "blitz"
import { LoginForm } from "app/auth/components/LoginForm"
import splitbee from "@splitbee/web"

import { AuthLayout } from "../components/AuthLayout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  return (
    <LoginForm
      onSuccess={(email) => {
        splitbee.user.set({ email })
        router.push("/")
      }}
    />
  )
}

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default LoginPage
