import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    let tokenizedRequest;
    // Check if the request URL matches the domain where you want to skip Authorization
    if (request.url.startsWith('https://accounts.google.com/.well-known/openid-configuration')) {
      // Clone the request without adding the Authorization header
      tokenizedRequest = request;
    }else if(request.url.startsWith('https://www.googleapis.com/gmail/v1/users/me/messages')||request.url.startsWith('https://www.googleapis.com/drive/v3/files') ||request.url.startsWith('https://oauth2.googleapis.com/tokeninfo') ||request.url.startsWith('https://your-oauth-server/token/introspect') ||request.url.startsWith('https://graph.microsoft.com/v1.0')  ){
      const outhAccessToken=localStorage.getItem('outhAccessToken')
      tokenizedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${outhAccessToken}`
        }
      });
    }
     else {
      if (token && !this.jwtHelperService.isTokenExpired(token)) {
        // Add the Authorization header if the token is valid and the request is not to the excluded domain
        tokenizedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}` 
          }
        });
      } else {
        // Navigate to login if token is expired or missing
        tokenizedRequest = request;
        // this.router.navigate(['/auth/login']);
        // return;
      }
    }

    // Proceed with the modified request
    return next.handle(tokenizedRequest);
  }
}
