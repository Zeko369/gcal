import React, { Suspense, useEffect, useState } from "react"
import { BlitzPage, useRouter } from "blitz"
import { useForm } from "react-hook-form"
import { User } from "@prisma/client"
import { Spinner, Divider, Heading, VStack, Button, Flex, Stack, Box } from "@chakra-ui/core"
import { LinkButton } from "chakra-next-link"

import Layout from "app/layouts/Layout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Input } from "app/components/Input"
import changePassword from "app/auth/mutations/changePassword"
import updateUser from "app/auth/mutations/updateUser"
import { useDebounce } from "app/hooks/useDebounce"
import isCurrentPasswordOk from "app/auth/mutations/isCurrentPasswordOk"
import { Section } from "."

type UserFormData = Pick<User, "name">
const PasswordFields = ["password", "confirm_password", "current_password"] as const
type UserPasswordData = Record<typeof PasswordFields[number], string>
interface UserFormProps {
  user: User
  refetch: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, refetch }) => {
  const { register, handleSubmit, formState } = useForm<UserFormData>({
    defaultValues: { name: user.name },
  })

  const onSubmit = async (data: UserFormData) => {
    await updateUser({ data: { name: { set: data.name } } })
    refetch()
  }

  return (
    <Box w="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="flex-start">
          <Input name="name" ref={register({ required: true })} isRequired />
          <Flex w="100%" justify="flex-end">
            <Button type="submit" isLoading={formState.isSubmitting} colorScheme="green">
              Save
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  )
}

const PasswordForm: React.FC = () => {
  const router = useRouter()
  const [otherError, setOtherError] = useState("")
  const {
    register,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    reset,
    errors,
    watch,
  } = useForm<UserPasswordData>()

  useEffect(() => {
    reset()
  }, [reset])

  const current_password_raw = watch("current_password", "")
  const current_password = useDebounce(current_password_raw, 1000)

  useEffect(() => {
    if (current_password.length > 0) {
      isCurrentPasswordOk(current_password).then((ok) => {
        if (ok) {
          clearErrors("current_password")
        } else {
          setError("current_password", { message: "Password doesn't match your current one" })
        }
      })
    }
  }, [current_password, setError, clearErrors])

  const onSubmit = async (data: UserPasswordData) => {
    const { current_password, password, confirm_password } = data

    if (password.length < 5) {
      return setError("password", { message: "Password too short" })
    }

    if (password !== confirm_password) {
      return setError("confirm_password", { message: "Passwords don't match" })
    }

    try {
      await changePassword({ current_password, password })
      router.push("/user")
    } catch (err) {
      if (err.message === "old_no_match") {
        return setError("current_password", { message: "Password doesn't match your current one" })
      }

      setOtherError(err.toString())
    }
  }

  return (
    <Box w="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="flex-start">
          {otherError && (
            <Heading size="sm" color="red.500">
              {otherError}
            </Heading>
          )}
          <Input
            name="current_password"
            error={errors.current_password?.message}
            ref={register({ required: true })}
            isRequired
          />
          <Divider />
          <Input
            name="password"
            error={errors.password?.message}
            ref={register({ required: true })}
            isRequired
          />
          <Input
            name="confirm_password"
            error={errors.confirm_password?.message}
            ref={register({ required: true })}
            isRequired
          />
          <Flex w="100%" justify="flex-end">
            <Button type="submit" isLoading={formState.isSubmitting} colorScheme="green">
              Change password
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  )
}

const UserDetails: React.FC = () => {
  const [user, refetch] = useCurrentUser()

  return (
    <Stack>
      <Section
        title="Edit user profile"
        titleSize="xl"
        right={<LinkButton href="/user">Back to user</LinkButton>}
      ></Section>
      <Section title="Personal">
        {user ? <UserForm user={user} refetch={refetch} /> : <Heading>Loading user...</Heading>}
      </Section>
      <Section title="Authentication">
        <PasswordForm />
      </Section>
    </Stack>
  )
}

const UserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <UserDetails />
    </Suspense>
  )
}

UserPage.getLayout = (page) => <Layout>{page}</Layout>

export default UserPage
