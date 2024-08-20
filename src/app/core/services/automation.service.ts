import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  constructor(private http: HttpClient) { }


  loginToken = localStorage.getItem('access_token');


  getGoogleCalender() {
    return this.http.get(baseUrl + '/api/OAuth/GoogleOAuthRedirect');
  }

  findConnector() {
    return this.http.get(baseUrl + '/api/OAuth/FindConnectors');
  }


  CreateScenario(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Automation/CreateScenario', requestData, httpOptions);
  }
  CreateScenarioConditions(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Automation/CreateScenarioConditions', requestData, httpOptions);
  }
  CreateScenarioActions(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Automation/CreateScenarioActions', requestData, httpOptions);
  }
}
