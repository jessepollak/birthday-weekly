import { Firestore } from '@google-cloud/firestore'
import { initialize, getRepository } from 'fireorm'
import User from './user'

export async function configure(app) {
  const db = new Firestore({
    projectId: 'birthday-weekly',
    keyFilename: './credentials.json'
  })

  initialize(db)

  return db
}