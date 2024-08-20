import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class SpinnerService {
  private visible$ = new BehaviorSubject<boolean>(false);

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }

  isVisible(): Observable<boolean> {
    return this.visible$.asObservable().pipe(share());
  }
}