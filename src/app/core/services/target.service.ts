import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserGroup } from '../models/user-group.model';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  constructor(private http: HttpClient) { }

  fetchUsersService(noOfRecords: number, pageNo: number): Observable<User[]> {
    return this.http.get(baseUrl + '/api/User/PTFindUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }
  findAllUsers(): Observable<any> {
    return this.http.get(baseUrl + '/api/User/FindAllUsers')
  }

  fetchUserGroups(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get<any>(baseUrl + '/api/UsersGroupName/FindUserGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

  }

  fetchContacts(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/Contacts/FindAllContacts');
  }

  fetchContactsGroup(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/ContactsGroupName/FindContactsGroupNameByFilterCriteria?NumberOfRecord=100&PageNumber=1');
  }

  fetchSite(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/Sites/FindAllSites');
  }

  fetchSiteGroup(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/SitesGroupName/FindSitesGroupByFilterCriteria?NumberOfRecord=100&PageNumber=1');
  }

  fetchProducts(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/Products/FindAllProduct');
  }

  fetchProductsGroup(): Observable<any[]> {
    return this.http.get<any>(baseUrl + '/api/ProductsGroupName/FindProductsGroupByFilterCriteria?NumberOfRecord=100&PageNumber=1');
  }

  fetchUserByIdService(id: String): Observable<User> {
    return this.http.get<User>(baseUrl + '/api/User/PTFindUserById?Id=' + id);
  }

  FindKeywordsFromOrder(StatusOfTransaction:any): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/OrderQuote/FindKeywordsFromOrder?StatusOfTransaction='+StatusOfTransaction);
  }

  FindKeywordsFromEvent(): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/Event/FindKeywordsFromEvent');
  }

  FindKeywordsFromTask(): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/Task/FindKeywordsFromTask');
  }

  FindKeywordsFromInitiatives(): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/Initiative/FindKeywordsFromInitiatives');
  }

  fetchUserGroupsService(noOfRecords: number, pageNo: number): Observable<UserGroup[]> {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUserGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }

  fetchUserGroupByIdService(id: string) {
    return this.http.get<UserGroup>(baseUrl + '/api/UsersGroupName/FindUserGroupById?Id=' + id);
  }

  createUserGroupService(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/UsersGroupName/create', requestData, httpOptions);
  }
  //createTarget()






  updateUsersGroupService(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/UsersGroupName/Update', requestData, httpOptions);
  }

  deleteUsersGroupService(id: string): Observable<any> {
    return this.http.delete(baseUrl + '/api/UsersGroupName/delete?Id=' + id);
  }

  createUserService(requestData: any): Observable<any> {
    return this.http.post(baseUrl + '/api/User/CreateUser', requestData);
  }




  //create contact target
  createContactsTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfContacts/CreateTargetOfContacts', formData, {})
  }
  updateContactsTarget(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfContacts/UpdateTargetOfContacts', formData, {})
  }
  createContactsGroupTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfGroupOfContacts/CreateTargetOfGroupOfContacts', formData, {})
  }
  updateContactsTargetGroup(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfGroupOfContacts/UpdateTargetOfGroupOfContacts', formData, {})
  }



  //create Site target
  createSitesTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfSites/CreateTargetOfSites', formData, {})
  }
  updateSiteTarget(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfSites/UpdateTargetOfSites', formData, {})
  }
  createSitesGroupTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfGroupOfSites/CreateTargetOfGroupOfSites', formData, {})
  }
  updateSiteTargetGroup(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfGroupOfSites/UpdateTargetForGroupOfSites', formData, {})
  }



  //create product target
  createProductsTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfProducts/CreateTargetOfProducts', formData, {})
  }
  updateProductTarget(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfProducts/UpdateTargetOfProducts', formData, {})
  }
  createProductsGroupTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfGroupOfProducts/CreateTargetOfGroupOfProducts', formData, {})
  }
  updateProductTargetGroup(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfGroupOfProducts/UpdateTargetOfGroupOfProducts', formData, {})
  }






  //create user target
  createUserTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfUsers/CreateTargetOfUsers', formData, {})
  }
  createTarget(data: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/TargetOfContacts/Create', data,httpOptions)
  }
  updateTarget(data: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.put(baseUrl + '/api/TargetOfContacts/Update', data,httpOptions)
  }

  UpdateUserTarget(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfUsers/UpdateTargetOfUsers', formData, {})
  }

  createUsersGroupTarget(formData: any) {
    return this.http.post(baseUrl + '/api/TargetOfGroupOfUsers/CreateTargetOfGroupOfUsers', formData, {})
  }
  UpdateUsersGroupTarget(formData: any) {
    return this.http.put(baseUrl + '/api/TargetOfGroupOfUsers/UpdateTargetOfGroupOfUsers', formData, {})
  }
}
