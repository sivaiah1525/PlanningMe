import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';


const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})

export class GraphService {
  isPieChartOrbarChart: any
  xDisplayType!: string;
  idMapper :any= { 'sites': 'SitesId', 'user': 'UsersId', 'contacts': 'ContactsId', 'products': 'ProductsId' }

  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
  ) { }

  filterForGraph(filter: any): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const chartMapper :any= { '1': false, '2': true }
    const startDate:any=this.datepipe.transform(filter?.startDate, 'yyyy-MM-dd')
    const endDate:any=this.datepipe.transform(filter?.endDate, 'yyyy-MM-dd')
    const params = new HttpParams()
    .set('StartDate', startDate)
    .set('EndDate', endDate)
      .set('AdvancedSearch', filter?.managementTypeId)
      .set('ReportTitle', filter?.graphTitle)
      .set('IsEvent', chartMapper[filter?.eventorTransaction])
      .set('ChartType', filter?.chartTypeId)
      .set('CustomDate',filter?.CustomDate)
      .set('IsCustomReport',filter?.IsCustomDate)
      .set('OptionalAdvancedSearch', filter?.eventGraph)
      .set('AdvancedSearchId', filter?.eventGraphId ? filter?.eventGraphId.toString() : '')
      .set('GroupsId', filter?.eventGraphGroupId ? filter?.eventGraphGroupId.toString() : '')
      .set('keyword', filter?.keyword)
      .set('Description', filter?.description)
      .set('OptionalId', filter?.detaileventGraphId ? filter?.detaileventGraphId.toString() : '')
      .set('OptionalGroupId', filter?.detaileventGraphGroupId ? filter?.detaileventGraphGroupId.toString() : '')
      .set('IsChart', filter?.IsChart)
      .set('XDisplayType', filter?.XDisplayType ? filter?.XDisplayType.toString() : '2')
      .set('YDisplayType', filter?.YDisplayType)
      .set('EventDisplayType', filter?.YDisplayType)
      .set('WithMargin', filter?.withMargin)
      .set('StatusOfTransaction', filter?.StatusOfTransaction)
      .set('IsMarginBasedOnKeyword',filter?.IsMarginBasedOnKeyword)
      .set('WithVAT', filter?.withVat)
      .set('IsBuy', filter?.isBuy)
      .set('IsSale', filter?.isSale)
      .set('IsPieOrBarChart', filter?.isPieChartOrbarChart)
      .set('IsLowToHigh', filter?.IsLowToHigh)
      .set('IsBuySeparateChart', filter?.isseperate)
    return this.http.get(baseUrl + '/api/Filter/FilterForGraph?' + params);
  }

  CustomFilterForGraph(filter: any): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const chartMapper :any= { '1': false, '2': true }
    const startDate:any=this.datepipe.transform(filter?.startDate, 'yyyy-MM-dd')
    const endDate:any=this.datepipe.transform(filter?.endDate, 'yyyy-MM-dd')
    const params = new HttpParams()
    .set('StartDate', startDate)
    .set('EndDate', endDate)
    .set('CustomDate',filter?.CustomDate)
    .set('IsCustomReport',filter?.IsCustomDate)
    .set('ReportTitle', filter?.graphTitle)
    .set('Description', filter?.description)
    .set('IsChart', filter?.IsChart)
    .set('ChartType', filter?.chartTypeId)
    .set('AdvancedSearch', filter?.Entity)
    .set('XDisplayType', filter?.XDisplayType ? filter?.XDisplayType.toString() : '2')
    .set('YDisplayType', 'Quantity')
    return this.http.get(baseUrl + '/api/Filter/CustomFilterForGraph?' + params);
  }

  saveReport(chartData: any): Observable<any> {
    console.log(chartData, 'chartData');
    const datePipe = new DatePipe('en-US');
    const chartMapper :any= { '1': false, '2': true }
    this.xDisplayType = chartData.data.XDisplayType
    const eventResponses = chartData.response
    const startDate:any=this.datepipe.transform(chartData?.data?.startDate, 'yyyy-MM-dd')
    const endDate:any=this.datepipe.transform(chartData?.data?.endDate, 'yyyy-MM-dd')
    const params = new HttpParams()
      .set('StartDate', startDate)
      .set('EndDate', endDate)
      .set('CustomDate',chartData?.data?.CustomDate)
      .set('IsCustomReport',chartData?.data?.IsCustomDate)
      .set('ReportTitle', chartData?.data?.graphTitle.toString())
      .set('IsPieOrBarChart', chartData?.data?.isPieChartOrbarChart)
      .set('keyword', chartData?.data?.keyword)
      .set('Description', chartData?.data?.description)
      .set('IsChart', chartData?.data?.IsChart)
      .set('IsLowToHigh', chartData?.data?.IsLowToHigh)
      .set('IsEvent', chartMapper[chartData?.data?.eventorTransaction])
      .set('ChartType', chartData?.data?.chartTypeId)
      .set('AdvancedSearch', chartData?.data?.managementTypeId)
      .set('AdvancedSearchId', chartData?.data?.eventGraphId ? chartData?.data?.eventGraphId.toString() : '') // userid, sitesid, contactID
      .set('GroupsId', chartData?.data?.eventGraphGroupId ? chartData?.data?.eventGraphGroupId.toString() : '')
      .set('OptionalAdvancedSearch', chartData?.data?.eventGraph)
      .set('OptionalId', chartData?.data?.detaileventGraphId ? chartData?.data?.detaileventGraphId.toString() : '') // optional search user
      .set('OptionalGroupId', chartData?.data?.detaileventGraphGroupId ? chartData?.data?.detaileventGraphGroupId.toString() : '') // optional search group 
      .set('XDisplayType', chartData?.data?.XDisplayType ? chartData?.data?.XDisplayType.toString() : '')
      .set('YDisplayType', chartData?.data?.YDisplayType)
      .set('EventDisplayType', chartData?.data?.YDisplayType)
      .set('WithMargin', chartData?.data?.withMargin)
      .set('WithVAT', chartData?.data?.withVat)
      .set('IsBuySeparateChart', chartData?.data?.isseperate)
      .set('IsBuy', chartData?.data?.isBuy)
      .set('IsSale', chartData?.data?.isSale)
      console.log(eventResponses)
      console.log(chartData)
    return this.http.post(baseUrl + '/api/Filter/SaveReport', eventResponses, { params });
  }

  getAllSavedReports(): Observable<any> {
    return this.http.get(baseUrl + '/api/Filter/FindSavedReports')
  }

  generateReports(id:any): Observable<any> {
    return this.http.get(baseUrl + '/api/Filter/GenerateReports?ReportId=' + id)
  }

  editReport(id: any): Observable<any> {
    return this.http.get(baseUrl + '/api/Filter/FindReportForEdit?ReportId=' + id)
  }

  deleteReport(id: any): Observable<any> {
    return this.http.delete(baseUrl + '/api/Filter/DeleteReport?Id=' + id);
  }

  updateReport(requestData:any): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const chartMapper :any= { '1': false, '2': true }
    this.xDisplayType = requestData.XDisplayType;
    const startDate:any=this.datepipe.transform(requestData?.startDate, 'yyyy-MM-dd')
    const endDate:any=this.datepipe.transform(requestData?.endDate, 'yyyy-MM-dd')
    const params = new HttpParams()
      .set('Id', requestData.id)
      .set('StartDate', startDate)
      .set('EndDate', endDate)
      .set('CustomDate',requestData?.CustomDate)
      .set('IsCustomReport',requestData?.IsCustomDate)
      .set('ReportTitle', requestData?.graphTitle.toString())
      .set('IsPieOrBarChart', requestData?.isPieChartOrbarChart)
      .set('Description', requestData?.description)
      .set('keyword', requestData?.keyword)
      .set('IsChart', requestData?.IsChart)
      .set('IsLowToHigh', requestData?.IsLowToHigh)
      .set('IsEvent', chartMapper[requestData?.eventorTransaction])
      .set('ChartType', requestData?.chartTypeId)
      .set('AdvancedSearch', requestData?.managementTypeId)
      .set('AdvancedSearchId', requestData?.eventGraphId ? requestData?.eventGraphId.toString() : '') // userid, sitesid, contactID
      .set('GroupsId', requestData?.eventGraphGroupId ? requestData?.eventGraphGroupId.toString() : '')
      .set('OptionalAdvancedSearch', requestData?.eventGraph)
      .set('OptionalId', requestData?.detaileventGraphId ? requestData?.detaileventGraphId.toString() : '') // optional search user
      .set('OptionalGroupId', requestData?.detaileventGraphGroupId ? requestData?.detaileventGraphGroupId.toString() : '') // optional search group 
      .set('XDisplayType', requestData?.XDisplayType ? requestData?.XDisplayType.toString() : '')
      .set('YDisplayType', requestData?.YDisplayType)
      .set('EventDisplayType', requestData?.YDisplayType)
      .set('WithMargin', requestData?.withMargin)
      .set('WithVAT', requestData?.withVat)
      .set('IsBuySeparateChart', requestData?.isseperate)
      .set('IsBuy', requestData?.isBuy)
      .set('IsSale', requestData?.isSale)
    return this.http.put(baseUrl + '/api/Filter/UpdateReport?' + params, {});
  }

  exportReport(requestData:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.post(baseUrl + '/api/Export/ExportReport?OutputFormat=' + "xlsx", requestData, { responseType: 'blob' });
  }



  saveAsBlob(data: any) {
    const blob = new Blob([data._body],
      { type: 'application/vnd.ms-excel' });
    const file = new File([blob], 'report.xlsx',
      { type: 'application/vnd.ms-excel' });

    FileSaver.saveAs(file);
  }
}