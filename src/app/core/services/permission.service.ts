import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  findAllUsers(): Observable<any> {
    return this.http.get(baseUrl + '/api/User/FindAllUsers');
  }


  findAllContacts(): Observable<any> {
    return this.http.get(baseUrl + '/api/Contacts/FindAllContacts');

  }

  fetchSite(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/Sites/FindAllSites');
  }
  findAllProducts(): Observable<any> {
    return this.http.get(baseUrl + '/api/Products/FindAllProduct');
  }

  getparams(name:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Permission/FindParams?Name=' + name);
  }

  createPermissions(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Permission/CreatePermission', requestData, httpOptions);
  }

  updatePermission(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.put(baseUrl + '/api/Permission/UpdatePermission', requestData, httpOptions);
  }

  getUserPermission(userid: any) {
    return this.http.get(baseUrl + '/api/Permission/FindUserPermissions?UserId=' + userid);
  }

}
