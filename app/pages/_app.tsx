import React, { useEffect } from "react"
import { AppProps, ErrorComponent, useRouter } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { ChakraProvider } from "@chakra-ui/react"
import { queryCache } from "react-query"
import splitbee from "@splitbee/web"

import LoginForm from "app/auth/components/LoginForm"
import { Global } from "app/styles/Global"
import { useCurrentUser } from "app/hooks/useCurrentUser"

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)
  const [user] = useCurrentUser({}, false)

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      splitbee.user.set({ email: user.email })
    }
  }, [user])

  return <ChakraProvider resetCSS>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
}

export default function App(props: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SPLITBEE_TOKEN) {
      splitbee.init({
        token: process.env.NEXT_PUBLIC_SPLITBEE_TOKEN,
        scriptUrl: "/bee.js",
        apiUrl: "/_hive",
      })
    }
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        queryCache.resetErrorBoundaries()
      }}
    >
      <Global />
      <MyApp {...props} />
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === "AuthenticationError") {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error?.name === "AuthorizationError") {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}
