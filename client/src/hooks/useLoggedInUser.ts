import { useResource, useError } from "rest-hooks";
import UserResource from '../resources/UserResource'

export default function useLoggedInUser(): UserResource {
  return useResource(UserResource.detailShape(), { id: 'me' })
}