import { nodeTrack } from "app/lib/analytics"
import { Ctx } from "blitz"
import db from "db"

const revokeGoogleToken = async (input: any, ctx: Ctx) => {
  const userId = ctx.session.userId as number
  await nodeTrack(userId, "google:revoke")
  await db.user.update({ where: { id: userId }, data: { googleTokenRef: null, googleToken: null } })
}

export default revokeGoogleToken
