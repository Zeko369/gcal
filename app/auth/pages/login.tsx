import React from "react"
import { useRouter, BlitzPage } from "blitz"
import { LoginForm } from "app/auth/components/LoginForm"
import { AuthLayout } from "../components/AuthLayout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  return <LoginForm onSuccess={() => router.push("/")} />
}

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default LoginPage
