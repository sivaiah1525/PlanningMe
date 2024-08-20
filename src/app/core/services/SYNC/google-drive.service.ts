import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  constructor(

  ) {

  }
  loginpage() {
    const clientId=environment.googleclientid
    const scope='https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    const redirectUrlWithPrompt = `https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(environment.gooleredirectUri)}&client_id=${clientId}&prompt=consent`
    window.location.href = redirectUrlWithPrompt;
  }
}

