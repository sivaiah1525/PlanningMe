import {NativeDateAdapter} from '@angular/material/core';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn :'root'
})

export class AppDateAdapter extends NativeDateAdapter {

    parse(value:any): Date | null {
        if((typeof value === 'string') && (value.indexOf('/') > -1)){
            const str = value.split('/');
            const year =  Number(str[2]);
            const month =  Number(str[1]);
            const date =  Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    format(date: Date, displayFormat: string) : string{
        if(displayFormat == 'input') {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else if(displayFormat == 'inputMonth') {
            let month = date.getMonth() + 1 ;
            let year = date.getFullYear();
            return  this._to2digit(month) + '/' + year;
        } else {
            return date.toDateString();
        }
    }

    private _to2digit(n:number) {
        return('00' + n).slice(-2);
    }
}

export const APP_DATE_FORMATS = {
    parse: {
        dateInput : {month: 'short', year: 'numeric', day:'numeric'}
    },
    display: {
        dateInput : 'input',
        monthYearLabel: 'inputMonth',
        dateA11yLabel: {year: 'numeric', month:'long', day: 'numeric'},
        monthYearA11yLabel: { year: 'numeric', month: 'long'}
    }
} 