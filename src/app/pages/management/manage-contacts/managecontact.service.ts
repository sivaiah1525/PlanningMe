import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagecontactService {
  // private userSubject: BehaviorSubject<any> = new BehaviorSubject(false);

  managecontact$ = new Subject<any>();
  managecontactcreate = this.managecontact$.asObservable();


  managecontactgroup$ = new Subject<any>();
  managecontactgroupcreate = this.managecontactgroup$.asObservable();

  
  managecontacttarget$ = new Subject<any>();
  managecontacttargetcreate = this.managecontacttarget$.asObservable();
  constructor() { }

}
