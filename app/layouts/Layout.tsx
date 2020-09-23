import React, { ReactNode, Suspense } from "react"
import { Head } from "blitz"
import { HStack, Flex, Container, Heading, Avatar, Button, Spinner } from "@chakra-ui/core"
import { Link, LinkButton } from "chakra-next-link"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const User: React.FC = () => {
  const currentUser = useCurrentUser()

  return currentUser ? (
    <HStack alignItems="center">
      <Button onClick={async () => await logout()}>Logout</Button>
      <Avatar name={currentUser.name || ""} />
    </HStack>
  ) : (
    <HStack>
      <LinkButton href="/login">Login</LinkButton>
    </HStack>
  )
}

const Nav = () => {
  return (
    <Flex p="2" bg="#1a73e8" justify="space-between">
      <Link href="/">
        <Heading color="white">Gcal thingy</Heading>
      </Link>
      <Suspense fallback={<Spinner />}>
        <User />
      </Suspense>
    </Flex>
  )
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "gcal"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <Container mt="2">{children}</Container>
    </>
  )
}

export default Layout
