import { hashPassword } from "app/auth/auth-utils"
import db from "db"

const seed = async () => {
  const user = await db.user.create({
    data: { email: "foo@bar.com", hashedPassword: await hashPassword("foobar") },
  })

  console.log(user)
}

export default seed
