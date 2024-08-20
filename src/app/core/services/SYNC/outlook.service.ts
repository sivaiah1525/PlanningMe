import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutlookService {

  constructor() { }


  loginpage() {
    const clientId=environment.mircosoftclintId
    const scope = 'https://graph.microsoft.com/Mail.Read offline_access User.Read profile email openid';
    const redirectUrlWithPrompt = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(environment.MicrosoftredirectUri)}&prompt=consent`
    window.location.href = redirectUrlWithPrompt;
  }

}
