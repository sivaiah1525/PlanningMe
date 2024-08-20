import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  constructor(
    private readonly oAuthservice: OAuthService,
    private http: HttpClient
  ) {

  }

  async convertGoogleDriveUrlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename);
  }

  GetFileFromDrive(ACToken: string, FileId:any, fileName:any,isonedrive:any) {
    return this.http.get(baseUrl + '/api/File/GetFileFromDrive?ACToken=' + ACToken + '&FileId=' + FileId + '&fileName=' + fileName+'&isonedrive='+isonedrive,{ responseType: 'blob' });
  }


  verifyGoogleToken(token: string): Observable<any> {
    return this.http.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
  }

  GetGoogleAccessToken(Code:any) {
    return this.http.get(baseUrl + '/api/OAuth/GetGoogleAccessToken?Code=' + Code+'&RedirectUrl='+environment.gooleredirectUri);
  }

  GetMicrosoftAccessToken(Code:any) {
    return this.http.get(baseUrl + '/api/OAuth/GetMicrosoftAccessToken?Code=' + Code+'&RedirectUrl='+environment.MicrosoftredirectUri);
  }



  GetSyncAccDetais(value:any) {
    return this.http.get(baseUrl + '/api/OAuth/GetSyncAccDetails?ApplicationIds=' + value);
  }

  DeleteSyncAccount(id:any) {
    return this.http.delete(baseUrl + '/api/OAuth/DeleteSyncAccount?Id=' + id);
  }

  GetGoogleAccessTokenByRF(id:any){
    return this.http.get(baseUrl + '/api/OAuth/GetGoogleAccessTokenByRF?Id=' + id);
  }

  GetMicrosoftAccessTokenByRF(id:any){
    const MicrosoftredirectUri:any=environment.MicrosoftredirectUri
    
    return this.http.get(baseUrl + '/api/OAuth/GetMicrosoftAccessTokenByRF?Id=' + id+'&RedirectUrl='+MicrosoftredirectUri);
  }


  GoogleEmailRead(accessToken:any){
    return this.http.get(baseUrl + '/api/OAuth/GoogleEmailRead?accessToken=' + accessToken);

  }
  FilterGmailEmails(accessToken:any,formdata:any){
    return this.http.get(baseUrl + '/api/OAuth/FilterGmailEmails?accessToken=' + accessToken+'&subject='+formdata.subject+'&senderName='+formdata.senderName+'&date='+formdata.date+'&body='+formdata.body);

  }

  OutlookEmailRead(accessToken:any){
    return this.http.get(baseUrl + '/api/OAuth/OutlookEmailRead?accessToken=' + accessToken);

  }
  FilterOutlookEmails(accessToken:any,formdata:any){
    return this.http.get(baseUrl + '/api/OAuth/FilterOutlookEmails?accessToken=' + accessToken+'&subject='+formdata.subject+'&senderName='+formdata.senderName+'&date='+formdata.date+'&body='+formdata.body);

  }

}
