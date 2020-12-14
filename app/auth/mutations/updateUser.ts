import { Ctx } from "blitz"
import db, { UserUpdateArgs } from "db"

type UpdateUserInput = {
  data: UserUpdateArgs["data"]
}
const updateUser = async ({ data }: UpdateUserInput, ctx: Ctx) => {
  ctx.session.authorize()

  const user = await db.user.update({ where: { id: ctx.session.userId }, data })
  return user
}

export default updateUser
