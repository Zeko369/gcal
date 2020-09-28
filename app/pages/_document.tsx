import React from "react"
import { Document, Html, DocumentHead, Main, BlitzScript } from "blitz"
import { ColorModeScript } from "@chakra-ui/core"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <DocumentHead>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </DocumentHead>
        <body>
          <ColorModeScript defaultColorMode="dark" />
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
