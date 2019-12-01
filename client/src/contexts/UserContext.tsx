import React, { FunctionComponent } from 'react'
import UserResource from '../resources/UserResource'

interface IUserContext {
  user: UserResource | undefined;
  initialized: boolean;
  setUser: (u: UserResource) => void;
}

export const UserContext = React.createContext<IUserContext>({
  user: undefined,
  initialized: false,
  setUser: (u: UserResource) => { throw new Error("not implemented") }
})

export const UserProvider: FunctionComponent<{}> = ({ children }) => {
  const [user, setUser] = React.useState<UserResource | undefined>()
  const [initialized, setInitialized] = React.useState<boolean>(false)

  const setUserAndInitialized = (user: UserResource) => {
    setInitialized(true)
    setUser(user)
  }

  return (
    <UserContext.Provider value={{ user: user, setUser: setUserAndInitialized, initialized: initialized }}>
      {children}
    </UserContext.Provider>
  )
}