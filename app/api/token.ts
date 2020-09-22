import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { getClient } from "app/lib/new/gcal"

const tokenHandler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { code, state } = req.query

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    return res.json({ ok: false, error: "Something is missing or is Array" })
  }

  const { tokens } = await getClient().getToken(code)

  res.json({ tokens, state })
}

export default tokenHandler
