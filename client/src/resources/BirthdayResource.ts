import BaseResource from './BaseResource';

export default class BirthdayResource extends BaseResource {
  readonly id: string | undefined = undefined;
  readonly name: string = '';
  readonly image: string = '';
  readonly source: string = '';
  readonly date: Date = new Date();

  pk() {
    return this.id;
  }

  static urlRoot = '/api/birthdays/';
}