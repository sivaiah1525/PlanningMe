import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DriveService } from 'src/app/core/services/drive.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-filter-common',
  templateUrl: './filter-common.component.html',
  styleUrls: ['./filter-common.component.scss'],
})
export class FilterCommonComponent implements OnInit {
  FilterForm!: FormGroup;
  UserGroupForm!:FormGroup
  applicationname: any;
  ConfigurationNamelistforApiKey: any;
  selectedFile: boolean = true;
  selectedApiKey: boolean = true;
  selectedImport: boolean = true;
  selectedExport: boolean = true;
  filterGroup: any[] = [];
  AllGroup: any[] = [];
  screenType: any;
  selectedUserType = '';
  AllList: any[] = [];
  filterList: any[] = [];
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private DriveService: DriveService,
    private MatDialogRefDelet: MatDialogRef<FilterCommonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit(): void {
    this.screenType = this.data.type;
    this.FilterForm = this.formBuilder.group({
      File: [null],
      ApiKey: [null],
      Import: [null],
      Export: [null],
      StartDate: [null],
      EndDate: [null],
      applicationId: [null],
      Configurationid: [null],
      ConfigurationDescription: [null],
    });
    this.UserGroupForm = this.formBuilder.group({
      SelactedGroups: [null],
      selectTypeGroup:[false],
      selectTypeSingle:[false],
      Selactedusers:[null]
    });

    this.getapplicationname();
    this.getMultipleUser()
    this.getUserList()
  }

  getMultipleUser() {
    this.manageUsersService.findAllUsersGroupDropdown().subscribe((result) => {
      if (result) {
        this.AllGroup = result;
        this.filterGroup = result;
      }
    });
  }

  getUserList() {
    this.manageUsersService.findAllUsersDropdown().subscribe((result)=>{
      if(result){
        this.AllList=result
        this.filterList=result
      }
    }); 
  }

  filterOptions(value: string, type: string): void {
    if(type==='users'){
      this.filterList = this.AllList.filter(option =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    }  else if(type==='UserGroups'){
      this.filterGroup = this.AllGroup.filter(option =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
    }

  }

  switchLanguage(value:any) {
    if (value == 'File') {
      this.selectedFile = !this.selectedFile;
    } else if (value == 'ApiKey') {
      this.selectedApiKey = !this.selectedApiKey;
    } else if (value == 'Import') {
      this.selectedImport = !this.selectedImport;
    } else if (value == 'Export') {
      this.selectedExport = !this.selectedExport;
    }
  }

  // getapplicationname
  getapplicationname() {
    this.DriveService.getApplications().subscribe((res) => {
      this.applicationname = res;
    });
  }

  SelectConfigurationName(value:any) {
    this.FilterForm.get('ConfigurationDescription')?.setValue(
      value.configurationName
    );
  }

  // Selactapplication
  Selactapplication(application:any) {
    this.getAvailableApiKeys(application.id);
  }
  // getAvailableApiKeys
  getAvailableApiKeys(id:any) {
    this.DriveService.getAvailableApiKeys(id).subscribe((res: any) => {
      if (res) {
        this.ConfigurationNamelistforApiKey = res;
      }
    });
  }

  onSubmit() {
    this.FilterForm.get('File')?.setValue(this.selectedFile);
    this.FilterForm.get('ApiKey')?.setValue(this.selectedApiKey);
    this.FilterForm.get('Import')?.setValue(this.selectedImport);
    this.FilterForm.get('Export')?.setValue(this.selectedExport);
    this.MatDialogRefDelet.close(this.FilterForm.value);
  }



  UserGroupApply() {
    console.log(this.UserGroupForm.value)
    this.MatDialogRefDelet.close(this.UserGroupForm.value);
  }

  selectTypeGroup(){
    return this.UserGroupForm.value.selectTypeGroup
  }
  selectTypeSingle(){
    return this.UserGroupForm.value.selectTypeSingle
  }
}
