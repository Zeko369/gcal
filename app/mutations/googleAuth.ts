import { getClient, scopes } from "app/lib/gcal"
import { Ctx } from "blitz"
import { nanoid } from "nanoid"
import db from "db"

const googleAuth = async (input: { redirect?: string }, ctx: Ctx) => {
  const userId = ctx.session.userId as number
  const token = nanoid()

  await db.user.update({ where: { id: userId }, data: { googleTokenRef: token } })
  const state = JSON.stringify({
    token,
    userId,
    ...(input?.redirect ? { redirect: input.redirect } : {}),
  })

  const authorizeUrl = getClient().generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "),
    prompt: "consent",
    state,
  })

  return authorizeUrl
}

export default googleAuth
