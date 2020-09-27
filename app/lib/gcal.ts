import { google } from "googleapis"

export const getClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000/api/token"
  )

  return oauth2Client
}

export const scopes = ["https://www.googleapis.com/auth/calendar.readonly"]
