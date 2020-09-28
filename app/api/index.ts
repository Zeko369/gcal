import { NextApiHandler } from "next"

const apiIndex: NextApiHandler = async (req, res) => {
  res.send("Hello there<br/>General Kenobi")
}

export default apiIndex
