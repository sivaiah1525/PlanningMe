import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Site } from '../models/site.model';
import { SiteGroup } from '../models/site-group.model';
import { SiteGroupTarget } from '../models/site-group-target.model';
import { environment } from '../../../environments/environment';
import { AchievedAmount } from '../models/achieved-amount.model';


const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class ManageSitesService {

    constructor(private http: HttpClient) { }

    fetchSites(noOfRecords: number, pageNo: number, search:any) {
        return this.http.get(baseUrl + '/api/Sites/PTFindSitesByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

    }
    fetchSitesService(noOfRecords: number, pageNo: number) {
        return this.http.get(baseUrl + '/api/Sites/PTFindSitesByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }


    findAllSitesDropdown(): Observable<any> {
        return this.http.get(baseUrl + '/api/Sites/FindAllSites')
    }
    findAllSitesGroupDropdown() {
        return this.http.get(baseUrl + '/api/SitesGroupName/FindSiteGroupDropdown')
    }

    fetchSiteByIdService(id: string): Observable<Site> {
        return this.http.get<Site>(baseUrl + '/api/Sites/PTFindSiteById?Id=' + id);
    }

    fetchSiteGroupsService(noOfRecords: number, pageNo: number) {
        return this.http.get(baseUrl + '/api/SitesGroupName/FindSitesGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }

    fetchSiteGroups(noOfRecords: number, pageNo: number, search:any) {
        return this.http.get(baseUrl + '/api/SitesGroupName/FindSitesGroupByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + search)

    }


    fetchSiteGroupByIdService(id: number) {
        return this.http.get(baseUrl + '/api/SitesGroupName/FindSitesByGroupId?Id=' + id)
    }
    getDynamicGroupService(entity:any, id: string) {
        return this.http.get(baseUrl + '/api/DynamicGroup/FindDynamicGroupData?DynamicGroupId=' + id + '&TableName=' + entity);
    }

    fetchSiteGroupsTargetService(noOfRecords: number, pageNo: number, keyword: string): Observable<SiteGroupTarget[]> {
        return this.http.get(baseUrl + '/api/TargetOfSites/PTFindTargetOfSitesByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)
            .pipe(map((data:any) => data['data']));
    }
    fetchSiteGroupsTarget(noOfRecords: number, pageNo: number, keyword: string) {
        return this.http.get(baseUrl + '/api/TargetOfSites/PTFindTargetOfSitesByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo + '&Search=' + keyword)
    }


    fetchSitesAchievedAmountService(ids: string, year: number, isMonthly: boolean, monthName: string): Observable<AchievedAmount[]> {
        return this.http.get<AchievedAmount[]>(baseUrl + '/api/TargetOfSites/PTFindSiteAchievedAmount?Id=' + ids + '&year=' + year + '&isMonthly=' + isMonthly + '&monthName=' + monthName)
    }

    createSiteGroupService(value: any): Observable<any> {
        const reqdata = value;
        return this.http.post(baseUrl + '/api/SitesGroupName/create', reqdata);
    }

    updateSitesGroupService(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        return this.http.put(baseUrl + '/api/SitesGroupName/Update', requestData, httpOptions);
    }

    deleteSitesGroupService(id: string) {
        return this.http.delete(baseUrl + '/api/SitesGroupName/delete?Id=' + id).toPromise();
    }

    deleteSitesService(id: number) {
        return this.http.delete(baseUrl + '/api/Sites/Delete?Id=' + id).toPromise();
    }

    createSiteService(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        return this.http.post(baseUrl + '/api/Sites/Create', requestData, httpOptions);
    }

    deleteSitestarget(TargetIdentity: number) {
        return this.http.delete(baseUrl + '/api/TargetOfSites/DeleteTargetOfSites?TargetIdentity=' + TargetIdentity).toPromise();
    }
    DeleteTargetOfGroupOfSites(TargetIdentity: number) {
        return this.http.delete(baseUrl + '/api/TargetOfGroupOfSites/DeleteTargetOfGroupOfSites?TargetIdentity=' + TargetIdentity).toPromise();
    }


    updateSiteService(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        return this.http.put(baseUrl + '/api/Sites/Update', requestData, httpOptions);
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
    singleToAddGroup(SiteId:any, GroupId:any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        return this.http.post(baseUrl + ' /api/SitesGroupName/AddSiteInGroup?SiteId=' + SiteId + '&GroupId=' + GroupId, httpOptions)
    }

    GroupShare(GroupId:any, UserId:any, Entity:any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }

        return this.http.post(baseUrl + '/api/ContactsGroupName/GroupShare?GroupId=' + GroupId + '&UserId=' + UserId + '&Entity=' + Entity, httpOptions)
    }
    getSiteGroups(id:any) {
        return this.http.get(baseUrl + '/api/SitesGroupName/FindSitesByGroupId?Id=' + id);
      }
}
