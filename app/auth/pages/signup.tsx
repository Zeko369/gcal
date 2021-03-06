import React from "react"
import { useRouter, BlitzPage } from "blitz"
import { SignupForm } from "app/auth/components/SignupForm"
import { AuthLayout } from "../components/AuthLayout"
import splitbee from "@splitbee/web"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  return (
    <SignupForm
      onSuccess={async (email) => {
        await splitbee.user.set({ email })
        await splitbee.track("auth:signup")
        router.push("/")
      }}
    />
  )
}

SignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default SignupPage
