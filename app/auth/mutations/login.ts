import { SessionContext } from "blitz"
import { authenticateUser } from "app/auth/auth-utils"
import { LoginInput, LoginInputType } from "../validations"

export default async function login(input: LoginInputType, ctx: { session?: SessionContext } = {}) {
  const { email, password } = LoginInput.parse(input)

  const user = await authenticateUser(email, password)
  await ctx.session!.create({ userId: user.id, roles: [user.role] })

  return user
}
