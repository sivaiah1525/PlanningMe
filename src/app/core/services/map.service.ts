import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserGroup } from '../models/user-group.model';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  apiKey!: string
  constructor(private http: HttpClient) { }

  fetchUsersService(noOfRecords: number, pageNo: number): Observable<User[]> {
    return this.http.get(baseUrl + '/api/User/PTFindUsersByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
      .pipe(map((data:any) => data['data']));
  }

  findEventsByInviter(id:any, type:any, startdate:any, enddate:any) {
    const params = new HttpParams()
      .set('Name', type)
      .set('InviterId', id)
      .set('StartDate', startdate)
      .set('EndDate', enddate);
    return this.http.get(baseUrl + '/api/Event/FindEventByInviterId?' + params);
  }

  getMapData(): Observable<any[]> {
    const params = new HttpParams()
      .set('InitialLoad', 'true');
    return this.http.get<any>(baseUrl + '/api/Filter/FilterForMap?' + params);
  }
  getMapDataFil(lat:any, lng:any, type:any, startdate:any, enddate:any): Observable<any[]> {
    const params = new HttpParams()
      .set('Lat', lat)

      .set('Lng', lng)

      .set('Range', '1000')

      .set('Type', type)

      .set('StartDate', startdate)

      .set('EndDate', enddate);
    return this.http.get<any>(baseUrl + '/api/Filter/FindMapByGivenRange?' + params);
  }
  getMapDataFilter(params:any) {
    return this.http.get<any>(baseUrl + '/api/Filter/FindMapByGivenRange?' + params);
  }
  filterMap(params:any) {
    return this.http.get(baseUrl + '/api/Filter/FilterForMap?' + params);
  }

  onseenMapping(params:any) {
    this.apiKey = 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'
    return this.http.get(baseUrl + '/api/Consume/ConsumeOnsennData?ApiKey=' + this.apiKey + '&Url=' + params);
  }

  getMapConfigurationFilter(params:any, startDateVal:any, endDateVal:any) {
    if (params == true) {
      return this.http.get(baseUrl + '/api/Filter/MapConfigurationFilter?IsPlanningData=' + params + '&StartDate=' + startDateVal + '&EndDate=' + endDateVal);
    }
    else {
      return this.http.get(baseUrl + '/api/Filter/MapConfigurationFilter?IsPlanningData=' + params);
    }
  }

  ImportOnssendataResponse(requestData: any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Import/ImportExternalDataResponse', requestData, httpOptions);
  }


  ConvertOnssenDataToPlanningAndMeData(requestData: any): Observable<any> {
    this.apiKey = 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.post(baseUrl + '/api/Consume/ConvertOnssenDataToPlanningAndMeData?ApiKey=' + this.apiKey, requestData, httpOptions);
  }



}
