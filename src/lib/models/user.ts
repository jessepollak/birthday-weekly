import { Collection, getRepository } from 'fireorm'


export interface UserGoogleCredentials {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiryDate?: number;
  tokenType?: string;
}

@Collection()
export default class User {
  id: string;
  googleProfileId: string;
  name: string;
  email: string;
  googleCredentials: UserGoogleCredentials
}

export class UserRepository {
  static async find(id: string): Promise<User> {
    return this.repository().findById(id)
  }
  
  static async all(): Promise<Array<User>> {
    return this.repository().find()
  }

  static async findOrCreateByGoogleProfileId(profileId: string, attributes: object = {}): Promise<User> {
    const repository = this.repository()

    let user = (await repository.whereEqualTo('googleProfileId', profileId).find())[0]

    if (user === undefined) { 
      attributes['googleProfileId'] = profileId
      const userToBeSaved = new User()
      for (let property in attributes) {
        userToBeSaved[property] = attributes[property]
      }
      user = await repository.create(userToBeSaved)
    }

    return user
  }

  static async updateUserGoogleCredentials(user, credentials: { accessToken, refreshToken }) {
    const repository = this.repository()
    user.credentials = credentials
    return repository.update(user)
  }

  static repository() {
    return getRepository(User)
  }
}