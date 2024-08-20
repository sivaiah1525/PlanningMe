import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {


  manageuser$ = new Subject<any>();
  manageusercreate = this.manageuser$.asObservable();

  manageusergroup$ = new Subject<any>();
  manageusergroupcreate = this.manageusergroup$.asObservable();

  manageUserTarget$ = new Subject<any>();
  manageUserTargetCreate = this.manageUserTarget$.asObservable();

  constructor() { }
}
