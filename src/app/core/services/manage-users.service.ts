import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserGroup } from '../models/user-group.model';
import { UserGroupTarget } from '../models/user-group-target.model';
import { AchievedAmount } from '../models/achieved-amount.model';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  constructor(
    private http: HttpClient
  ) { }
  fetchUsers(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/User/PTFindUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search);

  }
  FindInitiatives(NumberOfRecord: number, PageNumber: number, Search:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindInitiatives?NumberOfRecord=' + NumberOfRecord + '&PageNumber=' + PageNumber + '&Search=' + Search);

  }
  GetActivityLog(PageNo: number, PageCount: number, Entity:any,id:any) {
    return this.http.get(baseUrl + '/api/Accounts/GetActivityLog?PageNo=' + PageNo + '&PageCount=' + PageCount + '&Entity,=' + Entity+'&Id='+id);

  }

  FindUserById(id: any) {
    return this.http.get(baseUrl + '/api/User/FindUsersByInitiativeId?initativeId=' + id);
  }


  FindSubteamofTeam(id: any,ParentTeamId:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindSubteamofTeam?InitiativeId=' + id+'&ParentTeamId='+ParentTeamId);
  }
  FindUsersOFTeam(id: any,TeamId:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindUsersOFTeam?InitiativeId=' + id+'&TeamId='+TeamId);
  }

  
  FindInitiativeStepsByInitiativeId(id: any) {
    return this.http.get(baseUrl + '/api/Initiative/FindInitiativeStepsByInitiativeId?InitiativeId=' + id);
  }

  FindInitiativeTasksUnderStepsByInitiativeIdAndStepId(id:any, StepId:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindInitiativeTasksUnderStepsByInitiativeIdAndStepId?InitiativeId=' + id + '&StepId=' + StepId);
  }
  FindTasksUnderInitiative(InitiativeId:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindTasksUnderInitiative?InitiativeId=' + InitiativeId);
  }

  FindAllUsersUnderMine() {
    return this.http.get(baseUrl + '/api/User/FindAllUsersUnderMine');

  }

  fetchUsersService(noOfRecords: number, pageNo: number): Observable<User[]> {
    return this.http.get(baseUrl + '/api/User/PTFindUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }

  fetchUserByIdService(id: String): Observable<User> {
    return this.http.get<User>(baseUrl + '/api/User/PTFindUserById?Id=' + id);
  }



  getAlldynamickeywords(): Observable<User> {
    return this.http.get<User>(baseUrl + '/api/DynamicGroup/FindDynamicKeywords');
  }
  FindAllNotes(): Observable<User> {
    return this.http.get<User>(baseUrl + '/api/File/FindAllNotes');
  }

  fetchUserGroupsService(noOfRecords: number, pageNo: number): Observable<UserGroup[]> {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUserGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }
  fetchUserGroups(noOfRecords: number, pageNo: number, search:any) {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUserGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

  }

  fetchuserGroupsTargetService(noOfRecords: number, pageNo: number, keyword: string): Observable<UserGroupTarget[]> {
    return this.http.get(baseUrl + '/api/TargetOfUsers/PTFindTargetOfUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)
      .pipe(map((data:any) => data['data']));
  }

  fetchuserGroupsTarget(noOfRecords: number, pageNo: number, keyword: string) {
    return this.http.get(baseUrl + '/api/TargetOfUsers/PTFindTargetOfUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)

  }

  fetchUserGroupByIdService(id: number) {
    return this.http.get<UserGroup>(baseUrl + '/api/UsersGroupName/FindUsersByGroupId?Id=' + id);
  }

  FindInitiativeById(id: number) {
    return this.http.get<UserGroup>(baseUrl + '/api/Initiative/FindInitiativeById?InitiativeId=' + id);
  }

  FindUsersByInitiative(id: number, Table:any) {
    return this.http.get<UserGroup>(baseUrl + '/api/Initiative/FindInitiativeLinkedData?InitiativeId=' + id + '&Table=' + Table);
  }


  findAllUsersDropdown(): Observable<any> {
    return this.http.get(baseUrl + '/api/User/FindAllUsers')
  }
  findAllUsersGroupDropdown(): Observable<any> {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUserGroupDropdown')
  }

  FindPipelines(): Observable<any> {
    return this.http.get(baseUrl + '/api/Initiative/FindPipelines')
  } 
  FindPipelinesfortask(): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindExistpipelinesfortask')
  } 
  FindAllInitiatives(): Observable<any> {
    return this.http.get(baseUrl + '/api/Initiative/FindAllInitiatives')
  } 
  FindAllTasksByisPredecess(isPredecessor:any,isSuccessor:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindAllTasksByisPredecessorORisSuccessor?isSuccessor='+isSuccessor+'&isPredecessor='+isPredecessor)
  } 
  FindAllTasksByisSuccessor(isPredecessor:any,isSuccessor:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindAllTasksByisPredecessorORisSuccessor?isSuccessor='+isSuccessor+'&isPredecessor='+isPredecessor)
  } 


  FindStepsByPipelineId(PipelineId:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Initiative/FindStepsByPipelineId?PipelineId=' + PipelineId)
  }
  FilterTasks(numberOfRecord:any, pageNumber:any, params:any) {
    return this.http.get(baseUrl + '/api/Task/FilterTasks?NumberOfRecord=' + numberOfRecord + '&PageNumber=' + pageNumber, {params: params})
  }

  FilterKanbanTasks(params:any) {
    return this.http.get(baseUrl + '/api/Task/FilterForKanbanView?' + params)
  }
  
  FilterInitiatives(numberOfRecord:any, pageNumber:any, params:any){
    return this.http.get(baseUrl + '/api/Initiative/FilterInitiatives?NumberOfRecord=' + numberOfRecord + '&PageNumber=' + pageNumber, {params: params})

  }

  FilterKanbanInitiatives(params:any) {
    return this.http.get(baseUrl + '/api/Initiative/FilterForKanbanView?' + params)
  }

  FindTaskOfInitiativeStep(PipelineId:any,StepId:any){
    return this.http.get(baseUrl + '/api/Initiative/FindTaskOfInitiativeStep?PipelineId=' + PipelineId)

  }

  FindStepsByPipelineIdfortask(PipelineId:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindStepsByPipelineId?PipelineId=' + PipelineId)
  }

  FindExistPipelineStepsId(PipelineId:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Initiative/FindExistPipelineSteps?PipelineId=' + PipelineId)
  }
  FindTaskstepsbyPipelineId(PipelineId:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindStepsByPipelineId?PipelineId=' + PipelineId)
  }

  FindExistPipelineSteps(PipelineId:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindExistPipelineSteps?PipelineId=' + PipelineId)
  }



  createUserGroupService(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/UsersGroupName/create', requestData, httpOptions);
  }

  updateUsersGroupService(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/UsersGroupName/Update', requestData, httpOptions);
  }

  deleteUsersGroupService(id: string) {
    return this.http.delete(baseUrl + '/api/UsersGroupName/delete?Id=' + id).toPromise();
  }


  createUserService(formData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/User/Create', formData, { headers: headers });
  }

  getGroupUserService(id: string): Observable<any> {
    return this.http.get<UserGroup>(baseUrl + '/api/UsersGroupName/FindUsersByGroupId?Id=' + id);
  }
  getDynamicGroupUserService(entity:any, id: string): Observable<any> {
    return this.http.get<UserGroup>(baseUrl + '/api/DynamicGroup/FindDynamicGroupData?DynamicGroupId=' + id + '&TableName=' + entity);
  }


  deleteuser(id: string) {
    return this.http.delete(baseUrl + '/api/User/Delete?Id=' + id).toPromise();
  }

  deleteUserTarget(TargetIdentity: string) {
    return this.http.delete(baseUrl + '/api/TargetOfUsers/DeleteTargetOfUsers?TargetIdentity=' + TargetIdentity).toPromise();
  }
  DeleteTargetOfGroupOfUsers(TargetIdentity: string) {
    return this.http.delete(baseUrl + '/api/TargetOfGroupOfUsers/DeleteTargetOfGroupOfUsers?TargetIdentity=' + TargetIdentity).toPromise();
  }
  
  DeleteTarget(TargetIdentity:any){
    return this.http.delete(baseUrl + '/api/TargetOfContacts/Delete?TargetIdentity=' + TargetIdentity).toPromise();

  }

  updateUserService(formData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/User/Update', formData, { headers: headers });
  }

  createtag(value: any, tablename:any): Observable<any> {
    const reqdata = value;
    return this.http.post(baseUrl + '/api/Tags/AddTagColumns?TableName=' + tablename, reqdata);
  }


  createInitiative(body:any): Observable<any> {
    return this.http.post(baseUrl + '/api/Initiative/Create', body);
  }

  updateInitiative(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Initiative/Update', data, { headers: headers });
  }

  ConvertTasktoEvent(data:any) {
    console.log(data.isScheduled)
    console.log(data)
    if(data?.isScheduled==true){
        return this.http.get(baseUrl + '/api/Task/ConvertTasktoEvent?TaskId=' + data.id+'&startdate='+data.StartDate+'&starttime='+data.StartTime+'&isScheduled='+data.isScheduled+'&scheduledStartTime='+data.scheduledStartTime+'&scheduledEndTime='+data.scheduledEndTime+'&excludeDays='+data.excludeDays);
    }else{
        return this.http.get(baseUrl + '/api/Task/ConvertTasktoEvent?TaskId=' + data.id+'&startdate='+data.StartDate+'&starttime='+data.StartTime);
    }
}
  ConvertTasktoMilestone(TaskId:any,EndDate:any) {
    return this.http.get(baseUrl + '/api/Task/ConvertTasktoMilestone?TaskId=' + TaskId+'&EndDate='+EndDate);
  }
  gettag(tablename:any) {
    return this.http.get(baseUrl + '/api/Tags/FindTagColumns?TableName=' + tablename);
  }
  FindGanttViewTasks(InitiativeId:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindGanttViewTasks?InitiativeId=' + InitiativeId);
  }

  deletetag(id: number) {
    return this.http.delete(baseUrl + '/api/Tags/DeleteTag?Id=' + id);
  }


  getAllCountes(name:any, id:any, getname:any) {
    var From = name;
    var Fromld = id;
    var GetName = getname;
    return this.http.get(baseUrl + '/api/Transaction/FindTransactionLinkedManagementData?From=' + From + '&FromId=' + Fromld + '&GetName=' + GetName);
  }


  FindLastTenOrders(id:any, name:any) {
    var TableId = id;
    var TableName = name;
    return this.http.get(baseUrl + '/api/OrderQuote/FindLastTenOrders?TableId=' + TableId + '&TableName=' + TableName);
  }


  getcontact(id:any) {
    return this.http.get(baseUrl + '/api/Contacts/FindContactsByUserId?UserId=' + id);
  }




  getContactByProductid(id:any) {
    return this.http.get(baseUrl + '/api/Contacts/FindContactsByProductId?ProductId=' + id);
  }

  getSite(id:any) {
    return this.http.get(baseUrl + '/api/Contacts/FindContactsBySiteId?SiteId=' + id);
  }

  getProductByUserId(id:any) {
    return this.http.get(baseUrl + '/api/Products/FindProductsByUserId?UserId=' + id);
  }

  getUsersByContactId(id:any) {
    return this.http.get(baseUrl + '/api/User/FindUsersByContactId?ContactId=' + id);

  }

  getUsersBySiteId(id:any) {
    return this.http.get(baseUrl + '/api/User/FindUsersBySiteId?SiteId=' + id);
  }

  getUsersByProductId(id:any) {
    return this.http.get(baseUrl + '/api/User/FindUsersByProductId?ProductId=' + id);
  }

  getSiteByUserId(id:any) {
    return this.http.get(baseUrl + '/api/Sites/FindSitesByUserId?UserId=' + id);
  }

  getSiteByProductId(id:any) {
    return this.http.get(baseUrl + '/api/Sites/FindSitesByProductId?ProductId=' + id);
  }

  getSiteByContactId(id:any) {
    return this.http.get(baseUrl + '/api/Sites/FindSitesByContactId?ContactId=' + id);
  }

  getgrpByUserId(id:any) {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUserGroupByUserId?UserId=' + id);
  }

  getgrpByContactId(id:any) {
    return this.http.get(baseUrl + '/api/ContactsGroupName/FindConatctGroupByConatctId?ContactId=' + id);
  }

  getgrpBySiteId(id:any) {
    return this.http.get(baseUrl + '/api/SitesGroupName/FindSiteGroupBySiteId?SiteId=' + id);
  }

  getgrpByProductId(id:any) {
    return this.http.get(baseUrl + '/api/ProductsGroupName/FindProductGroupByProductId?ProductId=' + id);
  }

  getfile(id:any, attch:any) {
    return this.http.get(baseUrl + '//api/File/FindFilesBySelectedId?Id=' + id + '&AttachmentLevel=' + attch);
  }

  getfileforoder(id:any, attch:any, isTransation:any) {
    return this.http.get(baseUrl + '//api/File/FindFilesBySelectedId?Id=' + id + '&AttachmentLevel=' + attch + '&IsTransaction=' + isTransation);
  }

  getnotes(id:any, attch:any) {
    return this.http.get(baseUrl + '/api/File/FindNotesBySelectedId?Id=' + id + '&AttachmentLevel=' + attch);
  }

  getnotesfororder(id:any, attch:any, IsTransaction:any) {
    return this.http.get(baseUrl + '/api/File/FindNotesBySelectedId?Id=' + id + '&AttachmentLevel=' + attch + '&IsTransaction=' + IsTransaction);
  }

  fetchusersAchievedAmountService(entity:number, targettype:number, valuetype:number, id: string, startdate:string, enddate:string ): Observable<AchievedAmount[]> {
    return this.http.get<AchievedAmount[]>(baseUrl + '/api/TargetOfContacts/PTFindItemAchievedAmount?Entity=' + entity + '&TargetType=' + targettype + '&ValueType=' + valuetype + '&Id=' + id + '&StartDate=' + startdate + '&EndDate=' + enddate)

  }
  getUserGroups(id:any) {
    return this.http.get(baseUrl + '/api/UsersGroupName/FindUsersByGroupId?Id=' + id);
  }

  getEvents(id:any, TableName:any) {
    return this.http.get(baseUrl + '/api/Event/FindLastTenEvents?TableId=' + id + '&TableName=' + TableName);
  }

  getProduct(id:any) {
    return this.http.get(baseUrl + '/api/Products/FindProductsByUserId?UserId=' + id);
  }
  getProductByContactid(id:any) {
    return this.http.get(baseUrl + '/api/Products/FindProductsByContactId?ContactId=' + id);
  }
  getProductBySiteid(id:any) {
    return this.http.get(baseUrl + '//api/Products/FindProductsBySiteId?SiteId=' + id);
  }

  getTransaction(id:any, TableName:any) {
    return this.http.get(baseUrl + '/api/Transaction/FindLastTenTransactions?TableId=' + id + '&TableName=' + TableName);
  }


  Export(fileFormat:any, name:any, selectedIds:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Export/Export?fileFormat=' + fileFormat + '&name=' + name + '&selectedIds=' + selectedIds, httpOptions, { responseType: 'blob' });
  }
  exportExternal(name:any, selectedIds:any, mappingConfigurationId:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Export/ExportForExternal?name=' + name + '&selectedIds=' + selectedIds + '&mappingConfigurationId=' + mappingConfigurationId, httpOptions);
  }
  ImportFromExternalApp(data:any, MapId:any, Name:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Import/ImportFromExternalApp?Name=' + Name + '&MapId=' + MapId, data, httpOptions);
  }
  updateprofileUserId(id:any, formData: any) {
    console.log(formData)
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/User/UploadOtherUserProfile?userId=' + id, formData, { headers: headers })
  }

  CreateDynamicGroup(formData: any) {
    return this.http.post(baseUrl + '/api/DynamicGroup/CreateDynamicGroup', formData,)
  }

  UpdateDynamicGroup(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/DynamicGroup/UpdateDynamicGroup', formData, { headers: headers })
  }
  FindImportColumns(name:any) {
    return this.http.get(baseUrl + '/api/Import/FindImportColumnsForDynamic?Name=' + name)
  }

  FindParameters(TableName:any, IsDynamicGroup:any) {
    return this.http.get(baseUrl + '/api/DynamicGroup/FindParameters?TableName=' + TableName + '&IsDynamicGroup=' + IsDynamicGroup)
  }


  FindImportColumnsdynamickeyowds() {
    return this.http.get(baseUrl + '/api/DynamicGroup/FindDynamicKeyParameters')
  }

  filterformap(params:any) {
    console.log(params)
    return this.http.get(baseUrl + '/api/Filter/FilterForMap?' + params);
  }
  FindAllTask(pagecount:any, pageno:any) {
    return this.http.get(baseUrl + '/api/Task/FindAllTask?pagecount=' + pagecount + '&pageno=' + pageno);
  }
  FindUserByTaskId(id:number) {
    return this.http.get(baseUrl + '/api/User/FindUsersByTaskId?TaskId=' + id);
  }
  FindContactsByTaskId(id:number) {
    return this.http.get(baseUrl + '/api/Contacts/FindContactsByTaskId?TaskId=' + id);
  }

  FindInitiativesByTaskId(id:any) {
    return this.http.get(baseUrl + '/api/Initiative/FindInitiativesByTaskId?TaskId=' + id);
  }

  FindTaskById(id:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/PTFindTaskById?taskId=' + id);
  }
  FindTaskSteps(id:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/FindTaskSteps?TaskId=' + id);
  }

  GetLinkedTasks(id:any,IsSuccessor:any,Ispredesesor:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Task/GetLinkedTasks?TaskId=' + id+'&IsSuccessor='+IsSuccessor+'&Ispredesesor='+Ispredesesor);
  }

  UpdateTaskById(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Task/UpdateTasks', formData, { headers: headers })
  }

  UpdateTaskStatus(formData: HttpParams) {
    return this.http.put(baseUrl + '/api/Task/UpdateTaskStatus', null, { params: formData });
  }

  UpdateTaskStepStatus(id:any) {
    return this.http.put(baseUrl + '/api/Task/UpdateTaskStepStatus?StepId='+id,{});
  }

  FindSubTaskbyID(id:any) {
    return this.http.get(baseUrl + '/api/Task/FindAllSubTask?TaskId=' + id);
  }
  TasksofUsers(body:any) {
    return this.http.post(baseUrl + '/api/Task/TasksofUsers', body);
  }

  GetSuggestions(Entity:any, suggestionFor:any, Text:any) {
    return this.http.get(baseUrl + '/api/User/GetSuggestions?Entity=' + Entity + '&suggestionFor=' + suggestionFor + '&Text=' + Text);
  }

  singleToAddGroup(UserId:any, GroupId:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + ' /api/UsersGroupName/AddUserInGroup?UserId=' + UserId + '&GroupId=' + GroupId, httpOptions)
  }
  GetTimeZoneFromLocation(lat:any, lon:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.get(baseUrl + '/api/User/GetTimeZoneFromLocation?latitude=' + lat + '&longitude=' + lon, httpOptions)
  }
  UpdateUserTimeZone(timeZone:any, flagUrl:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.put(baseUrl + '/api/User/UpdateUserTimeZone?timeZone=' + timeZone + '&flagUrl=' + flagUrl, httpOptions)
  }

}
