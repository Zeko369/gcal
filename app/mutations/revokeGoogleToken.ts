import { SessionContext } from "blitz"
import db from "db"

const revokeGoogleToken = async (input?: any, ctx: { session?: SessionContext } = {}) => {
  const userId = ctx.session!.userId as number
  await db.user.update({ where: { id: userId }, data: { googleTokenRef: null, googleToken: null } })
}

export default revokeGoogleToken
