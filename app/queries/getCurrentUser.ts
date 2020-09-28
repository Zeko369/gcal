import db, { UserSelect } from "db"
import { SessionContext } from "blitz"
import { BaseUserSelect } from "app/hooks/useCurrentUser"

export default async function getCurrentUser(
  input?: Omit<UserSelect, BaseUserSelect>,
  ctx: { session?: SessionContext } = {}
) {
  if (!ctx.session?.userId) return null

  const user = await db.user.findOne({
    where: { id: ctx.session!.userId },
    select: { id: true, name: true, email: true, role: true, ...input },
  })

  return user
}
