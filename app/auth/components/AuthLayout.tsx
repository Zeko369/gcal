import React, { createContext, useReducer } from "react"
import { Box, Heading, useColorModeValue } from "@chakra-ui/core"

type AuthAction =
  | { type: "reset" }
  | { type: "setName"; payload: string | undefined }
  | { type: "setEmail"; payload: string | undefined }
  | { type: "setPassword"; payload: string | undefined }
export interface AuthState {
  name?: string
  email?: string
  password?: string
}
interface AuthStore {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}
const authInitStore: AuthState = { name: "", email: "", password: "" }
export const AuthContext = createContext<AuthStore>({ state: authInitStore, dispatch: () => {} })

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.payload }
    case "setPassword":
      return { ...state, password: action.payload }
    case "setName":
      return { ...state, name: action.payload }
    case "reset":
      return authInitStore
    default:
      return state
  }
}

export const AuthLayout: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {}, () => authInitStore)

  const bg = useColorModeValue("blue.300", "gray.700")
  const bgCard = useColorModeValue("white", "black")

  console.log(state)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
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
    </AuthContext.Provider>
  )
}
