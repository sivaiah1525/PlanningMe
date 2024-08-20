import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ResizeService } from 'src/app/core/services/resize.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { saveAs } from "file-saver";
import { es } from 'date-fns/locale';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { DriveService } from 'src/app/core/services/drive.service';
import { MessageService } from 'src/app/core/services/message.service';
import { CreateConfigurationformComponent } from 'src/app/pages/settings/create-configurationform/create-configurationform.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-export-data-manage-all',
  templateUrl: './export-data-manage-all.component.html',
  styleUrls: ['./export-data-manage-all.component.scss']
})
export class ExportDataManageAllComponent implements OnInit {
  showicon!: boolean;
  profilePick: any;
  profilePickid: any
  userDataSource: any;
  userGroups: any = [];
  successMessage!: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isMobileView!: boolean;
  width!: number;
  userList: [] = [];
  datadelete: any;
  id: any;
  userdatadata: any;
  datadeleteindex: any;
  userGroupsdata: any;
  groupdata: any;
  groupindex: any;
  isShown: boolean = false;
  index: any;
  useriddata: any;
  users$: any;
  userDataLength: any;
  quickSearchValue = null;
  singleSearchValue = null;
  siglefilter = '';
  mapeventsubcription: any;
  usergroupdata: any;
  usergroupDataLength: any;
  singlefilter = '';
  checked: any;
  selectedtagvalue: any;
  tabnumber!: number;
  targetSearchValue = null;
  targetfilter = '';
  userGroupTargetsDataSource: any;
  tabledata: any;
  productTargetlength: any;
  userTargetlength: any;
  Level: any;
  fileFormat = 'csv'
  exportType = ''
  UserScreen = false;
  ProductScreen = false;
  OrdersScreen = false;
  transactionsScreen = false;
  ContactScreen = false;
  SiteScreen = false;
  exportdataForm: FormGroup
  checkBoxSelactIds :any= [];
  Alldata :any= [];
  SelactAllStatus = false;
  EntityType:any;
  Webservice: boolean = false
  applicationname!: Object;
  ConfigurationName!: object;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private manageUserService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageproductsService: ManageProductsService,
    private managesitesService: ManageSitesService,
    public snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private ManageTransactionsService: ManageTransactionsService,
    private DriveService: DriveService,
    private matDialogRef: MatDialogRef<ExportDataManageAllComponent>,
    private messageService: MessageService,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
      this.exportdataForm = this.fb.group({
      search: [''],
      fileformat: [''],
      applicationName: [''],
      applicationid: [''],
      ConfigurationName: [''],
      mapId: [''],
      text: [''],
    })
  }

  ngOnInit() {
    console.log(this.data)
    this.EntityType = this.data.type
    if (this.data.type == "Users") {
      this.exportType = 'UserExport'
      this.Level = this.data.type
      this.UserScreen = true;
      this.getalluser()
    }
    else if (this.data.type == "Contacts") {
      this.exportType = 'ContactExport'
      this.Level = this.data.type
      this.ContactScreen = true
      this.getallcontact()
    } else if (this.data.type === "Sites") {
      this.exportType = 'SiteExport'
      this.Level = this.data.type
      this.SiteScreen = true
      this.getallSite()

    } else if (this.data.type == "Products") {
      this.exportType = 'ProductsExport'
      this.Level = this.data.type
      this.ProductScreen = true
      this.getallproduct()
    } else if (this.data.type == 'Orders') {
      this.exportType = 'orderExport'
      this.Level = this.data.type
      this.OrdersScreen = true;
      this.getAllOrders()
    } else if (this.data.type == 'Transactions') {
      this.exportType = 'transactionExport'
      this.Level = this.data.type
      this.transactionsScreen = true;
      this.getAlltransactions()
    }
  }

  SelectConfigurationName(id:any) {
    this.exportdataForm.get('mapId')?.setValue(id)
  }
  getapplicationname() {
    this.DriveService.getApplications().subscribe((res) => {
      console.log(res);
      this.applicationname = res;
    });
  }

  Selactapplication(application:any) {
    this.exportdataForm.get('applicationName')?.setValue(application.applicationName);
    this.exportdataForm.get('applicationid')?.setValue(application.id);
    this.FindMappingConfigurationsDropdown(application.id)
  }
  // getAvailableApiKeys 
  FindMappingConfigurationsDropdown(id:any) {
    this.DriveService.getAvailableApiKeys(id).subscribe((res: any) => {
      if (res) {
        this.ConfigurationName = res
      }
    })
  }

  // closedialogbox
  closedialogbox() {
    this.dialog.closeAll();
  }
  // selectTypeChanged
  selectTypeChanged(type:any) {
    this.fileFormat = type
    if (type == 'External') {
      this.Webservice = true
      this.getapplicationname()
    } else {
      this.Webservice = false
    }
  }
  // checkBoxSelact
  checkBoxSelact(event:any, data:any) {
    console.log(event, data)
    this.id = data.id
    if (event.checked == true) {
      this.checkBoxSelactIds.push(this.id);
    } else {
      var index = this.checkBoxSelactIds.indexOf(this.id);
      if (index !== -1) {
        this.checkBoxSelactIds = this.checkBoxSelactIds.splice(index, 1);
      }
    }
  }

  createmapping() {
    const createmapping = this.dialog.open(CreateConfigurationformComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: this.EntityType },
      disableClose: true
    });
    createmapping.afterClosed().subscribe((result: any) => {
      this.getapplicationname()
      console.log(result)
    })
  }



  SelactAllData(event:any) {
    if (event.checked == true) {
      this.SelactAllStatus = true
      this.Alldata.map((ele:any) => {
        return ele.chekecd = true
      })
    } else {
      this.Alldata.map((ele:any) => {
        this.SelactAllStatus = false
        return ele.chekecd = false
      })
    }
  }





  // exportdata
  exportdata() {
    if (this.fileFormat == 'External') {
      this.manageUserService.exportExternal(this.EntityType, this.checkBoxSelactIds, this.exportdataForm.value.mapId).subscribe((result: any) => {
        if (result) {
          this.snackBar.open(result['response'][0].message, '', { duration: 3000, });
        }
      })
    }
    else if (this.SelactAllStatus == true) {
      this.manageUserService.Export(this.fileFormat, this.Level, this.checkBoxSelactIds).subscribe((result: Blob) => {
        // zip 
        const data: Blob = new Blob([result], { type: "application/zip" });
        saveAs(data, this.exportType);
      })
    } else if (this.SelactAllStatus == false) {
      this.manageUserService.Export(this.fileFormat, this.Level, this.checkBoxSelactIds).subscribe((result: Blob) => {
        // zip 
        const data: Blob = new Blob([result], { type: "application/zip" });
        saveAs(data, this.exportType);
      })
    }
  }

  // getalluser
  getalluser() {
    this.manageUserService.findAllUsersDropdown().subscribe((result: any) => {
      result.forEach((element:any) => {
        this.Alldata.push({
          id: element.id,
          name: element.firstName + ' ' + element.lastName,
          profilePicture: element.profilePicture,
          chekecd: false,
        })
      });
    });
  }
  // getallproduct
  getallproduct() {
    this.manageproductsService.findAllProductsDropdown().subscribe((result) => {
      result.forEach((element:any) => {
        this.Alldata.push({
          id: element.id,
          name: element.productName,
          profilePicture: element.profilePicture,
          chekecd: false,
        })
      });
    })
  }
  // getallcontact
  getallcontact() {
    this.manageContactsService.findAllContactsDropdown().subscribe((result) => {
      result.forEach((element:any) => {
        this.Alldata.push({
          id: element.id,
          name: element.firstName + ' ' + element.lastName,
          profilePicture: element.profilePicture,
          chekecd: false,
        })
      });
    })
  }
  // getallSite
  getallSite() {
    this.managesitesService.findAllSitesDropdown().subscribe((result) => {
      result.forEach((element:any) => {
        this.Alldata.push({
          id: element.id,
          name: element.companyName,
          profilePicture: element.profilePicture,
          chekecd: false,
        })
      });
    })
  }

  // get all transaction 
  getAlltransactions() {
    this.ManageTransactionsService.fetchTransactionsServices(100, 1, '').subscribe((res: any) => {
      res.data.forEach((element:any) => {
        this.Alldata.push({
          id: element.id,
          chekecd: false,
        })
      });
    });
  }

  // get all getAllOrders 
  getAllOrders() {
    this.ManageTransactionsService.fetchTransactionsServices(100, 1, '').subscribe((res: any) => {
      res.data.forEach((element:any) => {
        this.Alldata.push({
          id: element.orderId,
          chekecd: false,
        })
      });
    });
  }


}




