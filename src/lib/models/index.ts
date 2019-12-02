import { Firestore } from '@google-cloud/firestore'
import { initialize as initializeFireorm } from 'fireorm'

export async function configure(app) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    console.warn("Please configure GOOGLE_APPLICATION_CREDENTIALS_BASE64 to use the database.")
    throw new Error("Missing configuration")
  }

  const db = new Firestore({ 
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('ascii'))
  })

  initializeFireorm(db)

  return db
}