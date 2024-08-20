import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
interface Size  {
  size: number | string;
}
const ANONYMOUS_USER: Size = {
  size: ''
};

@Injectable({ providedIn: 'root' }) // could be @Injectable({ providedIn: 'root' }) in 6+ version
export class ResizeService {
  data: any;
  private subject = new BehaviorSubject<Size>(ANONYMOUS_USER);

  size$: Observable<Size> = this.subject.asObservable();

  loadSize(size: Size) {
      this.subject.next(size);
  }
 
setData(data: string | number){
  this.data = data;
}
getData() {
let temp = this.data;
return temp;
}
}