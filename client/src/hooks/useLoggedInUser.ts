import { useResource, useError } from "rest-hooks";
import UserResource from '../resources/UserResource'
import { useStatefulResource } from "@rest-hooks/legacy";

export default function useLoggedInUser(): UserResource {
  return useResource(UserResource.detailShape(), { id: 'me' })
}

interface ILoggedInUserState {
  state: 'loggedin' | 'loading' | 'loggedout',
  user: UserResource
}

export function useLoggedInUserState(): ILoggedInUserState {
  const { data: user, loading } = useStatefulResource(UserResource.detailShape(), { id: 'me' })
  if (loading) {
    return {
      user,
      state: 'loading'
    }
  } else if (user) {
    return {
      user,
      state: 'loggedin'
    }
  } else {
    return {
      user,
      state: 'loggedout'
    }
  }
}