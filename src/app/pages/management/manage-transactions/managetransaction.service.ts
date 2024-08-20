import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagetransactionService {

managetransaction$ = new Subject<any>();
managetransactioncreate = this.managetransaction$.asObservable();
  constructor() { }
}
