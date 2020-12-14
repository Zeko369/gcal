import React from "react"
import { useRouter, BlitzPage } from "blitz"
import { SignupForm } from "app/auth/components/SignupForm"
import { AuthLayout } from "../components/AuthLayout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  return <SignupForm onSuccess={() => router.push("/")} />
}

SignupPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default SignupPage
