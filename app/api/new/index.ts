import { getClient, scopes } from "app/lib/new/gcal"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const newToken = (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const authorizeUrl = getClient().generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
    state: "foo",
  })

  res.redirect(authorizeUrl)
}

export default newToken
