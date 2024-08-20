import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})


export class CreditcardService {

  constructor(private http: HttpClient) { }

  getallcards() {
    return this.http.get(baseUrl + '/api/BankAccount/FindAllCards');
  }

  deletecard(id:any) {
    return this.http.delete(baseUrl + '/api/BankAccount/RemoveCard?Id=' + id);
  }

  CreateCardDetails(reqdata:any) {
    // this.CreateCustomer(reqdata.token)
    return this.http.post(baseUrl + '/api/BankAccount/CreateCreditCard', reqdata);
  }


  CreateCustomer(token:any) {
    return this.http.post(baseUrl + '/api/BankAccount/CreateCustomer?token=', token);
  }

  updateActiveCard(id:any, isActive:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + "/api/BankAccount/UpdateIsActive" + "?Id=" + id + "&IsActive=" + isActive, httpOptions)
  }


  createBankAccount(reqdata:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + "/api/BankAccount/CreateBankAccount", reqdata, httpOptions)
  }
}
