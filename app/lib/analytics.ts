import { SplitbeeAnalytics } from "@splitbee/node"
import db from "db"

// backend
const splitbeeInit = () => {
  if (process.env.NEXT_PUBLIC_SPLITBEE_TOKEN) {
    return new SplitbeeAnalytics(process.env.NEXT_PUBLIC_SPLITBEE_TOKEN)
  }
}

const nodeSplitbee = splitbeeInit()

export const nodeTrack = async (id: number, event: string, data?: any) => {
  const user = await db.user.findOne({ where: { id } })

  if (!user) {
    throw new Error("Can't find user")
  }

  await nodeSplitbee?.track({ userId: user.email, event, data })
}
