import React, { useState, useContext, useEffect } from "react"
import { Link } from "chakra-next-link"
import login from "app/auth/mutations/login"
import { Button, Heading, Stack } from "@chakra-ui/react"
import { Control, useForm, useWatch } from "react-hook-form"
import { Input } from "app/components/Input"
import { AuthContext } from "./AuthLayout"
import { useMutation } from "blitz"

type LoginFormProps = {
  onSuccess?: () => void
}

interface LoginFormData {
  email: string
  password: string
}

const UpdateStore: React.FC<{ control: Control<LoginFormData> }> = ({ control }) => {
  const { state, dispatch } = useContext(AuthContext)

  const email = useWatch({ control, name: "email", defaultValue: state.email })
  const password = useWatch({ control, name: "password", defaultValue: state.password })

  useEffect(() => {
    dispatch({ type: "setEmail", payload: email })
  }, [email, dispatch])
  useEffect(() => {
    dispatch({ type: "setPassword", payload: password })
  }, [password, dispatch])

  return null
}

export const LoginForm = (props: LoginFormProps) => {
  const { state } = useContext(AuthContext)
  const [loginMutation] = useMutation(login)

  const [otherError, setOtherError] = useState("")
  const { handleSubmit, register, setError, errors, formState, control } = useForm<LoginFormData>({
    defaultValues: { ...state },
  })

  const onSubmit = async (values: LoginFormData) => {
    try {
      await loginMutation({ email: values.email, password: values.password })
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
      <UpdateStore control={control} />
      <Stack spacing="3">
        <Heading size="lg">Login</Heading>

        {otherError && (
          <Heading size="md" color="red.600">
            {otherError}
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
