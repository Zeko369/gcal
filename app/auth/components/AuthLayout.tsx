import React from "react"
import { Box, Heading, useColorModeValue } from "@chakra-ui/core"

export const AuthLayout: React.FC = ({ children }) => {
  const bg = useColorModeValue("blue.300", "gray.700")
  const bgCard = useColorModeValue("white", "black")

  return (
    <Box h="100vh" w="100wv" bg={bg}>
      <Box
        pos="absolute"
        top="30vh"
        left="50%"
        w="80%"
        maxW="350px"
        transform="translate(-50%, max(-50%, -20vh))"
      >
        <Heading mb="4">Gcal app</Heading>
        <Box borderWidth="1px" rounded="lg" p="5" bg={bgCard}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
