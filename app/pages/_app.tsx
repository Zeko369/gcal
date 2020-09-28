import React, { useReducer } from "react"
import { AppProps, ErrorComponent, useRouter } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import LoginForm from "app/auth/components/LoginForm"
import { ChakraProvider } from "@chakra-ui/core"
import { initialState, reducer, StoreContext } from "app/lib/reducer"

import { Global, css } from "@emotion/core"
const globalStyles = css`
  #__next {
    min-height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
`

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        queryCache.resetErrorBoundaries()
      }}
    >
      <Global styles={globalStyles} />
      <ChakraProvider resetCSS>
        <StoreContext.Provider value={{ dispatch, state }}>
          {getLayout(<Component {...pageProps} />)}
        </StoreContext.Provider>
      </ChakraProvider>
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
