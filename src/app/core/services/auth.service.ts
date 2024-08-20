import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { data } from 'jquery';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDetails:any;
  delegationdata: any;

  details = new EventEmitter<any>();

  private _userDetails = new Subject<any>();
  userData$ = this._userDetails.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) { }

  authenticateService(reqData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Auth/PTlogin', reqData, httpOptions)
  }

  UpdatePassword(reqData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put(baseUrl + '/api/User/UpdatePassword', reqData, httpOptions)
  }


  FindApiKeyByUserCredentials(reqData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/User/FindApiKeyByUserCredentials', reqData, httpOptions)
  }

  invalidateService(): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Auth/logout', {}, httpOptions);
  }

  getCurrentUser(): Observable<User> {
    const token:any = localStorage.getItem('access_token');
    const userJwt = this.jwtHelperService.decodeToken(token);
    console.log(userJwt);

    return this.http.get<User>(baseUrl + '/api/User/PTFindUserById?Id=' + userJwt.id);
  }

  setUserData(data: any) {
    console.log(data)
    this.userDetails = data;
    console.log(this.userDetails);
    this._userDetails.next(data)
  }

  TestSignal(): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/AwsTest/TestSignalR', httpOptions);
  }
  ForgotPassword(data:any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Auth/ForgotPassword',data, httpOptions);
  }

  

  setPassword(data:any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Auth/CreatePassword',data, httpOptions);
  }

  ResetPassword(data:any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Auth/ResetPassword',data, httpOptions);
  }



  getnotification(): Observable<User> {
    return this.http.get<User>(baseUrl + '/api/Strategy/FindUnseenNotifications');
  }


  updatenotification(actionname:any, actionId:any) {
    return this.http.put(baseUrl + '/api/Strategy/UpdateNotificationSeen?ActionName=' + actionname + '&Id=' + actionId, actionname);
  }


  FindImportBackgroundResult(id:any){
    return this.http.get<User>(baseUrl + '/api/Import/FindImportBackgroundResult?uniqueId=' + id);

  }

  updateCurrentUser(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/User/UploadUserProfile', formData, { headers: headers });
  }

  deleteprofilepicture(profilepic:any) {
    return this.http.delete(baseUrl + '/api/User/RemoveUserProfile?fileName=' + profilepic);
  }

  delegationId(data:any) {
    this.delegationdata = data;
  }

  FindDelegationsOfUsers(id:any) {
    return this.http.get<User>(baseUrl + '/api/Delegation/FindUserDelegations?UserId=' + id);

  }
  FindAppliedUserDelegations() {
    return this.http.get(baseUrl + '/api/Delegation/FindAppliedUserDelegations')
  }

  GetTimeZone() {
    return this.http.get(baseUrl + '/api/User/GetTimeZone')
  }
  FindTrialUsers() {
    return this.http.get(baseUrl + '/api/User/FindTrialUsers')
  }

  GetExpiryDate() {
    return this.http.get(baseUrl + '/api/Organization/GetExpiryDate')
  }

  redurectEmail(Code:any,UserId:any) {
    return this.http.get(baseUrl+'/api/Accounts/ConfirmEmail?Code='+Code+'&UserId='+UserId)
  }


  Accountregister(data:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(baseUrl + '/api/Accounts/register',data, httpOptions);
  }


}
