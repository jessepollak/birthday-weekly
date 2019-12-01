import { Request, Resource } from 'rest-hooks';

export default abstract class BaseResource extends Resource {
  static fetchPlugin = (request: Request) => request.withCredentials()
}