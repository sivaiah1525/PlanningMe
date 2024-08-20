import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, HostListener, OnInit, PipeTransform, TemplateRef, ViewChild } from '@angular/core';
import * as shape from 'd3-shape';
import { MatDialog } from '@angular/material/dialog';
import { GraphFilterComponent } from '../components/graph-filter/graph-filter.component';
import {  colors } from '../mock/graph.mock';
import { ChartType } from '../modal/charts.enum';
import { Observable } from 'rxjs';
import { GraphService } from 'src/app/core/services/graph.service'
import { MessageService } from 'src/app/core/services/message.service';
import { MatOption } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { timeStamp } from 'console';
import * as FileSaver from 'file-saver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ResizeService } from 'src/app/core/services/resize.service';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';
import { toolbarUpdated } from '@syncfusion/ej2-angular-richtexteditor';
import { saveAs } from "file-saver";
import { PopupForAllComponent } from '../../commonForAll/popup-for-all/popup-for-all.component';
import { TransactionDetailsComponent } from '../../management/manage-transactions/transaction-details/transaction-details.component';

@Component({
  selector: 'pm-graph',
  templateUrl: './graph.page.html',
  styleUrls: ['./graph.page.scss'],
})
export class GraphPage implements OnInit, PipeTransform {
  @ViewChild('mySelect') mySelect:any;
  @ViewChild('allSelected') private allSelected: any ;
  color = 'primary';
  mode = 'indeterminate';
  loader=false;
  value = 50;
  reportId:any;
  showBuy!: boolean;
  stackBarChart :any= [];
  pieChart :any= [];
  labelName!: string;
  hideChart: boolean = false;
  uniqueArray :any= [];
  lastFourSaveedReports :any= [];
  defaultCharts:any = []
  showChart:any;
  SavedChartId:any;
  onLoad = false;
  selected: string[] = [];
  description!: string;
  keyword: any;
  colorScheme = colors;
  isSeperate: boolean = false;
  isExport: boolean = true;
  comboBarChart: any;
  comboLineChartSeries: any;
  total: number = 0;
  ChartType = ChartType;
  // graphDimension: any = 1000;
  mediumDevice!: Observable<BreakpointState>;
  chartsData: any;
  pieChartData :any= [];
  typeOfChart!: string;
  data:any;
  startDate:any;
  endDate:any;
  currentId:any;
  xlableName:any;
  ylableName:any;
  ylableName1:any;
  filterArray :any= [];
  title = "";
  lineChartData:any;
  tableData:any;
  lineChartDummy :any= [];
  barChartData:any;
  barChartDummy :any= [];
  lineChartShape: any;
  areaChartType: any;
  typeChart:any;
  dateLabel:any;
  SavedChart = { data: {}, response: {} }
  allReports:any;
  allReports1:any;
  tableHeaders :any= [];
  tableRowData :any= [];
  tabledumyzero:any;
  period:any;
  filteredList1: any;
  searchUserForm!: FormGroup;
  showSale: any;
  showMargin: any;
  multipleSaleBar:any = [];
  graphData = {}
  chart = false
  secondChart:any = []
  marginName!: string;
  showlegend: boolean = true;
  grapghdata: any;
  grey!: string;
  linechartbar:any = [];
  dummylinechart:any = [];
  dummymarginlinechart:any = [];
  marginlinechartbar:any = [];
  tableheader:any = [];
  pivotTable:any = [];
  typeTable!: string;
  pivotchart:any = [];
  finalaArray = {};
  dummyareachart:any = [];
  areachartbar:any = [];
  IsTrasaction: any;
  transactionAmount: any;
  isEvent: any;
  result: any;
  grpByYear: any;
  name!: string;
  yaxisLabelName!: string;
  viewSavedChart: any;
  savedBarChartData:any = [];
  multipleBarChart:any = [];
  dummybarchart:any = [];
  dummybuyGraphsDtos = []
  dummysaleGraphsDtos :any= [];
  mockdata = []
  details: any;
  tableCellData: any[] = [];
  singleUser!: boolean;
  keywordslist=[]
  keywordtype:any;
  DemoOrganationstatus:boolean=false;
  size: any;
  panelOpenState = false;
  width: number;
  isMobileView!: boolean;
  sampleWidth = window.innerWidth
  view = [1600, 400]
  hasUpdated= false;

