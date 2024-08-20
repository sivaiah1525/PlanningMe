
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class GmailsService {
  constructor(
    private readonly oAuthservice: OAuthService,
    private http: HttpClient
  ) {

  }
  loginpage() {
    const clientId=environment.googleclientid
    const scope='https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/contacts.readonly'
    const redirectUrlWithPrompt = `https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(environment.gooleredirectUri)}&client_id=${clientId}&prompt=consent`
    window.location.href = redirectUrlWithPrompt;
  }
}

