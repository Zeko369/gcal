import React from "react"
import { Document, Html, DocumentHead, Main, BlitzScript } from "blitz"
import { ColorModeScript } from "@chakra-ui/react"

class MyDocument extends Document {
  static getInitialProps(ctx) {
    return Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html lang="en">
        <DocumentHead>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </DocumentHead>
        <body>
          <ColorModeScript initialColorMode="dark" />
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
