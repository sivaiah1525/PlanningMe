import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { ContactGroup } from '../models/contact-group.model';
import { ContactGroupTarget } from '../models/contact-group-target.model';
import { AchievedAmount } from '../models/achieved-amount.model';
import { environment } from '../../../environments/environment';
import * as FileSaver from 'file-saver';


const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageContactsService {
  constructor(private http: HttpClient) { }


  findAllContactsDropdown(): Observable<any> {
    return this.http.get(baseUrl + '/api/Contacts/FindAllContacts')

  }
  findAllContactsGroupDropdown():Observable<any> {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactGroupDropdown')

  }
  fetchContacts(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/Contacts/PTFindContactsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

  }
  fetchContactsService(noOfRecords: number, pageNo: number): Observable<Contact[]> {
    return this.http.get(baseUrl + '/api/Contacts/PTFindContactsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }

  fetchContactByIdService(id: string) {
    return this.http.get<Contact>(baseUrl + '/api/Contacts/PTFindContactsById?Id=' + id);
  }

  fetchContactGroupsService(noOfRecords: number, pageNo: number, keyword: string): Observable<ContactGroup[]> {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactsGroupNameByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)
      .pipe(map((data:any) => data['data']));
  }

  fetchContactGroups(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactsGroupNameByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

  }


  fetchContactGroupByIdService(id: number) {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactsByGroupId?Id=' + id)
  }
  getDynamicGroupService(entity:any, id:any) {
    return this.http.get(baseUrl + '/api/DynamicGroup/FindDynamicGroupData?DynamicGroupId=' + id + '&TableName=' + entity);
  }

  fetchContactGroupsTargetService(noOfRecords: number, pageNo: number, Search: string,Entity:any): Observable<ContactGroupTarget[]> {
    return this.http.get(baseUrl + '/api/TargetOfContacts/PTFindTargetsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + Search + '&Entity='+ Entity)
      .pipe(map((data:any) => data['data']));
  }
  fetchContactGroupsTarget(noOfRecords: number, pageNo: number, Search: string,Entity:any) {
    return this.http.get(baseUrl + '/api/TargetOfContacts/PTFindTargetsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + Search + '&Entity='+ Entity)

  }


  fetchContactsAchievedAmountService(ids:any, year: number, isMonthly: boolean, monthName: string): Observable<AchievedAmount[]> {
    return this.http.get<AchievedAmount[]>(baseUrl + '/api/TargetOfContacts/PTFindContactAchievedAmount?Id=' + ids + '&year=' + year + '&isMonthly=' + isMonthly + '&monthName=' + monthName)

  }

  createContactGroupService(value: any): Observable<any> {
    const reqdata = value;
    return this.http.post(baseUrl + '/api/ContactsGroupName/Create', reqdata);
  }

  updateContactsGroupService(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/ContactsGroupName/Update', requestData, httpOptions);
  }

  deleteContactsGroupService(id: string) {
    return this.http.delete(baseUrl + '/api/ContactsGroupName/Delete?Id=' + id).toPromise();
  }


  createContactService(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Contacts/Create', formData, { headers: headers })
  }


  fetchSite(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/Sites/FindAllSites');
  }
  deletecontact(id:number) {
    return this.http.delete(baseUrl + '/api/Contacts/Delete?Id=' + id).toPromise();
  }

  deletetargetcontact(TargetIdentity: number) {
    return this.http.delete(baseUrl + '/api/TargetOfContacts/DeleteTargetOfContacts?TargetIdentity=' + TargetIdentity).toPromise();
  }
  DeleteTargetOfGroupOfContacts(TargetIdentity: number,) {
    return this.http.delete(baseUrl + '/api/TargetOfGroupOfContacts/DeleteTargetOfGroupOfContacts?TargetIdentity=' + TargetIdentity).toPromise();
  }
  updateContactService(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Contacts/Update', formData, { headers: headers });
  }

  createtag(value: any, tablename:any): Observable<any> {
    const reqdata = value;
    return this.http.post(baseUrl + '/api/Tags/AddTagColumns?TableName=' + tablename, reqdata);
  }


  gettag(tablename:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Tags/FindTagColumns?TableName=' + tablename);
  }

  deletetag(id: number) {
    return this.http.delete(baseUrl + '/api/Tags/DeleteTag?Id=' + id);
  }

  uploadtagvalues(value: any, tablename:any): Observable<any> {
    const reqdata = value;
    return this.http.post(baseUrl + '/api/Tags/AddTagValues?TableName=' + tablename, reqdata);
  }

  createDiscount(requestData:any) {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json', })
    // }
    return this.http.post(baseUrl + '/api/Discount/CreateDiscount', requestData);


  }

  updateDiscount(requestData:any) {
    // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/Discount/UpdateDiscount', requestData);
  }



  AddDiscountToManagement(requestData:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Discount/AddDiscountToManagement', requestData, httpOptions)
  }

  UpdateDiscountToManagement(requestData:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/Discount/UpdateDiscountToManagement', requestData, httpOptions)

  }

  getDiscounts(Search:any, NumberOfRecord:any, PageNumber:any) {
    return this.http.get(baseUrl + '/api/Discount/FindDiscounts?Search=' + Search + '&NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber)

  }
  getDiscountbtId(id:number) {
    return this.http.get(baseUrl + '/api/Discount/FindDiscountById?id=' + id)

  }


  FindDiscountsForDropdown(hasPrivateDiscount:boolean, hasPublicDiscount:boolean)  {
    return this.http.get(baseUrl + '/api/Discount/FindDiscountsForDropdown?IsPrivate=' + hasPrivateDiscount + '&IsPublic=' + hasPublicDiscount)
  }



  getDiscountById(id:number) {
    return this.http.get(baseUrl + '/api/Discount/FindDiscountById?Id=' + id);
  }

  getDiscountByEntity(data:any) {
    return this.http.get(baseUrl + '/api/Discount/FindItemDiscount?IsPublic=' + data.IsPublic + '&IsPrivate=' + data.IsPrivate + '&EntityId=' + data.EntityId + '&Entity=' + data.Entity);
  }

  deleteDiscount(id:number) {
    return this.http.delete(baseUrl + '/api/Discount/DeleteDiscount?Id=' + id).toPromise();
  }
  RemoveDiscountFromManagement(data:any) {
    return this.http.delete(baseUrl + '/api/Discount/RemoveDiscountFromManagement?discountId=' + data.discountId + '&EntityId=' + data.entityId + '&Entity=' + data.entity).toPromise();
  }

  //  Order&Quotes API

  getOrderQuote(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/OrderQuote/FilterOrderQuotes?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

  }

  fetchOrderById(id:number) {
    return this.http.get(baseUrl + '/api/OrderQuote/FindOrderQuoteById?Id=' + id);
  }
  FindProductsByOrderQuoteId(id: string) {
    return this.http.get(baseUrl + '/api/OrderQuote/FindProductsByOrderQuoteId?orderQuoteId=' + id);
  }
  updateorder(requestData:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/OrderQuote/Update', requestData, httpOptions);
  }

  fetchcontacts() {
    return this.http.get(baseUrl + '/api/Contacts/FindAllContactsWithoutPermission')
  }

  creatorder(requestData:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    return this.http.post(baseUrl + '/api/OrderQuote/Create', requestData, httpOptions);
  }

  deleteOrder(id:number) {
    return this.http.delete(baseUrl + '/api/OrderQuote/Delete?Id=' + id).toPromise();
  }


  FindOrderQuoteForPdf(id:number) {
    return this.http.get(baseUrl + '/api/OrderQuote/FindOrderQuoteForPdf?Id=' + id);
  }

  GetCurrentYeartarget(id:number, name:any) {
    return this.http.get(baseUrl + '/api/TargetOfContacts/GetCurrentMonthYearTargets?EntityId=' + id + '&EntityName=' + name);
  }

  updateprofileContactId(id:number, formData: any) {
    console.log(formData)
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Contacts/UpdateContactProfile?ContactId=' + id, formData, { headers: headers })
  }

  downloadTemplate(name:any) {
    if (name == 'Events') {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
      return this.http.post(baseUrl + '/api/Export/DownloadTemplates?Name=' + name + '&fileFormat=xlsx', httpOptions, { responseType: 'blob' });
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Export/DownloadTemplates?Name=' + name + '&fileFormat=csv', httpOptions, { responseType: 'blob' });
  }

  updateFile(requestData:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/File/CreateFile', requestData, { responseType: 'blob' });
  }


  FindCreatorDropdownForTarget(name:any) {
    return this.http.get(baseUrl + '/api/TargetOfContacts/FindCreatorDropdownForTarget?EntityName=' + name);
  }

  TargetAdvanceFilter(params:any) {
    console.log(params.toString())
    return this.http.get(baseUrl + '/api/TargetOfContacts/AdvanceFilter?' + params);
  }
  getAllInvoice() {
    return this.http.get(baseUrl + '/api/Invoice/FindAllInvoice');
  }
  getInvoiceById(id:number) {
    return this.http.get(baseUrl + '/api/Invoice/FindInvoice?Id=' + id);
  }
  DownloadInvoiceById(id:number) {
    return this.http.get(baseUrl + '/api/Invoice/DownloadInvoice?Id=' + id);
  }

  singleToAddGroup(ContactId:any, GroupId:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/ContactsGroupName/AddContactInGroup?ContactId=' + ContactId + '&GroupId=' + GroupId, httpOptions, { responseType: 'blob' })
  }

  deleteTask(id:number) {
    return this.http.delete(baseUrl + '/api/Task/Delete?Id=' + id).toPromise();
  }

  deleteInitiative(id:number) {
    return this.http.delete(baseUrl+ '/api/Initiative/Delete?Id='+ id).toPromise();
  }

  RemovePipeline(PipelineId:any) {
    return this.http.delete(baseUrl+ '/api/Initiative/RemovePipeline?PipelineId='+ PipelineId+'&Confirm='+true).toPromise();
  }

  getContactGroups(id:number) {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindContactsByGroupId?Id=' + id);
  }

}
