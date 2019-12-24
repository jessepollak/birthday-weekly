import moment, { Moment } from 'moment'
import BaseResource from './BaseResource';

export default class BirthdayResource extends BaseResource {
  readonly id: string | undefined = undefined;
  readonly name: string = '';
  readonly image: string = '';
  readonly source: string = '';
  readonly date: Date = new Date();

  readonly preferences: {
    ignore: boolean
  } | undefined = undefined

  pk() {
    return this.id;
  }

  public birthdayMoment(): Moment {
    return moment.utc(this.date)
  }

  public formattedAge(): string {
    const yearDiff = moment.utc().diff(this.birthdayMoment(), 'years')
    if (yearDiff !== 0) {
      return `${yearDiff + 1}`
    } else {
      return 'Unknown'
    }
  }

  static upcomingShape<T extends typeof BaseResource>(this: T) {
    return {
      ...this.listShape(),
      schema: {
        withinSevenDays: [this.getEntitySchema()],
        withinThirtyDays: [this.getEntitySchema()]
      },
      getFetchKey: () => {
        return '/upcoming/';
      },
      fetch: (params: {}, body?: Readonly<object | string>) => {
        return this.fetch('get', `${this.listUrl()}/upcoming/`)
      },
    }
  }

  static urlRoot = '/api/birthdays/';
}