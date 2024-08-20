import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriveService } from 'src/app/core/services/drive.service';
import { MessageService } from 'src/app/core/services/message.service';
import { onseencol, plancol } from '../mapping/mapping.component';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mappingconfigurationform',
  templateUrl: './mappingconfigurationform.component.html',
  styleUrls: ['./mappingconfigurationform.component.scss'],
})
export class MappingconfigurationformComponent implements OnInit {
  configurationform: FormGroup;
  managementType = ['Users', 'Contacts', 'Sites', 'Products', 'Transactions'];
  SelectEntityValue: any;
  applicationname: any;
  planningcolumns:any = [];
  ConfigurationNamelistforfile: any;
  ConfigurationNamelistforApiKey: any;
  appname: any;
  id!: number;
  mappingcol:any = [];
  finalmapeddata:any = [];
  configuration: any;
  tabindex = 0;
  today = new Date();
  mappingdata: any;
  screentype:any
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private DriveService: DriveService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }   
       this.configurationform = this.formBuilder.group({
      applicationName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      ConfigurationName: [''],
      ConfigurationDescription: ['', Validators.required],
      isFile: [false],
      UploadFile: [''],
      mappingId: [''],
      created: [],
      Url: [''],
      apiKey: [''],
      applicationId: [''],
    });
  }

  ngOnInit(): void {
    this.getapplicationname();
    this.screentype = this.data?.screenType;
    this.mappingdata = this.data.data;
    if (this?.data?.screenType == 'UpdateMapping') {
      this.GetMappingdetails(this?.data?.data);
    } else if (this?.data?.screenType == 'ViewMapping') {
      this.GetMappingdetails(this?.data?.data);
    }
  }

  GetMappingdetails(data:any) {
    this.SelectEntityValue == 'ContactsSites'
    console.log(data)
    if (this.mappingdata.isFile == true) {
      this.tabindex = 1;
    } else {
      this.tabindex = 0;
    }
    this.getAvailableApiKeys(data.id);
    this.getPlanningColumn();
    this.configurationform.get('applicationId')?.setValue(data.applicationId);
    this.configurationform.get('applicationName')?.setValue(data.name);
    this.configurationform.get('ConfigurationName')?.setValue(data.id);
    this.SelectConfigurationName(data.id);
  }
  // finale onSubmit
  onSubmit() {
    this.mappingcol.filter((element:any) => {
      if (element.isChecked == true) {
        this.finalmapeddata.push({
          id: element.id,
          fileColumnName: element.fileColumnName,
          entityFieldName: element.entityFieldName,
          isTag: element.element,
          dataType: element.dataType,
        });
      }
    });
    if (this.tabindex == 0) {
      this.configurationform.get('isFile')?.setValue(false);
      let data = {
        applicationId: this.configurationform.get('applicationId')?.value,
        name: this.configurationform.get('applicationName')?.value,
        configurationName:
          this.configurationform.get('ConfigurationName')?.value,
        configurationDescription: this.configurationform.get(
          'ConfigurationDescription'
        )?.value,
        created: this.today,
        isFile: this.configurationform.get('isFile')?.value,
        apiKey: this.configurationform.get('apiKey')?.value,
        url: this.configurationform.get('url')?.value,
        columns: this.finalmapeddata,
      };
      this.DriveService.UpdateConfiguration(data).subscribe((result) => {
        if (result) {
          this.snackBar.open('update mapping Created', '', { duration: 2000 });
          this.dialog.closeAll();
        }
      });
    } else if (this.tabindex == 1) {
      this.configurationform.get('isFile')?.setValue(true);
      let data = {
        applicationId: this.configurationform.get('applicationId')?.value,
        name: this.configurationform.get('applicationName')?.value,
        configurationName:
          this.configurationform.get('ConfigurationName')?.value,
        configurationDescription: this.configurationform.get(
          'ConfigurationDescription'
        )?.value,
        created: this.today,
        isFile: this.configurationform.get('isFile')?.value,
        columns: this.finalmapeddata,
      };
      this.DriveService.UpdateConfiguration(data).subscribe((result) => {
        if (result) {
          this.snackBar.open('Update mapping ', '', { duration: 2000 });
          this.dialog.closeAll();
        }
      });
    }
  }
  // tabChanged
  tabChanged(event:any) {
    this.tabindex = event.index;
    if (this.tabindex == 0) {
      this.mappingcol.length = 0;
      this.planningcolumns.length = 0;
      this.configurationform.reset();
    } else if (this.tabindex == 1) {
      this.mappingcol.length = 0;
      this.planningcolumns.length = 0;
      this.configurationform.reset();
    }
  }
  // SelectEntity
  SelectEntity(value:any) {
    this.SelectEntityValue = value;
    this.FindFileMappingConfigurationsDropdown();
    this.getPlanningColumn();
  }
  // SelectConfigurationName
  SelectConfigurationName(id:any) {
    if (this.tabindex == 0) {
      this.FindConfigurationDetails(id, false);
    } else if (this.tabindex == 1) {
      this.FindConfigurationDetails(id, true);
    }
  }
  // viewConfiguration
  viewConfiguration() {
    let StartDate:any = this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd') ;
    let EndDate:any =this.datePipe.transform(new Date(), 'yyyy-MM-dd') ;
    let params = new HttpParams()
      .append('NumberOfRecord', '0')
      .append('PageNumber', '1')
      .append('StartDate',StartDate )
      .append('EndDate',EndDate );
    this.DriveService.viewConfigurations(params).subscribe((res) => {
      this.configuration = res;
    });
  }
  // Selactapplication
  Selactapplication(application:any) {
    this.SelectEntityValue = 'ContactsSites';
    this.configurationform
      .get('applicationName')
      ?.setValue(
        application?.applicationName
          ? application.applicationName
          : application.name
      );
    this.appname = application.id;
    this.getAvailableApiKeys(application.id);
    this.getPlanningColumn();
  }
  // getExternalcolumnapplication
  getExternalcolumnapplication() {
    this.DriveService.getApplicationsById(this.appname).subscribe(
      (res: any) => {
        console.log(res);
        res.forEach((element:any) => {
          this.mappingcol.push({
            fileColumnName: element,
            isChecked: true,
            entityFieldName: '',
            tag: false,
          });
        });
      }
    );
  }
  // getPlanningColumn
  getPlanningColumn() {
    this.DriveService.getplanningcolumns(this.SelectEntityValue).subscribe(
      (res: any) => {
        if (res) {
          if (this.SelectEntityValue == 'ContactsSites') {
            this.planningcolumns = res;
          } else {
            this.planningcolumns = res.defaultColumns;
          }
        }
      }
    );
  }
  // getapplicationname
  getapplicationname() {
    this.DriveService.getApplications().subscribe((res) => {
      this.applicationname = res;
      this.applicationname.map((e:any) => {
        if (this.data.mapscreen == true) {
          if (e.applicationName == 'MySource.Data') {
            this.Selactapplication(e);
          }
        }
      });
    });
  }

  // getAvailableApiKeys
  getAvailableApiKeys(id:any) {
    this.DriveService.getAvailableApiKeys(id).subscribe((res: any) => {
      if (res) {
        this.ConfigurationNamelistforApiKey = res;
      }
    });
  }

  // FindFileMappingConfigurationsDropdown
  FindFileMappingConfigurationsDropdown() {
    this.DriveService.FindFileMappingConfigurationsDropdown(
      this.SelectEntityValue
    ).subscribe((result: any) => {
      if (result) {
        this.ConfigurationNamelistforfile = result;
      }
    });
  }

  // FindConfigurationDetails
  FindConfigurationDetails(id:any, isfile:any) {
    let data = {
      MapId: id,
      IsFile: isfile,
    };
    this.DriveService.FindConfigurationDetails(data).subscribe(
      (result: any) => {
        if (result) {
          this.configurationform
            .get('ConfigurationDescription')
            ?.setValue(result.configurationDescription);
          this.configurationform
            .get('applicationId')
            ?.setValue(result.applicationId);
          this.configurationform.get('mappingId')?.setValue(result.mappingId);
          this.configurationform.get('applicationName')?.setValue(result.name);
          this.configurationform.get('isFile')?.setValue(result.isFile);
          this.configurationform.get('apiKey')?.setValue(result.apiKey);
          this.configurationform.get('Url')?.setValue(result.url);
          result.columns.forEach((element:any) => {
            this.mappingcol.push({
              fileColumnName: element.fileColumnName,
              isChecked: true,
              entityFieldName: element.entityFieldName
                .replaceAll(/([A-Z])/g, ' $1')
                .trim(),
              dataType: element.dataType,
              isTag: element.isTag,
            });
          });
        }
        console.log(this.mappingcol);
      }
    );
  }
}
