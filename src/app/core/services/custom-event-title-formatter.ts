import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    constructor(@Inject(LOCALE_ID) private locale: string) {
        super();
    }

    // you can override any of the methods defined in the parent class
    month(event: CalendarEvent): string {
        return this.convertEventTitle(event);
    }

    week(event: CalendarEvent): string {
        return this.convertEventTitle(event);
    }

    day(event: CalendarEvent): string {
        return this.convertEventTitle(event);
    }

    convertEventTitle(event: CalendarEvent): string {
        return `<b>${new DatePipe(this.locale).transform(
            event.start,
            'h:m aaaaa',
            this.locale
        )}</b> ${event.title}`;
    }
}