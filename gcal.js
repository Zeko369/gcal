const fs = require("fs");
const readline = require("readline");
const { promisify } = require("util");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * @function
 * @template A
 * @param {(auth: any) => Promise<A>} callback
 * @returns {() => Promise<A | null>}
 */
const authenticatedWrapper = (callback) => async () => {
  try {
    const content = await fs.promises.readFile("credentials.json", "utf-8");

    const { client_secret, client_id, redirect_uris } = JSON.parse(
      content
    ).installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.promises.readFile(TOKEN_PATH, "utf-8");
      oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      await getAccessToken(oAuth2Client);
    }

    return callback(oAuth2Client);
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 *
 * @param {any} oAuth2Client
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await promisify(rl.question)(
    "Enter the code from that page here: "
  );

  rl.close();

  try {
    const token = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(token);

    await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log("Token stored to", TOKEN_PATH);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}

module.exports = { authenticatedWrapper };
