import { hashPassword } from "app/auth/auth-utils"
import { Ctx } from "blitz"
import db from "db"
import isCurrentPasswordOk from "./isCurrentPasswordOk"

const changePassword = async (
  { current_password, password }: { current_password: string; password: string },
  ctx: Ctx
) => {
  ctx.session.authorize()

  const currentOk = await isCurrentPasswordOk(current_password, ctx)

  if (!currentOk) {
    throw new Error("old_no_match")
  }

  const hashedPassword = await hashPassword(password)
  await db.user.update({ where: { id: ctx.session!.userId }, data: { hashedPassword } })
}

export default changePassword
