import BaseResource from './BaseResource';
import BirthdayResource from './BirthdayResource';

export default class UpcomingBirthdaysResource extends BaseResource {
  readonly withinSevenDays: Array<BirthdayResource> = [];
  readonly withinThirtyDays: Array<BirthdayResource> = [];

  pk() {
    return "upcoming";
  }

  static urlRoot = '/api/birthdays/';
}