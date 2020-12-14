import { hashPassword, verifyPassword } from "app/auth/auth-utils"
import { AuthenticationError, Ctx } from "blitz"
import db from "db"
import SecurePassword from "secure-password"

const isCurrentPasswordOk = async (password: string, ctx: Ctx) => {
  ctx.session.authorize()

  const user = await db.user.findOne({ where: { id: ctx.session!.userId } })
  if (!user || !user.hashedPassword) throw new AuthenticationError()

  switch (await verifyPassword(user.hashedPassword, password)) {
    case SecurePassword.VALID_NEEDS_REHASH:
      // Upgrade hashed password with a more secure hash
      const improvedHash = await hashPassword(password)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
    // eslint-disable-next-line no-fallthrough
    case SecurePassword.VALID:
      return true
    default:
      return false
  }
}

export default isCurrentPasswordOk
