import { Document, Html, DocumentHead, Main, BlitzScript } from "blitz"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <DocumentHead>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        </DocumentHead>
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
