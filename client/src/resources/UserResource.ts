import BaseResource from './BaseResource';

export default class UserResource extends BaseResource {
  readonly id: string | undefined = undefined;
  readonly name: string = '';
  readonly email: string = '';

  pk() {
    return this.id;
  }

  static urlRoot = '/api/users/';
}