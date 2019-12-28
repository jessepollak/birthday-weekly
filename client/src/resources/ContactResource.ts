import moment, { Moment } from 'moment'
import BaseResource from './BaseResource';

export default class ContactResource extends BaseResource {
  readonly id: string | undefined = undefined;
  readonly name: string = '';
  readonly image: string = '';
  readonly source: string = '';
  readonly birthday: Date = new Date();

  readonly preferences: {
    ignore: boolean
  } | undefined = undefined

  pk() {
    return this.id;
  }

  public birthdayMoment(): Moment {
    return moment.utc(this.birthday)
  }

  public formattedAge(): string {
    const yearDiff = moment.utc().diff(this.birthdayMoment(), 'years')
    if (yearDiff !== 0) {
      return `${yearDiff + 1}`
    } else {
      return 'NA'
    }
  }

  public formattedName(): string {
    return this.name
    // const [firstName, ...rest] = this.name.split(" ")
    // return [firstName, ...rest.map((n) => n[0] + ".")].join(" ")
  }

  static getFetchOptions() {
    return {
      invalidIfStale: true
    }
  }

  static upcomingBirthdaysShape<T extends typeof BaseResource>(this: T) {
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
        let url = `${this.listUrl()}upcoming`
        return this.fetch('get', url)
      },
    }
  }

  static refreshState<T extends typeof BaseResource>(this: T) {
    return {
      ...this.createShape(),
      schema: {},
      getFetchKey: () => {
        return '/refresh/';
      },
      fetch: (params: {}, body?: Readonly<object | string>) => {
        let url = `${this.listUrl()}refresh`
        return this.fetch('post', url)
      },
    }
  }

  static urlRoot = '/api/contacts/';
}