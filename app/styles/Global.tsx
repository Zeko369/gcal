import { Global as GlobalStyles, css } from "@emotion/react"

export const globalStyles = css`
  body,
  html,
  #__next {
    min-width: 100vw;
    max-width: 100vw;
    width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;
  }

  #__next {
    display: grid;
  }

  @supports (-webkit-touch-callout: none) {
    #__next {
      min-height: -webkit-fill-available;
      max-height: -webkit-fill-available;
    }
  }
`

export const Global: React.FC = () => {
  return <GlobalStyles styles={globalStyles} />
}
