import { Global as GlobalStyles, css } from "@emotion/core"

export const globalStyles = css`
  html {
    height: -webkit-fill-available;
  }

  body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  #__next {
    min-height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  /* Because Safari */
  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) and (stroke-color: transparent) {
      #__next {
        min-height: -webkit-fill-available;
      }
    }
  }
`

export const Global: React.FC = () => {
  return <GlobalStyles styles={globalStyles} />
}
