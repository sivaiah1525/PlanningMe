import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalenderService {

  constructor() { }




  loginpage() {
    const clientId:any=environment.googleclientid
    const gooleredirectUri:any=environment.gooleredirectUri
    const scope='https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    const redirectUrlWithPrompt = `https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(gooleredirectUri)}&client_id=${clientId}&prompt=consent`
    window.location.href = redirectUrlWithPrompt;
  }
}
