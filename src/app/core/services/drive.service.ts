import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class DriveService {


  constructor(private http: HttpClient) { }


  loginToken = localStorage.getItem('access_token');


  getGoogleCalender() {
    return this.http.get(baseUrl + '/api/OAuth/GoogleOAuthRedirect');
  }

  findConnector() {
    return this.http.get(baseUrl + '/api/OAuth/FindConnectors');
  }


  createConnection(requestData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/OAuth/AddAppIntegration', requestData, httpOptions);
  }



  getConnection(id:any) {
    return this.http.get(baseUrl + '/api/OAuth/FindAppIntegrations?UserId=' + id);
  }

  getApplications() {
    return this.http.get(baseUrl + '/api/Import/FindApplications');
  }
  getAvailableApiKeys(ApplicationId:any) {
    return this.http.get(baseUrl + '/api/Import/FindMappingConfigurationsDropdown?applicationId=' + ApplicationId);

  }

  getApplicationsById(id:any) {
    return this.http.get(baseUrl + '/api/Import/FindColumnsOfApplication?ApplicationId=' + id);
  }

  FindOrderQuoteForPdf(id:any) {
    const publicApiKey:any=environment.publicApiKey
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ApiKey': publicApiKey,
    });
    return this.http.get(baseUrl + '/api/OrderQuote/Public/FindOrderQuoteForPdf?id=' + id+'&IsOrder='+true,{ headers });
  }



  getplanningcolumns(name:any) {
    return this.http.get(baseUrl + '/api/Import/FindImportColumns?Name=' + name);
  }

  getonseencolumns(ApiKey:any, Url:any) {
    return this.http.get(baseUrl + '/api/Import/RetriveExternalSourceMappedColumns?ApiKey=' + ApiKey + "&Url=" + Url,);
  }

  createconfiguration(reqdata:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };

    return this.http.post(baseUrl + "/api/Import/SaveExternalDataMappedColumns", reqdata, httpOptions);
  }

  deleteConfiguration(id:any) {
    return this.http.delete(baseUrl + '/api/Import/RemoveExternalDataMappedColumns?Id=' + id);
  }

  viewConfigurations(params:any) {
    return this.http.get(baseUrl + '/api/Import/FindMapConfigurations',{params}); 
  }

  FilterMapConfigurations(params:any) {
    return this.http.get(baseUrl + '/api/Import/FilterMapConfigurations',{params}); 
  }


  mappingConfigurations(applicationId:any) {
    return this.http.get(baseUrl + '/api/Import/FindMappingConfigurationsDropdown?applicationId=' + applicationId);
  }

  mappingFileConfiguration(TableName:any) {
    return this.http.get(baseUrl + '/api/Import/FindFileMappingConfigurationsDropdown?TableName=' + TableName);
  }

  fileMappingConfigurations(name:any) {
    return this.http.get(baseUrl + '/api/Import/FindFileMappingConfigurationsDropdown?TableName=' + name);
  }


  importData(ApiKey:any, Url:any, MappingConfigurationId:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }) };
    return this.http.post(baseUrl + '/api/Import/ImportExternalDataUsingApiKey?ApiKey=' + ApiKey + "&Url=" + Url + "&MappingConfigurationId=" + MappingConfigurationId, httpOptions);
  }

  getFileColumn(formData:any, name:any, Template:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Import/Import?Name=' + name + "&IsTemplateFile=" + Template, formData, { headers: headers });
  }


  createConfigurationUsingFiles(formData:any, type:any) {

    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/import/MapImport?Name=' + type, formData, { responseType: 'text' });
  }

  getSavedmappedfile(name:any, id:any) {
    return this.http.get(baseUrl + '/api/Import/FindExternalFileMappedColumns?Name=' + name + "&MapId=" + id);
  }

  removeConfiguration(id:any, IsFile:any) {
    return this.http.delete(baseUrl + '/api/Import/RemoveConfiguration?Id=' + id + "&IsFile=" + IsFile);
  }

  DeleteDynamicGroup(id:any) {
    return this.http.delete(baseUrl + '/api/DynamicGroup/DeleteDynamicGroup?Id=' + id );
  }


  


  
  getConfigurationDetails(id:any, IsFile:any) {
    return this.http.get(baseUrl + '/api/Import/FindConfigurationDetails?MapId=' + id + "&IsFile=" + IsFile);
  }


  getOranization() {
    return this.http.get(baseUrl + '/api/Organization/FindOrganization');
  }

  UpdateOranization(formData:any) {
    return this.http.put(baseUrl + '/api/Organization/UpdateOrganization', formData);
  }
  UpdateOranizationProfile(formData:any) {
    return this.http.put(baseUrl + '/api/Organization/UpdateOrganizationProfile', formData);
  }

  userDBSize(userid:any) {
    return this.http.get(baseUrl + '/api/DBSize/FindUserDBSize?UserId=' + userid);
  }

  orgDBSize(OrganizationId:any) {
    return this.http.get(baseUrl + '/api/DBSize/FindOrganizationDBSize?OrganizationId=' + OrganizationId);
  }


  createInvoice(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Invoice/CreateInvoiceConfiguration', formData, { headers: headers });
  }
  updateInvoice(formData: any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Invoice/UpdateInvoiceConfiguration', formData, { headers: headers });
  }


  FindInvoiceConfiguration() {
    return this.http.get(baseUrl + '/api/Invoice/FindInvoiceConfiguration');
  }
  getfileconfigurationdropdown(userid:any) {
    return this.http.get(baseUrl + '/api/DBSize/FindUserDBSize?UserId=' + userid);
  }
  getapikeyconfigurationdropdown(userid:any) {
    return this.http.get(baseUrl + '/api/DBSize/FindUserDBSize?UserId=' + userid);

  }
  getFindApplications() {
    return this.http.get(baseUrl + '/api/Import/FindApplications');

  }
  getPlanningAndMecolumns(Name:any) {
    return this.http.get(baseUrl + '/api/import/Import?Name=' + Name);

  }
  getfilecolumns(formData:any, name:any) {
    return this.http.post(baseUrl + '/api/import/Import?Name=' + name, formData);

  }
  CreateNewConfiguration(formData:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Import/SaveMappings', formData, { headers: headers });
  }
  UpdateConfiguration(formData:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.put(baseUrl + '/api/Import/UpdateMappingConfiguration', formData, { headers: headers });
  }
  getcolumnsWithApiKey(data:any) {
    return this.http.get(baseUrl + '/api/Import/RetriveExternalSourceMappedColumns?ApiKey=' + data.ApiKey + "&Url=" + data.Url);
  }
  getcolumnsWithonssendata(data:any) {
    return this.http.get(baseUrl + '/api/Consume/ConsumeOnsennData?ApiKey=' + data.ApiKey + "&Url=" + data.Url);
  }
  ImportMapImportFile(name:any, formData:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Import/MapImport?Name=' + name, formData, { headers: headers });
  }
  FindFileMappingConfigurationsDropdown(Name:any) {
    return this.http.get(baseUrl + '/api/Import/FindFileMappingConfigurationsDropdown?TableName=' + Name);
  }
  FindConfigurationDetails(data:any) {
    return this.http.get(baseUrl + '/api/Import/FindConfigurationDetails?MapId=' + data.MapId + '&IsFile=' + data.IsFile);
  }
  AddWebserviceMapping(formData:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Import/AddWebserviceMapping', formData, { headers: headers });
  }
  CreateNewApplication(appName:any) {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(baseUrl + '/api/Import/CreateExternalApplications?appName=' + appName, { headers: headers });
  }
  GetLogData(startDate:any, endDate:any, message:any, startPage:any, noOfRecords:any) {
    return this.http.get(baseUrl + '/api/Accounts/GetLogData?startDate=' + startDate + '&endDate=' + endDate + '&message=' + message + '&startPage=' + startPage + '&noOfRecords=' + noOfRecords);
  }


  UpdateOrganizationStockStatus(IsStockActive:any) {
    const orgId = localStorage.getItem('orgId');
    return this.http.put(baseUrl + '/api/Organization/UpdateOrganizationStockStatus?id=' + orgId + '&IsStockActive=' + IsStockActive,{} );
  }
}
