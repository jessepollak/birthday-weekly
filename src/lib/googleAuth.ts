import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import { Credentials } from 'google-auth-library'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/contacts']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

interface CredentialsObject {
  installed: {
    client_secret: string,
    client_id: string,
    redirect_uris: Array<string>
  }
}

export async function loadCredentialsAndExecute(callback: Function) {
  return new Promise((resolve, reject) => {
    fs.readFile('credentials.json', async (err, content) => {
      if (err) reject(err)
      // Authorize a client with credentials, then call the Google Tasks API.
      resolve(await authorize(JSON.parse(content.toString()), callback))
    })
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials: CredentialsObject, callback: Function) {
  return new Promise((resolve, reject) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) resolve(await getNewToken(oAuth2Client, callback))
      oAuth2Client.setCredentials(JSON.parse(token.toString()))
      resolve(await callback(oAuth2Client))
    })
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getNewToken(oAuth2Client: OAuth2Client, callback: Function) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close()
      oAuth2Client.getToken(code, async (err, token) => {
        if (err) return reject(err)
        oAuth2Client.setCredentials(token as Credentials)
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), async (err) => {
          if (err) return reject(err)
          console.log('Token stored to', TOKEN_PATH)
        })

        resolve(await callback(oAuth2Client))
      })
    })
  })
}
