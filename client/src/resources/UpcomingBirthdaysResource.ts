import BaseResource from './BaseResource';
import BirthdayResource from './BirthdayResource';
import { Resource, AbstractInstanceType, schemas } from 'rest-hooks';

export default class UpcomingBirthdaysResource extends BaseResource {
  readonly withinSevenDays: string[] = [];
  readonly withinThirtyDays: string[] = [];

  pk() {
    return "upcoming";
  }

  static getEntitySchema<T extends typeof Resource>(this: T): schemas.Entity<Readonly<AbstractInstanceType<T>>> {
   const schema = super.getEntitySchema()
    schema.define({
      withinSevenDays: [BirthdayResource.getEntitySchema()],
      withinThirtyDays: [BirthdayResource.getEntitySchema()],
    })
    return schema as any
  }

  static urlRoot = '/api/birthdays/';
}