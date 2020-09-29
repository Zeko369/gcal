import React, { Suspense } from "react"
import { BlitzPage } from "blitz"
import {
  VStack,
  Heading,
  Spinner,
  Divider,
  Button,
  Text,
  useColorMode,
  Flex,
} from "@chakra-ui/core"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import Layout from "app/layouts/Layout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { RestGoogleToken } from "app/components/RestGoogleToken"
import revokeGoogleToken from "app/mutations/revokeGoogleToken"
import { LinkButton } from "chakra-next-link"

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

const Section: React.FC<{ title: string; titleSize?: string; right?: React.ReactElement }> = (
  props
) => {
  const { children, title, titleSize, right } = props

  return (
    <>
      <Flex justify="space-between" align="center" w="100%">
        <Heading size={titleSize || "md"}>{title}</Heading>
        {right}
      </Flex>
      <VStack alignItems="flex-start" spacing="1">
        {children}
      </VStack>
      <Divider mt="4" />
    </>
  )
}

const UserDetails: React.FC = () => {
  const [user, refetch] = useCurrentUser({
    createdAt: true,
    googleToken: true,
    calendars: true,
    sessions: true,
  })
  const { colorMode, toggleColorMode } = useColorMode()

  if (!user) {
    return <Heading>Loading user...</Heading>
  }

  return (
    <VStack alignItems="flex-start">
      <Section
        title={`Hello, ${user.name}`}
        titleSize="xl"
        right={
          <LinkButton href="/user/edit" colorScheme="blue">
            Edit profile
          </LinkButton>
        }
      />
      <Section title="Account details">
        <Text>
          <strong>Email: </strong> {user.email}
        </Text>
        <Text>
          <strong>Role: </strong> {user.role}
        </Text>
      </Section>
      <Section title="Google auth">
        {user.googleToken ? (
          <RevokeGoogleToken onSuccess={refetch} />
        ) : (
          <RestGoogleToken redirect="/user" />
        )}
      </Section>
      <Section title="Calendars">
        <Text>Count: {user.calendars.length}</Text>
      </Section>
      <Section title={`Theme: ${colorMode}`}>
        <Button
          onClick={toggleColorMode}
          rightIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        >
          {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Section>
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
