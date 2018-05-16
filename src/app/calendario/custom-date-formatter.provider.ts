import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { getISOWeek, format } from 'date-fns';
import * as esLocale from 'date-fns/locale/es';

export class CustomDateFormatter extends CalendarDateFormatter {

  public weekViewTitle({date, locale}: DateFormatterParams): string {
    const year: string = new Intl.DateTimeFormat(locale, {year: 'numeric'}).format(date);
    const weekNumber: number = getISOWeek(date);
    return `Semana ${weekNumber}`;
  }

  public monthViewTitle({date, locale}: DateFormatterParams): string {
    return '';//format(date, 'MMMM YYYY', {locale: esLocale});
  }

  public dayViewTitle({date, locale}: DateFormatterParams): string {
    return format(date, 'dddd D', {locale: esLocale});
  }

}
