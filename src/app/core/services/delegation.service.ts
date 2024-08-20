import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  constructor(private http: HttpClient) { }

  getDelegation() {
    return this.http.get(baseUrl + '/api/Delegation/FindDelegations');
  }

  getUsers(id: string) {
    return this.http.get(baseUrl + '/api/Delegation/FindUserDelegations?DelegationId=' + id);
  }
  applyDelegation(reqdata:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Delegation/AddUserDelegation', reqdata, httpOptions);
  }



  getAppliedDiscount() {
    return this.http.get(baseUrl + '/api/Discount/FindAppliedDiscounts');
  }
  FindAppliedDiscountLimits() {
    return this.http.get(baseUrl + '/api/Discount/FindAppliedDiscountLimits');
  }


  applyDiscount(reqdata:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Discount/ApplyDiscounts', reqdata, httpOptions);
  }
  ApplyDiscountLimits(reqdata:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Discount/ApplyDiscountLimits', reqdata, httpOptions);
  }
}
