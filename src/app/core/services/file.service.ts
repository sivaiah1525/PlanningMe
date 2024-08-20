import { Injectable } from '@angular/core';
import { Observable, Subject, } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { identifierName } from '@angular/compiler';


const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})

export class FileService {
  organisation: any;
  private filesAndNote = new Subject<any>();
  fileData = this.filesAndNote.asObservable();
      
    constructor(private http: HttpClient,public datepipe: DatePipe,) { }
  loadingData(isEdit: boolean) {
    this.filesAndNote.next(isEdit);
  }
  createFile(formData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/File/CreateFile', formData, { headers: headers })
  }
  UpdateFile(formData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/File/UpdateFile', formData, { headers: headers })
  }
  deleteFile(id: any) {
    return this.http.delete(baseUrl + '/api/File/DeleteFile?Id=' + id).toPromise();
  }
  createNote(reqdata: any): Observable<any> {
    console.log(reqdata);
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/File/CreateNote', reqdata, { headers: headers });
  }
  CreateSubNotes(reqdata: any): Observable<any> {
    console.log(reqdata);
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/File/AddSubNote', reqdata, { headers: headers });
  }

  
  ExportFiletodrive(reqdata: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Export/ExportFiletodrive', reqdata, { headers: headers });
  }
  UpdateNote(reqdata: any): Observable<any> {
    console.log(reqdata);
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/File/UpdateNote', reqdata, { headers: headers });
  }
  deleteNote(id: any) {
    return this.http.delete(baseUrl + '/api/File/DeleteNote?Id=' + id).toPromise();
  }

  FindFilesAndNotes(PageNumber:any, NumberOfRecord:any) {
    return this.http.get(baseUrl + '/api/File/FindFiles?PageNumber=' + PageNumber + '&NumberOfRecord=' + NumberOfRecord);
  }
  updateFile(requestData:any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/File/UpdateFile', requestData, { headers: headers });
  }

  updateNote(requestData:any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/File/UpdateNote', requestData, { headers: headers });
  }

  getFile(id:any): Observable<any> {
    return this.http.get(baseUrl + '/api/File/FindFileById?Id=' + id);
  }

  getNote(id:any,PageNumber:any,NumberOfRecord:any): Observable<any> {
    return this.http.get(baseUrl + '/api/File/FindNoteById?Id=' + id+'&PageNumber='+PageNumber+'&NumberOfRecord='+NumberOfRecord);
  }

  updatePermission(requestData:any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.put(baseUrl + '/api/File/UpdatePermissionToFilesOrNotes', requestData, httpOptions);
  }


  getPermission(isFile:any, id:any): Observable<any> {
    if (isFile) {
      return this.http.get(baseUrl + '/api/File/FindFilesOrNotesPermissions?IsFile=' + isFile + '&FileId=' + id);
    } else {
      return this.http.get(baseUrl + '/api/File/FindFilesOrNotesPermissions?IsFile=' + isFile + '&NoteId=' + id);
    }
  }
  GetSharableLink(data:any): Observable<any> {
    return this.http.get(baseUrl + '/api/File/GetSharableLink?id=' + data.id + '&IsFile=' + data.IsFile + '&IsNote=' + data.IsNote + '&IsReport=' + data.IsReport
      + '&NameOfTheFile=' + data.NameOfTheFile + '&FileCreatorId=' + data.FileCreatorId);
  }


  CreateSubNoteFromEmail(data:any): Observable<any> {
    return this.http.post(baseUrl + '/api/OAuth/CreateSubNoteFromEmail',data);
  }

  filterForFilesAndNotes(filter: any): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const mapper :any= { "1": true, "2": false }
    this.organisation = filter.options == '2' ? true : false
    const endDate: any =
    this.datepipe.transform(filter.endDate, 'yyyy-MM-dd')
    const startDate: any =
      this.datepipe.transform(filter.startDate, 'yyyy-MM-dd') 
    let params = new HttpParams()
      .set('IsMine', mapper[filter.options])
      .set('IsOrganization', this.organisation)
      .set('IsFile', filter.isFile)
      .set('IsNote', filter.isNote)
      .set('Title', filter.title)
      .set('AttachmentLevel', filter.attachmentLevel)
      .set('SelectId', filter.selectid)
      .set('selectGroup', filter.selectGroup)
      .set('keyword', filter.keyword)
    if (filter.startDate) {
      params = params.append('StartDate', startDate);
    }
    if (filter.endDate) {
      params = params.append('EndDate',endDate)

    }

    return this.http.get(baseUrl + '/api/File/Filter?' + params);
  }

  updateSubNote(requestData:any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/File/UpdateSubNote', requestData, { headers: headers });
  }

  deleteSubNote(SubNoteId:any): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) }
    return this.http.delete(baseUrl + '/api/File/RemoveSubNote?SubNoteId='+SubNoteId, httpOptions);
  }

  downloadFile(id:any, IsFile:any) {
    return this.http.get(baseUrl + '/api/Export/DownloadFilesAndNotes?Id=' + id + '&IsFile=' + IsFile, { responseType: 'blob' });
  }
  shareFile(formData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/File/ShareFile', formData)
  }
  fetchFilesByIdService(id: String, attachmentLevel: string): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/File/FindFilesBySelectedId?Id=' + id + '&AttachmentLevel=' + attachmentLevel);
  }
  fetchNotesByIdService(id: String, attachmentLevel: string): Observable<any> {
    return this.http.get<any>(baseUrl + '/api/File/FindNotesBySelectedId?Id=' + id + '&AttachmentLevel=' + attachmentLevel);
  }
}