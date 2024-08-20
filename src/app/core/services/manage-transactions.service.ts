import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';
import { PaymentType } from '../models/payment-type.model';
import { environment } from '../../../environments/environment';
import { data } from 'jquery';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageTransactionsService {
  serachvalue: any
  private transactionsSubject = new Subject<Transaction[]>();
  private paymentTypesSubject = new Subject<PaymentType[]>(); 
  readonly transactions = this.transactionsSubject.asObservable();
  readonly paymentTypes = this.paymentTypesSubject.asObservable();

  constructor(private http: HttpClient) { }
  fetchTransactionsServices(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/Transaction/PTFindTransactionByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)
  }
  fetchTransactions(search:any){
    return this.http.get(baseUrl + '/api/Transaction/PTFindTransactionByFilterCriteria?Search='+search+'&PageNumber='+1+'&noOfRecords='+20)

  }

  FindOrderDropdown(): Observable<any[]> {
    return this.http.get<PaymentType[]>(baseUrl + '/api/OrderQuote/FindOrderDropdown');
  }

  fetchTransactionsService(noOfRecords: number, pageNo: number): Observable<Transaction[]> {
    return this.http.get(baseUrl + '/api/Transaction/PTFindTransactionByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }

  fetchAllPaymentTypesService(): Observable<any[]> {
    return this.http.get<PaymentType[]>(baseUrl + '/api/ConstantData/FindPaymentType');
  }

  FindUserDiscountLimit (){
    return this.http.get(baseUrl + '/api/Transaction/FindUserDiscountLimit');

  }

  // fetchTransactionsServiceForAdvanceSearch 
  fetchTransactionsServiceForAdvanceSearch(NumberOfRecord:any, PageNumber:any, data:any) {
    this.serachvalue = '/api/Transaction/PTFindTransactionByFilterCriteria?NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber + '&Search=' + data.Search
    if (data.TransactionTypeId?.length == 0 && data.StatusOfTransaction?.length == 0) {
      
      return this.http.get(baseUrl + this.serachvalue)
    }
    else if (data.StatusOfTransaction?.length == 0) {
      data.TransactionTypeId?.forEach((e:any) => { 
        this.serachvalue = this.serachvalue + '&TransactionTypeId=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    } else if (data.TransactionTypeId?.length == 0) {
      data.StatusOfTransaction?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&StatusOfTransaction=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    } else {
      data.TransactionTypeId?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&TransactionTypeId=' + e
      })
      data.StatusOfTransaction?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&StatusOfTransaction=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    }
  }
  // fetchOrderQuoteForAdvanceSearch 
  fetchOrderQuoteForAdvanceSearch(NumberOfRecord:any, PageNumber:any, data:any) {
    this.serachvalue = '/api/OrderQuote/FilterOrderQuotes?NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber + '&Search=' + data.Search
    if (data.TransactionTypeId?.length == 0 && data.StatusOfTransaction?.length == 0) {
      return this.http.get(baseUrl + this.serachvalue)
    }
    else if (data.StatusOfTransaction?.length == 0) {
      data.TransactionTypeId?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&TransactionTypeId=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    } else if (data.TransactionTypeId?.length == 0) {
      data.StatusOfTransaction?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&StatusOfTransaction=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    } else {
      data.TransactionTypeId?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&TransactionTypeId=' + e
      })
      data.StatusOfTransaction?.forEach((e:any) => {
        this.serachvalue = this.serachvalue + '&StatusOfTransaction=' + e
      })
      return this.http.get(baseUrl + this.serachvalue)
    }
  }






  createTransactionService(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Transaction/Create', requestData, httpOptions);
  }

  FindAppliedDiscountOfOrder(OrderId:any) {
    return this.http.get(baseUrl + '/api/OrderQuote/FindAppliedDiscountOfOrder?OrderId=' + OrderId);
  }

  fetchTransactionById(id: any) {
    console.log(id)
    return this.http.get(baseUrl + '/api/Transaction/PTFindTransactionById?Id=' + id);
  }

  FindOrderQuoteTransactions(ids:any) {
    return this.http.get(baseUrl + '/api/Transaction/FindOrderQuoteTransactions?TransactionIds=' + ids);
  }


  gettransactionDiscountPercentage(id: any, value1:any, value2:any,value3:any) {
    console.log(id)
    return this.http.get(baseUrl + '/api/Discount/FindDiscountByTransactionId?TransactionId=' + id + '&IsPublic=' + value1 + '&IsPrivate=' + value2+'&IsExternal='+value3);
  }
  getOrderQuoteDiscountPercentage(id: any, value1:any, value2:any) {
    console.log(id)
    return this.http.get(baseUrl + '/api/Discount/FindDiscountByOrderId?OrderId=' + id + '&IsPublic=' + value1 + '&IsPrivate=' + value2);
  }



  deletetransaction(id:any) {
    return this.http.delete(baseUrl + '/api/Transaction/Delete?Id=' + id).toPromise();
  }

  updateTransactionService(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/Transaction/Update', requestData, httpOptions);
  }

  createtag(value: any, tablename:any): Observable<any> {
    const reqdata = value;
    return this.http.post(baseUrl + '/api/Tags/AddTagColumns?TableName=' + tablename, reqdata);
  }


  gettag(tablename:any) {
    return this.http.get(baseUrl + '/api/Tags/FindTagColumns?TableName=' + tablename);
  }

  deletetag(id: number) {
    return this.http.delete(baseUrl + '/api/Tags/DeleteTag?Id=' + id);
  }
  FindTransactionsByOrderId(id: number) {
    return this.http.get(baseUrl + '/api/Transaction/FindTransactionsByOrderId?OrderId=' + id);
  }
  updatestatusforOrderAndQuote(Data:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.put(baseUrl + '/api/OrderQuote/UpdateStatus?Id=' + Data.id + '&OrderQuoteStatus=' + Data.OrderQuoteStatus, httpOptions)
  }
}
