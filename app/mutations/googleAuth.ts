import { getClient, scopes } from "app/lib/new/gcal"
import { SessionContext } from "blitz"
import { nanoid } from "nanoid"
import db from "db"

const googleAuth = async (input?: any, ctx: { session?: SessionContext } = {}) => {
  const userId = ctx.session!.userId as number
  const token = nanoid()

  await db.user.update({ where: { id: userId }, data: { googleTokenRef: token } })
  const state = JSON.stringify({ token, userId })

  const authorizeUrl = getClient().generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
    state,
  })

  return authorizeUrl
}

export default googleAuth