  constructor(
    private fb: FormBuilder,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private graphService: GraphService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public OrgSrvice:CheckOrganationTypeService,
    private resizeService: ResizeService,
    private matoService: MatomoService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
      this.matoService.trackPageView('Grap-page');
      if(localStorage.getItem('isTrailVersion')=='true'){
        this.popupforerrormessage('You are using trail account so you are able to Save 4 reports per user ','Reports')
    }
      if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('activityReports')
      this.popupforerrormessage(data.message, data.header);
    } 

    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }
   }
  transform(value: any, ...args: any[]) {
    if (typeof (value) == 'number') {
      let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
      let ammount1 = ammount.replace(/,/g, ' ')
      let ammount2 = ammount1.replace('$', ' ')
      let ammount3 = ammount2.replace('.00', ' ')
      let ammount4 = ammount3 + ' ' + '€'
      return ammount4.toString()
    } else {
      return value
    }

  }  
  formatDate(value:any) { 
    return this.datepipe.transform(value, 'dd-MMM-yyyy') 
  }
  xAxisTickFormatting(value: any, ...args: any[]) {
    return value
  }

  yAxisTickFormatting(value: any, ...args: any[]) {
    return value.toString()
  }

  ngOnInit() {
    this.searchUserForm = this.fb.group({ userType: new FormControl(''),ColorSchemeselectedValue:['fire'] });
    this.saveAllCharts(true);
    this.lineChartData;
    this.tableData = []
    this.lineChartDummy = [];
    this.barChartData;
    this.barChartDummy = [];
    this.tableHeaders = [];
    this.tableRowData = [];
    const charts = localStorage.getItem('CHARTS');
    if (charts) { this.chartsData = JSON.parse(charts); }
    else {
      const data = [ChartType.PieChart, ChartType.PieDoughnutChart];
      localStorage.setItem('CHARTS', JSON.stringify(data));
      this.chartsData = data;
    }
    
  }
  onCreate() {
    const createFiterDialog = this.dialog.open(GraphFilterComponent, { width: '500px', autoFocus: false, disableClose: true });
    createFiterDialog.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.SavedChart.data = result;
        if(result.IsCustomDate==true){
          this.graphService.CustomFilterForGraph(result).subscribe((data: any) => {
            if (data) {
              this.defaultCharts = []
              this.SavedChart.response = data;
              this.defaultCharts.push(data)
              this.CreateReport(data)
            }
          })
        }else{
          this.graphService.filterForGraph(result).subscribe((data: any) => {
            if (data) {
              this.defaultCharts = []
              this.SavedChart.response = data;
              this.defaultCharts.push(data)
              this.CreateReport(data)
            }
            this.defaultCharts.forEach((element:any) => {
              if (Array.isArray(element.dynamicKeywords)) {
                element.transactionKeywords.forEach((e:any) => {
                  e.dynamic = false; 
                });
                element.dynamicKeywords.forEach((e:any) => {
                  e.dynamic = true; 
                });
                element.transactionKeywords.push(...element.dynamicKeywords);
              }
            });
          })
        }   
      }
    })

  }


  changescolorScheme(value:any){
    if(value=='fire'){
      this.colorScheme={domain: [  '#ff8f00', '#ff5722', '#8cfc9d', '#0000ff', '#33ffff', '#f96459']}
    }else    if(value=='Forest'){
      this.colorScheme={domain: [ '#c1f33d',  '#4caf50',  '#afffff','#bf360c',  '#80a7ba', '#9c27b0']}
    }else    if(value=='neons'){
      this.colorScheme={ domain: ['#ff33ff', '#0001ff', '#facc63',  '#3cc099','#c963fa', '#009688',]}
    }
  }



  removeemptyvalues(values:any){
    console.log(values)
    const data:any=[]
    values.forEach((element:any) => {
      if(element.keyword!=''||element.keyword!=null||element.keyword!=undefined){
        data.push(element)
      }
    });
    return data
  }



  groupByType(array:any) {
    return array.reduce(function (r:any, a:any) {
      r[a.year] = r[a.year] || [];
      r[a.year].push({ value: a.value, sellValue: a.sellValue });
      return r;
    }, Object.create(null));
  }
  getChartsType(type:any) {
    let value
    if (type && type.includes(ChartType.SplineChart)) {
      value= shape.curveBasis;
    } else if (type && type.includes(ChartType.StepChart)) {
      value= shape.curveStep;
    } else
      if (type && type.includes(ChartType.LineChart)) {
        value= shape.curveLinear;
      }
      return value
  }

  getPieChartType(type:any) {
    let value
    if (type && type.includes(ChartType.PieChart)) {
      value= false;
    } else if (type && type.includes(ChartType.PieDoughnutChart)) {
      value= true;
    }
    return value
  }

  yLeftAxisScale(min:any, max:any) { return { min: `${min}`, max: `${max}` }; }

  yRightAxisScale(min:any, max:any) { return { min: `${min}`, max: `${max}` }; }

  yLeftTickFormat(data:any) { return `${data.toLocaleString()}`; }

  yRightTickFormat(data:any) { return `${data}%`; }
  close(id:number) {
    this.lastFourSaveedReports = this.lastFourSaveedReports.filter((el:any) => { return el !== id; });
  }

  saveChart(templateRef: TemplateRef<any>,) {
    this.dialog.open(templateRef);
  }

  saveechart() {
    console.log(this.SavedChart)
    this.graphService.saveReport(this.SavedChart).subscribe(data => {
      this.dialog.closeAll();
      if (data) {
        this.messageService.showMessage("Reports Saved");
        this.SavedChartId = data.response[0].message;
        this.saveAllCharts(true);
      }

    }, error => {
      if (error) { this.messageService.showMessage('Report Name already exist'); }
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
    //this.saveAllCharts(true);
  }

  findkeywordlength(value:any) {
    // Return the length of the value parameter
    return value.length;
  }

  setspace(data:any){
    const value=  data.split('Keyword')
    return value[0]+' '+value[1]
  }

  viewkeywordslist(value:any,type:any,templateRef: TemplateRef<any>,) {
    this.keywordtype=type;
    this.keywordslist=value
    this.dialog.open(templateRef,{
      width: '500px',
    });
  }






  editChart(e:any) {
    var reportID = this.SavedChartId ? this.SavedChartId : e;
    this.graphService.editReport(reportID).subscribe(data => {
      if (data) {
        var usersId = data.usersId;
        const editFiterDialog = this.dialog.open(GraphFilterComponent, { width: '500px', data: { edit: true, data } });
        editFiterDialog.afterClosed().subscribe(result => { 
          console.log(result)
          result.id = reportID;
          result.usersId = usersId;
          this.graphService.updateReport(result).subscribe(data => {
            if (data) {
              this.messageService.showMessage("Report Updated");
              this.showDefaultCharts();
            }
          });
        });
      }
    });
  }


  deleteChart(data:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: 'deleteChart' } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.saveAllCharts(true);
    })
  }

  saveAllCharts(isDefault:any) {
    this.graphService.getAllSavedReports().subscribe(data => {
      console.log(data, 'reportdata');
      data.sort(function (a:any, b:any) {
        var textA = a?.title?.toUpperCase();
        var textB = b?.title?.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList1 = data.slice()

      this.allReports = data.filter(function (el:any) { return el.title != null; });
      if (this.allReports && isDefault) {
        this.allReports1 = this.allReports.slice();
        this.allReports.reverse();
        this.showDefaultCharts();
      }
    });
  }

  showDefaultCharts() {
    this.lastFourSaveedReports.length = 0;
    for (var i = 0; i < 4 && i <= this.allReports.length - 1; i++) {
      this.lastFourSaveedReports.push(this.allReports[i]['id']);
    }
    if (this.lastFourSaveedReports.length != 0) {
      this.showChartReports();
    }
  }



  showChartReports() {
    this.graphService.generateReports(this.lastFourSaveedReports).subscribe(data => {
      var filtered = data;
      this.defaultCharts = filtered.filter(function (el:any) { return el != null; });
      for (var i = 0; i <= this.defaultCharts.length; i++) {
        this.CreateReport(this.defaultCharts[i]);
      }
      this.defaultCharts.forEach((element:any) => {
        if (Array.isArray(element.dynamicKeywords)) {
          element.transactionKeywords.forEach((e:any) => {
            e.dynamic = false; 
          });
          element.dynamicKeywords.forEach((e:any) => {
            e.dynamic = true; 
          });
          element.transactionKeywords.push(...element.dynamicKeywords);
        }
      });
    });
  }

  CreateReport(data:any) {
    console.log(data)
    if (data) {
      data.chartType = data.chartType;
      this.title = data.reportTitle;
      data.xDisplayType = data.xDisplayType
      data.yDisplayType = data.yDisplayType;
      data.isCustomReport=data?.isCustomReport?data.isCustomReport:false
     // ------------- 
     data.graphDimension = []
     data.savedBarChartData = [];
     data.secondChart = []
     data.linechartbar = [];
     data.marginlinechartbar = [];
     data.areachartbar = []
   // ---------- 
      if(this.isMobileView==true){
          data.graphDimension = [(window.innerWidth), (window.innerHeight / 2)]
      }else if(this.isMobileView==false){
        if (data.xDisplayType == 'Yearly' || data.xDisplayType == 'Monthly') {
        if (data?.graphDtos?.length == 1||data?.eventGraphDtos?.length == 1) {
          data.graphDimension = [(window.innerWidth - 300), (window.innerHeight / 2)]
        } else if (data?.graphDtos?.length == 2||data?.eventGraphDtos?.length == 2) {
          data.graphDimension = [(window.innerWidth - 300), (window.innerHeight / 2)]
        } else if (data?.graphDtos?.length == 3||data?.eventGraphDtos?.length == 3) {
          data.graphDimension = [(window.innerWidth - 300), (window.innerHeight / 2)]
        } else if (data?.graphDtos?.length == 4||data?.eventGraphDtos?.length == 4) {
          data.graphDimension = [(window.innerWidth - 200), (window.innerHeight / 2)]
        } else if (data?.graphDtos?.length == 5||data?.eventGraphDtos?.length == 5) {
          data.graphDimension = [(window.innerWidth - 100), (window.innerHeight / 2)]
        } 
      } 
      // else {
      //   data.graphDimension = [(window.innerWidth), (window.innerHeight / 2)]
      // }
      }
      // --------- 
      if(data.isCustomReport==false){
        data.isBuy = data.isBuy;
        data.isSale = data.isSale;
        data.withMargin = data.withMargin;
        data.isEvent = data.isEvent;
        // ---------- 
        if (data.isEvent == false && data.yDisplayType == "Amount") { data.yaxisLabelName = 'Transaction Amount ( € )' }
        else if (data.isEvent == false && data.yDisplayType == "Quantity") { data.yaxisLabelName = 'Number of Transaction' }
        else if (data.isEvent == true && data.yDisplayType == "Quantity") { data.yaxisLabelName = 'Number of Event' }
        else if (data.isEvent == true && data.yDisplayType == "Duration") { data.yaxisLabelName = ' Event Duration ( Hours )' }
        // -------------- 
        if (data.isEvent == false) {
          // Bar Chart  Vertical bar chart 0000000001111111111
          if (data.chartType == 'Bar Chart' ) {
           
            // --------------- 
            if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
              data.name = 'Sell Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push(
                      {
                      name: this.formatDate(e.date),
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    }
                    )
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              }
            }
            else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
              data.name = ' Buy Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == false && data.withMargin == true) {
              data.name = 'Sell Graph And Margin Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.MarginTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDimension = [(5000), (window.innerHeight / 2)]
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == true && data.withMargin == false && data.isBuySeparateChart == true) {
              data.name = 'Sell Graph And Buy Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == true && data.withMargin == false && data.isBuySeparateChart == false) {
              data.name = 'Sell Graph And Buy Graph With SeparateChart'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal - element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [
                        { name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [
                        { name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [
                        { name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
            setTimeout(() => {
              if(data.savedBarChartData.length != 0) {
                console.log(data.savedBarChartData.length)
                if(data.savedBarChartData.length < 2 || data.savedBarChartData.length == 2) {
                  data.graphDimension = [(window.innerWidth / 8), (window.innerHeight / 2)]
        
                } else if(data.savedBarChartData.length < 3 || data.savedBarChartData.length == 3) {
                  data.graphDimension = [(window.innerWidth / 4.5), (window.innerHeight / 2)]
        
                } else if(data.savedBarChartData.length < 4 || data.savedBarChartData.length == 4) {
                  data.graphDimension = [(window.innerWidth / 4), (window.innerHeight / 2)]
        
                } else if(data.savedBarChartData.length < 5 || data.savedBarChartData.length == 5) {
                  data.graphDimension = [(window.innerWidth / 3), (window.innerHeight / 2)]
        
                } else if(data.savedBarChartData.length < 6 || data.savedBarChartData.length == 6) {
                  data.graphDimension = [(window.innerWidth / 3.5), (window.innerHeight / 2)]
        
                } else if(data.savedBarChartData.length < 8 || data.savedBarChartData.length == 8) {
                  data.graphDimension = [(window.innerWidth / 2.5), (window.innerHeight / 2)]
        
                }
                else if (data.savedBarChartData.length < 10 || data.savedBarChartData.length == 10) {
              
                  data.graphDimension = [(window.innerWidth / 1.5), (window.innerHeight / 2)]
                } else if (data.savedBarChartData.length < 12 || data.savedBarChartData.length == 12) {
              
                  data.graphDimension = [(window.innerWidth / 1), (window.innerHeight / 2)]
                }
                 else if (data.savedBarChartData.length < 15 || data.savedBarChartData.length == 15) {
              
                  data.graphDimension = [(window.innerWidth + 200), (window.innerHeight / 2)]

                } else if (data.savedBarChartData.length < 20 || data.savedBarChartData.length == 20) {
              
                  data.graphDimension = [(window.innerWidth + 400), (window.innerHeight / 2)]

                } else if (data.savedBarChartData.length < 35 || data.savedBarChartData.length == 35) {
              
                  data.graphDimension = [(window.innerWidth + 800), (window.innerHeight / 2)]

                } else if (data.savedBarChartData.length < 45 || data.savedBarChartData.length == 45) {
              
                  data.graphDimension = [(window.innerWidth + 1200), (window.innerHeight / 2)]

                } else if (data.savedBarChartData.length > 45) {
              
                  data.graphDimension = [(window.innerWidth + 1400), (window.innerHeight / 2)]

                }
              }
            }, 100);
           
          }
          if (data.chartType == 'Vertical bar chart') {
            // --------------- 
            if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
              data.name = 'Sell Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [{ name:  element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push(
                      {
                      name: this.formatDate(e.date) ,
                      series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    }
                    )
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                this.singleUser = false
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [{ name:element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              }
            }
            else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
              data.name = ' Buy Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.year.toString() ,
                      series: [{ name:element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name:this.formatDate(e.date) ,
                      series: [{ name:element.itemName , value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.buyGraphsDtos.forEach((e:any) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [{ name:element.itemName , value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == false && data.withMargin == true) {
              data.name = 'Sell Graph And Margin Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.MarginTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(Margin)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleMarginGraphsDtos[index].price : element.saleMarginGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == true && data.withMargin == false && data.isBuySeparateChart == true) {
              data.name = 'Sell Graph And Buy Graph'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                  })
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.year.toString(),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: this.formatDate(e.date),
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: e.month,
                      series: [
                        { name: element.itemName + '(sale)', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString() },
                        { name: element.itemName + '(buy)', value: data.yDisplayType.toLowerCase() == 'amount' ? element.buyGraphsDtos[index].price : element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
            else if (data.isSale == true && data.isBuy == true && data.withMargin == false && data.isBuySeparateChart == false) {
              data.name = 'Sell Graph And Buy Graph With SeparateChart'
              if (data.xDisplayType == 'No Period') {
                data.graphDtos.forEach((element:any) => {
                  data.savedBarChartData.push({
                    name: 'No Period',
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal - element.buyTotal : element.quantity.toString(), }]
                  })
                })
              } else if (data.xDisplayType == 'Yearly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: element.itemName,
                      series: [
                        { name: e.year.toString(), value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Daily') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: element.itemName,
                      series: [
                        { name: this.formatDate(e.date), value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
                      ]
                    })
                  })
                });
              } else if (data.xDisplayType == 'Monthly') {
                data.graphDtos.forEach((element:any) => {
                  element.saleGraphsDtos.forEach((e:any, index:number) => {
                    data.savedBarChartData.push({
                      name: element.itemName,
                      series: [
                        { name: e.month, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price - element.buyGraphsDtos[index].price : e.quantity.toString() - element.buyGraphsDtos[index].quantity.toString() }
  
                      ]
                    })
                  })
                });
              }
            }
          }
          // Pie Chart 
          else if (data.chartType == 'Pie Chart') {
            data.multipleSaleBar = []
            data.graphDtos.forEach((element:any) => {
              data.multipleSaleBar.push({ name: element.itemName, value: element.saleTotal })
            });
          }
          // Line Chart 
          else if (data.chartType == 'Line Chart') {
            if (data.yDisplayType == 'Amount') {
              if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
                data.name = 'Sell Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName, series: this.dummylinechart })
                });
  
              }
              else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
                data.name = 'Buy Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.buyGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName, series: this.dummylinechart });
                });
              }
              else if (data.isSale == true && data.isBuy == false && data.withMargin == true) {
                data.name = 'Sell Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  this.dummymarginlinechart = [];
                  element.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
  
                  element.saleMarginGraphsDtos.forEach((e:any) => {
                    this.dummymarginlinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  })
                  data.linechartbar.push({ name: element.itemName, series: this.dummylinechart });
                  data.marginlinechartbar.push({ name: element.itemName, series: this.dummymarginlinechart });
                });
  
              }
              else if (data.isSale == true && data.isBuy == true && data.withMargin == false) {
                this.name = 'Sell Graph And Buy Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName + ' (Sell)', series: this.dummylinechart })
                  this.dummylinechart = [];
  
                  element.buyGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  console.log(this.dummylinechart)
                  data.linechartbar.push({ name: element.itemName + ' (Buy)', series: this.dummylinechart })
                });
  
  
              }
            }
            else if (data.yDisplayType == 'Quantity') {
              if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
                data.name = 'Sell Graph '
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName, series: this.dummylinechart })
                });
              }
              else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
                data.name = 'Buy Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.buyGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName, series: this.dummylinechart });
                });
              }
              else if (data.isSale == true && data.isBuy == true && data.withMargin == false) {
                data.name = 'Sell Graph And Buy Graph'
                data.graphDtos.forEach((element:any) => {
                  this.dummylinechart = [];
                  element.saleGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName + ' (Sell)', series: this.dummylinechart })
                  this.dummylinechart = [];
                  element.buyGraphsDtos.forEach((e:any) => {
                    this.dummylinechart.push({
                      name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  });
                  data.linechartbar.push({ name: element.itemName + ' (Buy)', series: this.dummylinechart })
                });
              }
            }
          }
          // Pivot Table 
          else if (data.chartType == 'Pivot Table'||data.chartType=='ranking table') {
            data.tableheader = []
            data.pivotTable = []
            data.pivotTabledata = []
            if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
              data.name = 'Sell Table'
              data.graphDtos.forEach((element:any, index:number) => {
                data.pivotTabledata = []
                data.pivotTabledata.push({ value: element.itemName });
                element.saleGraphsDtos.forEach((sale:any) => {
                  data.pivotTabledata.push({ value: data.yDisplayType.toLowerCase() == 'amount' ? sale.price : sale.quantity.toString() });
                  if (index == 0) {
                    data.tableheader.push({
                      year: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : data.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                    });
                  }
                })
                data.pivotTable.push(data.pivotTabledata);
              })
              console.log(data.tableheader)
              console.log(data.pivotTable)
            } else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
              data.name = 'Buy Table'
              data.graphDtos.forEach((element:any, index:number) => {
                data.pivotTabledata = []
                data.pivotTabledata.push({ value: element.itemName });
                element.buyGraphsDtos.forEach((sale:any) => {
                  data.pivotTabledata.push({ value: data.yDisplayType.toLowerCase() == 'amount' ? sale.price : sale.quantity.toString() });
                  if (index == 0) {
                    data.tableheader.push({
                      year: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : data.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                    });
                  }
                })
                data.pivotTable.push(data.pivotTabledata);
              })
              console.log(data.tableheader)
              console.log(data.pivotTable)
            } else if (data.isSale == true && data.isBuy == false && data.withMargin == true) {
              this.typeTable = 'Sell and Margin Table'
            } else if (data.isSale == true && data.isBuy == true && data.withMargin == false) {
              data.name = 'Sell and Buy Table'
            }
          }
          // Pie Doughnut Chart 
          else if (data.chartType == 'Pie Doughnut Chart') {
            data.multipleSaleBar = []
            data.graphDtos.forEach((element:any) => {
              data.multipleSaleBar.push({ name: element.itemName, value: element.saleTotal })
            });
  
          }
          // Area Chart 
          else if (data.chartType == 'Area Chart') {
            this.dummyareachart = [];
            if (data.isBuy == true && data.isSale == true) {
              data.graphDtos.forEach((element:any) => {
                let data1:any= []
                let data2:any= []
                element.saleGraphsDtos.forEach((e:any) => {
                  if (data.xDisplayType.toLowerCase() == 'daily') {
                    data1.push({
                      name: this.formatDate(e.date),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
  
                  } else if (data.xDisplayType.toLowerCase() == 'monthly') {
  
                    data1.push({
                      name: e.month.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  } else {
                    data1.push({
                      name: e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
  
                  }
                });
                element.buyGraphsDtos.forEach((e:any) => {
                  if (data.xDisplayType.toLowerCase() == 'daily') {
                    data2.push({
                      name: this.formatDate(e.date),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
  
                  } else if (data.xDisplayType.toLowerCase() == 'monthly') {
                    data2.push({
                      name: e.month + ' ' + e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
  
                  } else {
                    data2.push({
                      name: e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  }
                });
                data.areachartbar.push(
                  { name: element.itemName, series: data1 },
                  { name: element.itemName, series: data2 }
                )
              });
            }
            else if (data.isSale == true && data.isBuy == false) {
              data.graphDtos.forEach((element:any) => {
                this.dummyareachart = []
                element.saleGraphsDtos.forEach((e:any) => {
                  if (data.xDisplayType.toLowerCase() == 'daily') {
                    this.dummyareachart.push({
                      name: this.formatDate(e.date),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  } else if (data.xDisplayType.toLowerCase() == 'monthly') {
                    this.dummyareachart.push({
                      name: e.month + ' ' + e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  } else {
                    this.dummyareachart.push({
                      name: e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  }
  
                });
                data.areachartbar.push({
                  name: element.itemName,
                  series: this.dummyareachart
                })
              });
            } else if (data.isBuy == true && data.isSale == false) {
              data.graphDtos.forEach((element:any) => {
                element.buyGraphsDtos.forEach((e:any) => {
                  if (data.xDisplayType.toLowerCase() == 'daily') {
                    this.dummyareachart.push({
                      name: this.formatDate(e.date),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  } else if (data.xDisplayType.toLowerCase() == 'monthly') {
                    this.dummyareachart.push({
                      name: e.month + ' ' + e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  } else {
                    this.dummyareachart.push({
                      name: e.year.toString(),
                      value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
                    });
                  }
  
                });
                data.areachartbar.push({
                  name: element.itemName,
                  series: this.dummyareachart
                })
              });
            }
            setTimeout(() => {
              var TotalAreaChartLength = 0
              data.areachartbar.forEach((e:any) => {
                TotalAreaChartLength += e.series.length
                
              });
              if(data.xDisplayType == 'Yearly') {
                if(TotalAreaChartLength != 0) {
                  if(TotalAreaChartLength < 5) {
                    data.graphDimension = [(window.innerWidth), (window.innerHeight / 2)]
          
                  } else if (TotalAreaChartLength < 10) {
                
                    data.graphDimension = [(window.innerWidth + 100), (window.innerHeight / 2)]
                  } else if (TotalAreaChartLength < 15) {
                
                    data.graphDimension = [(window.innerWidth + 300), (window.innerHeight / 2)]
  
                  } else if (TotalAreaChartLength > 15) {
                
                    data.graphDimension = [(window.innerWidth + 400), (window.innerHeight / 2)]
  
                  }
                }
              } else if(data.xDisplayType == 'Daily') {
               
                if(TotalAreaChartLength != 0) {
                  if(TotalAreaChartLength < 10) {
                    data.graphDimension = [(window.innerWidth), (window.innerHeight / 2)]
          
                  } else if (TotalAreaChartLength < 30) {
                
                    data.graphDimension = [(window.innerWidth + 600), (window.innerHeight / 2)]
                  } else if (TotalAreaChartLength < 50) {
                
                    data.graphDimension = [(window.innerWidth + 3000), (window.innerHeight / 2)]
  
                  } else if (TotalAreaChartLength > 50) {
                
                    data.graphDimension = [(window.innerWidth + 3000), (window.innerHeight / 2)]
  
                  }
                }
                
              } else if(data.xDisplayType == 'Monthly') {
                if(TotalAreaChartLength != 0) {
                  if(TotalAreaChartLength < 5) {
                    data.graphDimension = [(window.innerWidth), (window.innerHeight / 2)]
          
                  } else if (TotalAreaChartLength < 10) {
                
                    data.graphDimension = [(window.innerWidth + 100), (window.innerHeight / 2)]
                  } else if (TotalAreaChartLength < 15) {
                
                    data.graphDimension = [(window.innerWidth + 300), (window.innerHeight / 2)]
  
                  } else if (TotalAreaChartLength > 15) {
                
                    data.graphDimension = [(window.innerWidth + 400), (window.innerHeight / 2)]
  
                  }
                }
              }
            }, 100);
          }
        }
        else if (data.isEvent == true) {
          this.name = 'Event Graph'
          // Bar Chart  Vertical bar chart 
          if (data.chartType == 'Bar Chart' || data.chartType == 'Vertical bar chart') {
            if (data.xDisplayType == 'No Period') {
              data.eventGraphDtos.forEach((element:any) => {
                data.savedBarChartData.push({
                  name: 'No Period',
                  series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'amount' ? element.saleTotal : element.quantity.toString(), }]
                })
              })
            } else if (data.xDisplayType == 'Yearly') {
              this.singleUser = false
              data.eventGraphDtos.forEach((element:any) => {
                element.graphsDtos.forEach((e:any) => {
                  data.savedBarChartData.push({
                    name: e.year.toString(),
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'duration' ? e.duration.toString() : e.quantity.toString(), }]
                  })
                })
              });
            } else if (data.xDisplayType == 'Daily') {
              data.graphDimension = [(window.innerWidth - 200), (window.innerHeight / 2)]
              this.singleUser = false
              data.eventGraphDtos.forEach((element:any) => {
                element.graphsDtos.forEach((e:any) => {
                  data.savedBarChartData.push({
                    name: this.formatDate(e.date),
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'duration' ? e.duration.toString() : e.quantity.toString(), }]
                  })
                })
              });
            } else if (data.xDisplayType == 'Monthly') {
              this.singleUser = false
              data.eventGraphDtos.forEach((element:any) => {
                element.graphsDtos.forEach((e:any) => {
                  data.savedBarChartData.push({
                    name: e.month,
                    series: [{ name: element.itemName, value: data.yDisplayType.toLowerCase() == 'duration' ? e.duration.toString() : e.quantity.toString(), }]
                  })
                })
              });
            }
          }
          // Pie Chart 
          else if (data.chartType == 'Pie Chart') {
            data.eventGraphDtos.forEach((element:any) => {
              this.multipleSaleBar.push({
                name: element.itemName, value: data.yDisplayType == 'Quantity' ? element.totalQuantity.toString() : element.totalDuration.toString()
              })
            });
          }
          //  Pie Doughnut Chart 
          else if (data.chartType == 'Pie Doughnut Chart') {
            data.eventGraphDtos.forEach((element:any) => {
              this.multipleSaleBar.push({ name: element.itemName, value: data.yDisplayType == 'Quantity' ? element.totalQuantity.toString() : element.totalDuration.toString() })
            });
  
          }
          // Line Chart 
          else if (data.chartType == 'Line Chart') {
            // single user 
            if (data.eventGraphDtos.length == 1) {
              if (data.xDisplayType == 'Daily') {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummylinechart.push({ name: this.formatDate(element.date), value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  data.linechartbar.push({ name: e.itemName, series: this.dummylinechart })
                })
  
              } else if (data.xDisplayType == 'Monthly') {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummylinechart.push({ name: element.month, value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  console.log(this.dummylinechart, 'multiplesalbar')
                  data.linechartbar.push({ name: e.itemName, series: this.dummylinechart })
                })
              } else {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummylinechart.push({ name: element.year.toString(), value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  data.linechartbar.push({ name: e.itemName, series: this.dummylinechart })
                })
  
              }
  
  
            }
            // multi users 
            else if (data.eventGraphDtos.length > 1)
              data.eventGraphDtos.forEach((element:any) => {
                this.dummylinechart = [];
                element.graphsDtos.forEach((e:any) => {
                  this.dummylinechart.push({
                    name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: data.yDisplayType == 'Quantity' ? e.quantity.toString() : e.duration
                  });
                });
                data.linechartbar.push({ name: element.itemName, series: this.dummylinechart })
              });
  
          }
          // Area Chart 
          else if (data.chartType == 'Area Chart') {
            // single user 
            if (data.eventGraphDtos.length == 1) {
              if (data.xDisplayType == 'Daily') {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummyareachart.push({ name: this.formatDate(element.date), value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  data.areachartbar.push({ name: e.itemName, series: this.dummyareachart })
                })
  
              } else if (data.xDisplayType == 'Monthly') {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummyareachart.push({ name: element.month, value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  data.areachartbar.push({ name: e.itemName, series: this.dummyareachart })
                })
              } else {
                data.eventGraphDtos.forEach((e:any) => {
                  data.eventGraphDtos[0].graphsDtos.forEach((element:any) => {
                    this.dummyareachart.push({ name: element.year.toString(), value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration })
                  })
                  data.areachartbar.push({ name: e.itemName, series: this.dummyareachart })
                })
              }
            }
            // multi users 
            else if (data.eventGraphDtos.length > 1) {
              data.eventGraphDtos.forEach((element:any) => {
                this.dummyareachart = [];
                element.graphsDtos.forEach((e:any) => {
                  this.dummyareachart.push({
                    name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                    value: data.yDisplayType == 'Quantity' ? element.quantity.toString() : element.duration
                  });
                });
                data.areachartbar.push({ name: element.itemName, series: this.dummyareachart })
              });
            }
          }
             // Pivot Table 
             else if (data.chartType=='ranking table') {
              data.tableheader = []
              data.pivotTable = []
              data.pivotTabledata = []
              if (data.isSale == true && data.isBuy == false && data.withMargin == false) {
                data.name = 'Sell Table'
                data.graphDtos.forEach((element:any, index:number) => {
                  data.pivotTabledata = []
                  data.pivotTabledata.push({ value: element.itemName });
                  element.saleGraphsDtos.forEach((sale:any) => {
                    data.pivotTabledata.push({ value: data.yDisplayType.toLowerCase() == 'amount' ? sale.price : sale.quantity.toString() });
                    if (index == 0) {
                      data.tableheader.push({
                        year: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : data.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                      });
                    }
                  })
                  data.pivotTable.push(data.pivotTabledata);
                })
              } else if (data.isSale == false && data.isBuy == true && data.withMargin == false) {
                data.name = 'Buy Table'
                data.graphDtos.forEach((element:any, index:number) => {
                  data.pivotTabledata = []
                  data.pivotTabledata.push({ value: element.itemName });
                  element.buyGraphsDtos.forEach((sale:any) => {
                    data.pivotTabledata.push({ value: data.yDisplayType.toLowerCase() == 'amount' ? sale.price : sale.quantity.toString() });
                    if (index == 0) {
                      data.tableheader.push({
                        year: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(sale.date) : data.xDisplayType.toLowerCase() == 'monthly' ? sale.month + ' ' + sale.year.toString() : sale.year.toString(),
                      });
                    }
                  })
                  data.pivotTable.push(data.pivotTabledata);
                })
              } else if (data.isSale == true && data.isBuy == false && data.withMargin == true) {
                this.typeTable = 'Sell and Margin Table'
              } else if (data.isSale == true && data.isBuy == true && data.withMargin == false) {
                data.name = 'Sell and Buy Table'
              }
            }
        }
      }else if(data.isCustomReport==true){
        data.yaxisLabelName = 'Quantity'
        // Bar Chart 
        if (data.chartType == 'Bar Chart' ) {
          if (data.xDisplayType == 'Yearly') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.year.toString(),
                series: [{ name: data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.year.toString(),
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
          } else if (data.xDisplayType == 'Daily') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: this.formatDate(e.date),
                series: [{ name: data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: this.formatDate(e.date),
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
          } else if (data.xDisplayType == 'Monthly') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.month,
                series: [{ name: data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.month,
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
        }

        }
         // Line Chart 
         if (data.chartType == 'Line Chart' ) {
          var Dummylinechart :any= [];
          data.graphsDtos.forEach((e:any) => {
              Dummylinechart.push({
                name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
              });
          });
          data.linechartbar.push({ name: data.entityName, series: Dummylinechart })
          var Dummylinechart1 :any= [];
          data.graphsGroupDtos.forEach((e:any) => {
              Dummylinechart1.push({
                name: data.xDisplayType.toLowerCase() == 'daily' ? this.formatDate(e.date) : data.xDisplayType.toLowerCase() == 'monthly' ? e.month + ' ' + e.year.toString() : e.year.toString(),
                value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
              });
          });
          data.linechartbar.push({ name: data.entityName+' of Groups', series: Dummylinechart1 })

        }
        // Vertical bar chart 
        else if (data.chartType == 'Vertical bar chart') {
          if (data.xDisplayType == 'Yearly') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.year.toString(),
                series: [{ name:data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: e.year.toString(),
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });

          } else if (data.xDisplayType == 'Daily') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: this.formatDate(e.date),
                series: [{ name: data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name: this.formatDate(e.date),
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });

          } else if (data.xDisplayType == 'Monthly') {
            data.graphsDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name:  e.month, 
                series: [{ name:data.entityName, value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
            data.graphsGroupDtos.forEach((e:any) => {
              data.savedBarChartData.push({
                name:  e.month,
                series: [{ name:data.entityName+' of Groups', value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString(), }]
              })
            });
          }
        }
      // Pie Chart 
      else if (data.chartType == 'Pie Chart') {
        data.multipleSaleBar = []
        data.graphsDtos.forEach((e:any) => {
          data.multipleSaleBar.push({ name: data.entityName, value: e.quantity })
        });
        data.graphsGroupDtos.forEach((e:any) => {
          data.multipleSaleBar.push({ name: data.entityName+' of Groups', value: e.quantity })
        });
      }
       // Area Chart 
       else if (data.chartType == 'Area Chart') {
        let data1:any = []
        let data2:any = []
        data.graphsDtos.forEach((e:any) => {
          data1.push({
                name:data.xDisplayType.toLowerCase() == 'daily'? this.formatDate(e.date):data.xDisplayType.toLowerCase() == 'monthly'?e.month + ' ' + e.year.toString():e.year.toString(),
                value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
          });
        });
        data.graphsGroupDtos.forEach((e:any) => {
          data2.push({
                name:data.xDisplayType.toLowerCase() == 'daily'? this.formatDate(e.date):data.xDisplayType.toLowerCase() == 'monthly'?e.month + ' ' + e.year.toString():e.year.toString(),
                value: data.yDisplayType.toLowerCase() == 'amount' ? e.price : e.quantity.toString()
          });
        });
        data.areachartbar.push(
          { name: data.entityName, series: data1 },
          { name: data.entityName+' of Groups', series: data2 }
        )
      }
    }
    }
  }



  // openUserDialog
  keywordtransation(row:any, type: string) {
    console.log(type)
    console.log(row)
      this.dialog.open(PopupForAllComponent, {
        width: '600px',
        // position: { top: '125px', left: '700px' },
        autoFocus: false,
        disableClose: true,
        data: { data: row, type: type },
      });
  }

    // user detail & user group detail
    openTransactionDialog(data:any): void {
      this.dialog.open(TransactionDetailsComponent, {
        disableClose: true,
        data: { data: data, type: 'transation' },
        width: '500px',
      });
    }
  

  change(event:any) {
    if (event.source.selected) {
      // if(this.selected.length == 0) {
      //   this.selected.push(event.source.value);
      // } else {
      //   this.selected.forEach((element:any) => {
      //     console.log(element:any)
      //     console.log(event.source.value)
      //     if(element != event.source.value) {
      //       this.selected.push(event.source.value);
      //     }
      //   });
      // }
      this.selected.push(event.source.value);

      
    } else {
      var index = this.selected.indexOf(event.source.value);
      if (index !== -1) {
        this.selected = this.selected.splice(index, 1);
      }
    }
  }

  showReports() {
    this.mySelect.close();
    if (this.defaultCharts) { this.defaultCharts.length = 0; }
    this.loader=true
    this.graphService.generateReports(this.selected).subscribe(data => {
      if (data) {
        this.loader=false
        this.savedBarChartData.length = 0
        var filteredSave = data;
        this.onLoad = false;
        this.defaultCharts = filteredSave.filter(function (el:any) { return el != null; });
        for (var i = 0; i <= this.defaultCharts.length; i++) {
          this.CreateReport(this.defaultCharts[i]);
        }
        this.defaultCharts.forEach((element:any) => {
          if (Array.isArray(element.dynamicKeywords)) {
            element.transactionKeywords.forEach((e:any) => {
              e.dynamic = false; 
            });
            element.dynamicKeywords.forEach((e:any) => {
              e.dynamic = true; 
            });
            element.transactionKeywords.push(...element.dynamicKeywords);
          }
        });
        console.log(this.defaultCharts)
        
      }
    },error=>{
      this.loader=false
    });
  }

  selectSavedChart(e:any, data:any) {
    this.SavedChart.response = data
    if (e.checked) {
      this.isExport = false;
    } else {
      this.isExport = true;
    }
  }

  select(e:any, data:any) {
    if (e.checked) {
      this.isExport = false;
    } else {
      this.isExport = true;
    }
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.searchUserForm?.controls.userType?.patchValue([...this.allReports.map((item:any) => item.id), 0]);
      console.log(this.allSelected, this.selected, 'allselected')
    } else {
      this.searchUserForm.controls.userType.patchValue([]);
    }
  }
  // tosslePerOne(all:any) {
  //   if (this.allSelected.selected) {
  //     this.allSelected.deselect();
  //     return false;
  //   }
  //   if (this.searchUserForm.controls.userType.value.length == this.allReports.length)
  //     this.allSelected.select();
  // }

  kewordconvertTostring(value:any) {
    if (!null) {
      return value.split(',')
    }
  }

  exportChart() {
    this.loader=true
    this.graphService.exportReport(this.SavedChart.response).subscribe((result: Blob) => {
      const blob = new Blob([result], { type: 'application/vnd.ms-excel' });
      const data: Blob = new Blob([result], {
        type: "application/vnd.ms-excel"
      });
      this.loader=false
      saveAs(data, "ReportChart.csv");
    },error=>{
      this.loader=false
    })
  }



  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
