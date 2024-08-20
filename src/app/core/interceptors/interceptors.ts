import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpBackend } from '@angular/common/http';
import { SpinnerService } from '../services/spinner.service';
import 'rxjs/add/operator/do';

@Injectable()
export class I1 implements HttpInterceptor {

  constructor(public spinnerService: SpinnerService) {
    // console.log(SpinnerService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinnerService.show();

    return next.handle(req).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spinnerService.hide();
        }
      },
      (err: any) => {

      }
    );
  }
}
