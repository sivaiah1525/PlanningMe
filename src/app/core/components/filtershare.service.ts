import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltershareService {

  filterOtherPepole$ = new Subject<any>();
  filterOtherPepole = this.filterOtherPepole$.asObservable();

  filterDetails$ = new Subject<any>();
  filterDetailsob = this.filterDetails$.asObservable();


  createevent$ = new Subject<any>();
  createeventref = this.createevent$.asObservable();

  constructor() { }
}
