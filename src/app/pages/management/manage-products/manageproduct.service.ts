import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageproductService {

  
manageproduct$ = new Subject<any>();
manageproductcreate = this.manageproduct$.asObservable();

managegrpproduct$ = new Subject<any>();
manageproductgroupcreate = this.managegrpproduct$.asObservable();

managetargetproduct$ = new Subject<any>();
manageproducttargetcreate = this.managetargetproduct$.asObservable();
  constructor() { }
}
