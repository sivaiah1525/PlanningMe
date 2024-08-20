import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagesiteService {

  
managesite$ = new Subject<any>();
managesitecreate = this.managesite$.asObservable();

managesitegroup$ = new Subject<any>();
managesitegroupcreate = this.managesitegroup$.asObservable();

managesitetarget$ = new Subject<any>();
managesitetargetcreate = this.managesitetarget$.asObservable();
  constructor() { }
}
