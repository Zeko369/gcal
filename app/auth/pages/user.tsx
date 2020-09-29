import React, { Suspense } from "react"
import { BlitzPage } from "blitz"
import { VStack, Heading, Spinner, Divider, Button, Text, useColorMode } from "@chakra-ui/core"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import Layout from "app/layouts/Layout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { RestGoogleToken } from "app/components/RestGoogleToken"
import revokeGoogleToken from "app/mutations/revokeGoogleToken"

const RevokeGoogleToken: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const auth = async () => {
    await revokeGoogleToken()
    onSuccess()
  }

  return (
    <Button onClick={auth} colorScheme="red">
      Revoke token
    </Button>
  )
}

const UserDetails: React.FC = () => {
  const [user, refetch] = useCurrentUser({ createdAt: true, googleToken: true, calendars: true })
  const { colorMode, toggleColorMode } = useColorMode()

  if (!user) {
    return <Heading>Loading user...</Heading>
  }

  return (
    <VStack alignItems="flex-start">
      <Heading>Hello, {user?.name}</Heading>
      <Divider mt="4" />
      <Heading size="md">Google auth</Heading>
      {user.googleToken ? (
        <RevokeGoogleToken onSuccess={refetch} />
      ) : (
        <RestGoogleToken redirect="/user" />
      )}
      <Divider mt="4" />
      <Heading size="md">Calendars</Heading>
      <Text>Count: {user.calendars.length}</Text>
      <Divider mt="4" />
      <Heading>Theme: {colorMode}</Heading>
      <Button
        onClick={toggleColorMode}
        rightIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      >
        {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Divider mt="4" />
    </VStack>
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
