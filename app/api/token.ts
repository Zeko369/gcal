import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { getClient } from "app/lib/gcal"
import db from "db"

const tokenHandler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const { code, state } = req.query

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    return res.json({ ok: false, error: "Something is missing or is Array" })
  }

  const { tokens } = await getClient().getToken(code)
  const { token, userId } = JSON.parse(state)

  if (!token || !userId) {
    throw new Error("Token or userId missing")
  }

  const user = await db.user.findOne({ where: { id: userId } })

  if (!user) {
    throw new Error("Wrong userId")
  }

  if (user.googleTokenRef !== token) {
    throw new Error("Wrong token")
  }

  await db.user.update({ where: { id: userId }, data: { googleToken: JSON.stringify(tokens) } })

  console.log(tokens)

  res.json({ ok: true })

  // res.redirect("/foo")
}

export default tokenHandler
