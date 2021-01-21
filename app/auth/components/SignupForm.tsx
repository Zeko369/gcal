import React, { useState, useContext, useEffect } from "react"
import { Link, LinkButton } from "chakra-next-link"
import signup from "app/auth/mutations/signup"
import { Button, Flex, Heading, Stack } from "@chakra-ui/react"
import { Control, useForm, useWatch } from "react-hook-form"
import { Input } from "app/components/Input"
import { AuthContext } from "./AuthLayout"
import { useMutation } from "blitz"

type SignUpFormProps = {
  onSuccess?: () => void
}

interface SignupFormData {
  name: string
  email: string
  password: string
}

const UpdateStore: React.FC<{ control: Control<SignupFormData> }> = ({ control }) => {
  const { state, dispatch } = useContext(AuthContext)

  const name = useWatch({ control, name: "name", defaultValue: state.name })
  const email = useWatch({ control, name: "email", defaultValue: state.email })
  const password = useWatch({ control, name: "password", defaultValue: state.password })

  useEffect(() => {
    dispatch({ type: "setName", payload: name })
  }, [name, dispatch])
  useEffect(() => {
    dispatch({ type: "setEmail", payload: email })
  }, [email, dispatch])
  useEffect(() => {
    dispatch({ type: "setPassword", payload: password })
  }, [password, dispatch])

  return null
}

export const SignupForm = (props: SignUpFormProps) => {
  const { state } = useContext(AuthContext)
  const [signupMutation] = useMutation(signup)

  const [otherError, setOtherError] = useState("")
  const [emailExists, setEmailExists] = useState<boolean>(false)
  const { handleSubmit, register, setError, errors, formState, control } = useForm<SignupFormData>({
    defaultValues: { ...state },
  })

  const onSubmit = async (values: SignupFormData) => {
    setEmailExists(false)

    try {
      await signupMutation({ ...values })
      props.onSuccess && props.onSuccess()
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        setError("email", { message: "This email is already being used" })
        setEmailExists(true)
      } else if (error.name === "AuthenticationError") {
        setOtherError("Sorry, those credentials are invalid")
      } else if (error.errors) {
        error.errors.forEach((error) => {
          setError(error.path[0] as any, { message: error.message as string })
        })
      } else {
        setOtherError("Sorry, we had an unexpected error. Please try again. - " + error.toString())
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UpdateStore control={control} />
      <Stack spacing="3">
        <Heading size="lg">Sign up</Heading>

        {otherError && (
          <Heading size="md" color="red.600">
            Error :(
          </Heading>
        )}

        <Input
          name="name"
          ref={register({ required: true })}
          error={errors.name?.message}
          isRequired
          outerProps={{ mt: "3" }}
        />
        <Input
          name="email"
          ref={register({ required: true })}
          error={errors.email?.message}
          isRequired
        />
        <Input
          name="password"
          ref={register({ required: true })}
          error={errors.password?.message}
          isRequired
        />
        <Link href="/login">Login</Link>
        <Flex justify="space-between">
          {emailExists && <LinkButton href="/login">Login with this email</LinkButton>}
          <Button type="submit" colorScheme="blue" isLoading={formState.isSubmitting}>
            Sign up
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}

export default SignupForm
