import React, { ReactNode, Suspense } from "react"
import { Head, useMutation } from "blitz"
import {
  HStack,
  Flex,
  Box,
  Heading,
  Avatar,
  Button,
  Spinner,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  Text,
} from "@chakra-ui/react"
import { Link, LinkButton } from "chakra-next-link"
import NextLink from "next/link"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const User: React.FC = () => {
  const [currentUser] = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const { colorMode, toggleColorMode } = useColorMode()
  const dark = colorMode === "dark"

  return currentUser ? (
    <Menu>
      <MenuButton>
        <Avatar name={currentUser?.name || ""} cursor="pointer" />
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            toggleColorMode()
          }}
        >
          <HStack align="center">
            {dark ? <MoonIcon /> : <SunIcon />}
            <Text>{dark ? "Dark" : "Light"} theme</Text>
          </HStack>
        </MenuItem>
        <Link href="/user">
          <MenuItem>Profile</MenuItem>
        </Link>
        <Link href="/calendars/new">
          <MenuItem>New calendar</MenuItem>
        </Link>
        <MenuItem onClick={async () => await logoutMutation()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <LinkButton href="/login">Login</LinkButton>
  )
}

const Nav: React.FC = () => {
  return (
    <Flex p="2" bg="#1a73e8" justify="space-between" alignItems="center">
      <Heading color="white">
        <Link href="/" noUnderline>
          Gcal
        </Link>
      </Heading>

      <Flex justifyContent="flex-end">
        <Suspense fallback={<Spinner />}>
          <User />
        </Suspense>
      </Flex>
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

      {/* Main */}
      <Box as="main" minHeight="calc(100vh - 56px)">
        <Nav />
        <Box w="90%" maxW="1100px" m="0 auto" my="4" pb="10">
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </Box>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="#000" color="gray.500" py="4" textAlign="center">
        Gcal app copyright Fran Zekan
      </Box>
    </>
  )
}

export default Layout
