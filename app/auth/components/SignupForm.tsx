import React, { useState } from "react"
import { Link } from "chakra-next-link"
import signup from "app/auth/mutations/signup"
import { Button, Heading, Stack } from "@chakra-ui/core"
import { useForm } from "react-hook-form"
import Input from "app/components/Input"

type SignUpFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignUpFormProps) => {
  const [otherError, setOtherError] = useState("")
  const { handleSubmit, register, setError, errors, formState } = useForm<{
    email: string
    password: "string"
  }>()

  const onSubmit = async (values) => {
    try {
      await signup({ email: values.email, password: values.password })
      props.onSuccess && props.onSuccess()
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        setError("email", { message: "This email is already being used" })
      } else {
        setOtherError("Sorry, we had an unexpected error. Please try again. - " + error.toString())
      }

      if (error.name === "AuthenticationError") {
        setOtherError("Sorry, those credentials are invalid")
      } else {
        setOtherError("Sorry, we had an unexpected error. Please try again. - " + error.toString())
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="3">
        <Heading size="lg">Sign up</Heading>

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
        <Link href="/login">Login</Link>
        <Button type="submit" colorScheme="blue" isLoading={formState.isSubmitting}>
          Sign up
        </Button>
      </Stack>
    </form>
  )
}

export default SignupForm
