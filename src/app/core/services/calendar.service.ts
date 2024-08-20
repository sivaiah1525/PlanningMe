import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';

import { CriticLevel } from '../models/critic-level.model';
import { environment } from '../../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class CalendarService {
    // ------------- 
    createevent$ = new Subject<any>();
    eventDetailsob = this.createevent$.asObservable();
    // ------------ 
    deleteevent$ = new Subject<any>();
    deleteDetailsob = this.deleteevent$.asObservable();

    constructor(
        private http: HttpClient,
        private handler: HttpBackend
    ) { }

    fetchCategoryService(noOfRecords: number, pageNo: number): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindCategoryByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }

    fetchAllCriticLevels(): Observable<CriticLevel> {
        return this.http.get(baseUrl + '/api/ConstantData/FindCriticity')
            .pipe(map((data:any) => data));
    }

    getAllcountryList() {
        return this.http.get(baseUrl + '/api/ConstantData/GetAllCountries');
    }

    createEvent(formData: any) {
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.post(baseUrl + '/api/Event/Create', formData, { headers: headers });
    }

    updateEvent(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
        return this.http.put(baseUrl + '/api/Event/Update', requestData, httpOptions);
    }

    createTask(formData:any) {
        const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
        return this.http.post(baseUrl + '/api/Task/CreateTasks', formData, { headers: headers });
    }

    fetchEventsByFilter() {
        let noOfRecords = 100;
        let pageNo = 1;
        return this.http.get(baseUrl + '/api/Event/FindEventsByFilterCriteria?NumberOfRecord=' + noOfRecords + '&PageNumber=' + pageNo)
            .pipe(map((data:any) => data['data']));
    }
    filterEvents(params:any) {
        console.log(params)
        return this.http.get(baseUrl + '/api/Event/PTFilterEvents?' + params);
    }
    fetchEventsByRange(fd:any, ld:any) {
        return this.http.get(baseUrl + '/api/Event/PTFilterEvents?startDate=' + fd + '&endDate=' + ld);
    }

    createCategory(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
        console.log(requestData)
        return this.http.post(baseUrl + '/api/Event/CreateCategory', requestData, httpOptions);
    }

    updateCategory(requestData: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
        return this.http.put(baseUrl + '/api/Event/UpdateCategory', requestData, httpOptions);
    }

    findAvailableUsers(a:any, b:any, c:any): Observable<any> {
        let startDate = a;
        let endDate = b;
        let isAvailable = c;
        return this.http.get(baseUrl + '/api/Event/FindAvailableUnAvailableUsersOrUserGroups?StartDate=' + startDate + '&EndDate=' + endDate + '&IsUser=true&IsGroup=false&IsAvailable=' + isAvailable);
        // .pipe(map((data:any) => data['data']));
    }

    findAvailableUsersGroup(a:any, b:any, c:any) {
        let startDate = a;
        let endDate = b;
        let isAvailable = c;
        return this.http.get(baseUrl + '/api/Event/FindAvailableUnAvailableUsersOrUserGroups?StartDate=' + startDate + '&EndDate=' + endDate + '&IsUser=false&IsGroup=true&IsAvailable=' + isAvailable);
        // .pipe(map((data:any) => data['data']));
    }

    findCriticity(): Observable<any> {
        return this.http.get(baseUrl + '/api/ConstantData/FindCriticity');
    }

    getCategory(): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindCategoryByFilterCriteria?NumberOfRecord=10&PageNumber=1')
            .pipe(map((data:any) => data['data']));
    }

    deleteCategory(id:any): Observable<any> {
        return this.http.delete(baseUrl + '/api/Event/DeleteCategory?Id=' + id);
    }

    findAllUsers(): Observable<any> {
        return this.http.get(baseUrl + '/api/User/FindAllUsers');
    }

    exportEvents(reqData:any): Observable<any> {
        let file = reqData.fileFormat;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/zip' }) };
        return this.http.post(baseUrl + '/api/Export/ExportEvents?fileFormat=' + file, reqData, 
        {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/zip' },
            responseType: 'blob'
        });
    }

    FindEventById(id:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/PTFindEventById?eventId=' + id);
    }

    FindEventProposalsByEventId(id:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindEventProposalsByEventId?eventId=' + id);
    }

    FindAvailableUsersInEvents(id:any, startDate:any, endDate:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindAvailableUsers?EventId=' + id + '&StartDate=' + startDate + '&EndDate=' + endDate);
    }

    FindAvailableUsersofTask(id:any, startDate:any, endDate:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindAvailableUsersofTask?TaskId=' + id + '&StartDate=' + startDate + '&EndDate=' + endDate);
    }

    FindAvailableUnavailableDates(id:any, startDate:any, endDate:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindAvailableUnavailableDates?EventId=' + id + '&StartDate=' + startDate + '&EndDate=' + endDate);
    }

    FindAvailableUnavailableDatesofTaskUsers(id:any, startDate:any, endDate:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/FindAvailableUnavailableDatesofTaskUsers?TaskId=' + id + '&startDate=' + startDate + '&endDate=' + endDate);
    }

    CreateEventProposal(requestData: any) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', })
        };
        return this.http.post(baseUrl + '/api/Event/CreateEventProposal', requestData, httpOptions);
    }

    invitedUserUpdateEvents(id:any, evId:any): Observable<any> {
        return this.http.put(baseUrl + '/api/Event/InvitedUserUpdateEvents?EventId=' + id + '&EventValidationId=' + evId, id);
    }

    acceptRejectEventProposal(pEvId:any, acc:any, evCId:any): Observable<any> {
        let params = new HttpParams();
        const booleanMapper :any= { '0': false, '1': true };
        params = params.append('ProposeEventId', pEvId);
        params = params.append('Acceptance', booleanMapper[acc]);
        params = params.append('EventCreatorId', evCId);
        return this.http.put(baseUrl + '/api/Event/AcceptRejectEventProposal', {}, { params });
    }

    deleteEvent(id:any) {
        return this.http.delete(baseUrl + '/api/Event/Delete?Id=' + id).toPromise();
    }

    FindEventLinked(id:any): Observable<any> {
        return this.http.get(baseUrl + '/api/Event/PTFindEventLinkedDataById?eventId=' + id);
    }

    getFilesForEvent(id:any, AttachmentLevel:any): Observable<any> {
        return this.http.get(baseUrl + '/api/File/FindFilesBySelectedId?Id=' + id + '&AttachmentLevel=' + AttachmentLevel);
    }
    getNotesForEvent(id:any, AttachmentLevel:any): Observable<any> {
        return this.http.get(baseUrl + '/api/File/FindNotesBySelectedId?Id=' + id + '&AttachmentLevel=' + AttachmentLevel);
    }

    FindUsersByEventId(id:any) {
        return this.http.get(baseUrl + '/api/User/FindUsersByEventId?EventId=' + id);
    }
    GetTaskUsersCalender(data:any) {
        console.log(data.isScheduled)
        console.log(data)
        if(data?.isScheduled==true){
            return this.http.get(baseUrl + '/api/Task/GetTaskUsersCalender?TaskId=' + data.id+'&startdate='+data.StartDate+'&starttime='+data.StartTime+'&isScheduled='+data.isScheduled+'&scheduledStartTime='+data.scheduledStartTime+'&scheduledEndTime='+data.scheduledEndTime+'&excludeDays='+data.excludeDays);
        }else{
            return this.http.get(baseUrl + '/api/Task/GetTaskUsersCalender?TaskId=' + data.id+'&startdate='+data.StartDate+'&starttime='+data.StartTime);
        }
    }
    getAllEvents() {
        return this.http.get(baseUrl + '/api/Event/FindEventDropdown');
    }
    ImportOutlookCalendarEvents(accessToken:any) {
        return this.http.get(baseUrl + '/api/OAuth/ImportOutlookCalendarEvents?accessToken='+accessToken);
    }
    ImportGoogleCalendarEvents(accessToken:any) {
        return this.http.get(baseUrl + '/api/OAuth/ImportGoogleCalendarEvents?accessToken='+accessToken);
    }
    ChecklimitinOnseenData(requestData:any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
        const conseenurl = 'http://onssendata.eu-west-3.elasticbeanstalk.com/api/Target/NonConnectedUserCreditPotential'
        return this.http.post(conseenurl, requestData, httpOptions);
    }

    GoogleOAuthRedirect() {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) }
        return this.http.get(baseUrl + '/api/OAuth/GoogleOAuthRedirect?IsImport='+true, httpOptions);
    }


    OutlookEmailOAuthRedirect() {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) }
        return this.http.get(baseUrl + '/api/OAuth/OutlookEmailOAuthRedirect', httpOptions);
    }


    OutlookOAuthRedirect() {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) }
        return this.http.get(baseUrl + '/api/OAuth/OutlookOAuthRedirect?IsImport='+true, httpOptions);
    }

    GoogleExort() {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) }
        return this.http.post(baseUrl + '/api/Event/ExportIntoGoogleCalendar', httpOptions);
    }


    OutlooKExport() {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) }
        return this.http.post(baseUrl + '/api/Event/ExportIntoOutlookCalendar', httpOptions);
    }
}
