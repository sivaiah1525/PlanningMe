import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DriveService } from 'src/app/core/services/drive.service';
import { ExportLogsComponent } from './export-logs/export-logs.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logspace',
  templateUrl: './logspace.component.html',
  styleUrls: ['./logspace.component.scss']
})
export class LogspaceComponent implements OnInit {
  activeIndex:any;
  columns: string[] | undefined;
  logdata: any;
  startPage = 1
  noOfRecords = 20
  form: FormGroup | undefined
  userDataLength = 100
  deletebuttonshow = false
  selectedInfo: boolean = true;
  selectedWarning: boolean = false
  constructor(
    private DriveService: DriveService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    public OrgSrvice:CheckOrganationTypeService,
    private matoService: MatomoService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      } this.matoService.trackPageView('Logs-page');
    if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('AuditLog')
      console.log(data)
      this.popupforerrormessage(data.message, data.header);
    } 
    
   }

  ngOnInit(): void {
    this.form = this.fb.group({
      message: [''],
      startDate: [''],
      endDate: [''],
    })
    this.columns = ['name', 'logTime', 'userName', 'message'];
    this.logdata = new MatTableDataSource(this.logdata);
    this.logspaceFormat(this.form.value.startDate, this.form.value.endDate, this.form.value.message, this.startPage, this.noOfRecords)
  }


  datefprmat(value:any) {
    return this.datepipe.transform(value, 'dd-MMM-yyyy')
  }
  next(event:any) {
    this.logspaceFormat(this.form?.value.startDate, this.form?.value.endDate, this.form?.value.message, event.pageIndex + 1, this.noOfRecords)
  }
  logspaceFormat(startDate:any, endDate:any, message:any, startPage:any, noOfRecords:any) {
    this.DriveService.GetLogData(startDate, endDate, message, startPage, noOfRecords).subscribe((result: any) => {
      if (result) {
        this.logdata = result.logs;
        this.userDataLength = result.totalCount
        this.closedialogbox()
      }
    })
  }


 // ExportLogs
 ExportLogs() {
  this.dialog.open(ExportLogsComponent, {
    width: '500px',
    autoFocus: false,
    disableClose: true
  });
}


  advancesearch(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '500px'
    })
  }

  switchFileType(value:any) {
    if (value == 'Info') {
      this.selectedInfo = !this.selectedInfo
    } else {
      this.selectedWarning = !this.selectedWarning
    }
  }
  
  closedialogbox() {
    this.dialog.closeAll();
  }
  onSubmit() {
    this.logspaceFormat(this.datefprmat(this.form?.value.startDate), this.datefprmat(this.form?.value.endDate), this.form?.value.message, this.startPage, this.noOfRecords)
    this.deletebuttonshow = true
  }

  closesearch() {
    this.deletebuttonshow = false
    this.logspaceFormat('', '', '', 1, 100)
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
