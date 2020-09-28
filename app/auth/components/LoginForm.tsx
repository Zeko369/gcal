import React, { useState } from "react"
import { Link } from "chakra-next-link"
import login from "app/auth/mutations/login"
import { Button, Heading, Stack } from "@chakra-ui/core"
import { useForm } from "react-hook-form"
import { Input } from "app/components/Input"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [otherError, setOtherError] = useState("")
  const { handleSubmit, register, setError, errors, formState } = useForm<{
    email: string
    password: "string"
  }>()

  const onSubmit = async (values) => {
    try {
      await login({ email: values.email, password: values.password })
      props.onSuccess && props.onSuccess()
    } catch (error) {
      if (error.name === "AuthenticationError") {
        setError("email", { message: "Sorry, those credentials are invalid" })
      } else {
        setOtherError("Sorry, we had an unexpected error. Please try again. - " + error.toString())
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="3">
        <Heading size="lg">Login</Heading>

        {otherError && (
          <Heading size="md" color="red.600">
            Error :(
          </Heading>
        )}

        <Input
          name="email"
          ref={register({ required: true })}
          error={errors.email?.message}
          isRequired
          outerProps={{ mt: "3" }}
        />
        <Input
          name="password"
          ref={register({ required: true })}
          error={errors.password?.message}
          isRequired
        />
        <Link href="/signup">Register</Link>
        <Button type="submit" colorScheme="blue" isLoading={formState.isSubmitting}>
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
