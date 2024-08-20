import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DriveService } from 'src/app/core/services/drive.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AccountDetailsComponent } from '../Account/account-details/account-details.component';
import { PaymentModeAddComponent } from '../Account/payment-mode-add/payment-mode-add.component';
import { MappingconfigurationformComponent } from '../mappingconfigurationform/mappingconfigurationform.component';
import { CreateConfigurationformComponent } from '../create-configurationform/create-configurationform.component';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FilterCommonComponent } from '../../commonForAll/filter-common/filter-common.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';

interface integrationType {
  value: string;
  viewValue: string;
}

export interface onseencol {
  onseencol: string;
  id: number;
  isChecked: boolean;
  planingcol: [];
  dropdownvalue: '';
}

export interface plancol {
  planingcolumn: string;
  dropdownvalue: string;

}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  tabnumber!: number;
  form!: FormGroup;
  conectionType: any;
  calendarType: any;


  //tab2 starts here
  configurationform!: FormGroup;


  drivetype: integrationType[] = [
    { value: 'googlecalendar', viewValue: 'Google Calendar' },
    { value: 'outlookcalendar', viewValue: 'Outlook Calendar' },
    { value: 'googledrive', viewValue: 'Google Drive' },
    { value: 'dropbox', viewValue: 'Drop Box' },
    { value: 'onedrive', viewValue: 'One Drive' },
  ];
  connectorIntegration!: Object;
  userId: any;
  Connectortype!: Object;
  externalcoulmns: onseencol[] = []; externalonseencoulmns: any;
  applicationname!: Object;
  appname: any;
  planningcolumns: plancol[] = [];
  onseencol :any= [];
  configuration: any;
  appid: any;
  index: any;
  id = 0;
  mappingcol :any= [];
  finalmapeddata:any = [];
  configurationdetails: any;
  mapedcolumn: any;
  companyForm!: FormGroup
  companyFormId: any
  orgDetails: any;
  personalspace: any;
  orgId: any;
  dbsize!: { name: string; value: number; }[];
  organisationspace: any;
  showorg!: boolean;
  invoiceForm!: FormGroup;
  color1 = '#2889e9';
  minDate!: string;
  storagevalue: any;
  planning: any;
  Global: any
  invoiceDetails:any;
  profilePick: any;
  profilePickForCompany: any;
  options = {
    types: ['geocode'],
    componentRestrictions: { country: 'FR' }
  }
  AdminStatus: any;
  stockmaintainmess = ''
  imageArray :any= [];
  DemoOrganationstatus:boolean=false
  constructor(
    private DriveService: DriveService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private cpService: ColorPickerService,
    private googleAddress: GoogleValidationAddressService,
    private datePipe: DatePipe,
    public OrgSrvice:CheckOrganationTypeService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }    if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('Parameters')
      console.log(data)
      this.popupforerrormessage(data.message, data.header);
    } 
    this.AdminStatus = localStorage.getItem("isAdmin");
  }

  ngOnInit() {
    this.tabnumber = 0;
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: [''],
      connectorId: [0, Validators.required],
      isConnectionActive: [false, Validators.required],
      canWeImport: [false, Validators.required],
      canWeExport: [false, Validators.required],
    });
    this.companyForm = this.formBuilder.group({
      id: [''],
      activityType: [''],
      Registrationnumber: [''],
      companyName: [''],
      Address: [''],
      profile: [''],
      city: [''],
      zipcode: [''],
      country: [''],
      organizationDetails: [''],
      Phonenumber: [''],
      StockManagement: [false],
      latitude: [''],
      longitude: [''],
    });
    this.invoiceForm = this.formBuilder.group({
      id: [''],
      CompanyName: [''],
      name: [''],
      Address: [''],
      country: [''],
      city: [''],
      zipcode: [''],
      latitude: [''],
      longitude: [''],
      Logo: [''],
      InvoiceColor: [this.color1],
      PaymentMention: [''],
      BankAccount: [[]],
      PaymentDeadLine: [''],
      QuoteDeadLine: [''],
      PenaltyMention: [''],
      FooterMention: [''],
    });
    this.userId = localStorage.getItem('id');
    this.minDate = new Date().toISOString();
    this.viewConfiguration()
    this.userCapacity();
    this.orgCapacity();
  }


  tabChange(tabIndex: number): void {
    console.log(tabIndex);
    this.tabnumber = tabIndex;
    if (this.tabnumber == 0) {
      this.viewConfiguration();
    } else if (this.tabnumber == 2) {
      this.Configurationvalue()
    }
    else if (this.tabnumber == 4) {
      this.getCompanyDetails()
    }
  }

  getCompanyDetails() {
    this.DriveService.getOranization().subscribe((res: any) => {
      this.profilePickForCompany = res?.profile
      this.orgDetails = res
      console.log(this.orgDetails, 'orgDetails');
      this.companyForm.get('Registrationnumber')?.setValue(this.orgDetails.registrationNumber);
      this.companyForm.get('companyName')?.setValue(this.orgDetails.companyName);
      this.companyForm.get('Address')?.setValue(this.orgDetails.address);
      this.companyForm.get('city')?.setValue(this.orgDetails.city);
      this.companyForm.get('zipcode')?.setValue(this.orgDetails.zipCode);
      this.companyForm.get('country')?.setValue(this.orgDetails.country);
      this.companyForm.get('latitude')?.setValue(this.orgDetails?.latitude);
      this.companyForm.get('longitude')?.setValue(this.orgDetails?.longitude);
      this.companyForm.get('id')?.setValue(this.orgDetails.id);
      this.companyForm.get('activityType')?.setValue(this.orgDetails.activityType);
      this.companyForm.get('profile')?.setValue(this.orgDetails?.profile);
    });
  }


  UpdateOranizationProfile() {
    const formData = new FormData();
    console.log(this.imageArray[0]);
    formData.append('Profile', this.imageArray[0]);
    this.DriveService.UpdateOranizationProfile(formData).subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    })
  }

  UpdateCompanyDetails() {

    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage('This button allows you to Update  Company Details','Update Company Details')
    } else {
    console.log(this.companyForm?.value)
    const data = {
      "id": this.companyForm.get('id')?.value,
      "companyName": this.companyForm.get('companyName')?.value,
      "address": this.companyForm.get('Address')?.value,
      "zipCode": this.companyForm.get('zipcode')?.value,
      "city": this.companyForm.get('city')?.value,
      "country": this.companyForm.get('country')?.value,
      "activityType": this.companyForm.get('activityType')?.value,
      "latitude": this.companyForm.get('latitude')?.value,
      "longitude": this.companyForm.get('longitude')?.value,
      "registrationNumber": this.companyForm.get('Registrationnumber')?.value,
      // "profile": this.companyForm.get('profile')?.value,
    }
    this.DriveService.UpdateOranization(data).subscribe((result) => {
      console.log(result)
      if (result) {
        this.getCompanyDetails()
      }
    })
  }
  }

  //tab 1 create connection
  createConnection(templateRef: TemplateRef<any>) {

    this.dialog.open(templateRef, {
      autoFocus: false,
      disableClose: true,
    });
    this.findConnector();
  }

  get f() {
    return this.form.controls;
  }

  onDisplayTypeChanged(drive:any) {
    console.log(drive);
    this.conectionType = drive.name;
  }

  drivelogin() {
    if (this.conectionType == 'Google Calender') {
      // window.open('https://planning.eu-west-3.elasticbeanstalk.com/api/OAuth/GoogleOAuthRedirect', '_blank');
      window.open('https://planning.eu-west-3.elasticbeanstalk.com/api/OAuth/GoogleOAuthRedirect', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); // Open new window
      this.DriveService.createConnection(JSON.stringify(this.form?.value)).subscribe((result:any) => {
        this.messageService.showMessage(result['response'][0].message);
        this.dialog.closeAll();
        this.getConnection();
      });


    }
    else if (this.conectionType == 'OutLook Calender') {
      // window.open('https://planning.eu-west-3.elasticbeanstalk.com/api/OAuth/AzureOAuthRedirect', '_blank');
      window.open('https://planning.eu-west-3.elasticbeanstalk.com/api/OAuth/AzureOAuthRedirect', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); // Open new window
      this.dialog.closeAll();
      this.DriveService.createConnection(JSON.stringify(this.form?.value)).subscribe((result:any) => {
        this.messageService.showMessage(result['response'][0].message);
        this.dialog.closeAll();
        this.getConnection();
      });
    }

  }

  getConnection() {
    this.DriveService.getConnection(this.userId).subscribe((res) => {
      console.log(res);
      this.connectorIntegration = res;
      // this.messageService.showMessage(res['response'][0].message);
    });
  }


  findConnector() {
    this.DriveService.findConnector().subscribe((res) => {
      console.log(res);
      this.Connectortype = res;
      // this.messageService.showMessage(res['response'][0].message);
    });
  }
  SelactConfiguration(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }


  // createConfiguration 
  Mappingconfiguration(data:any,type:any) {
    const Mappingconfiguration = this.dialog.open(MappingconfigurationformComponent,
      {
        data: { data: data, screenType: type },
        autoFocus: false,
        width: '600px',
        disableClose: true,
      });
    Mappingconfiguration.afterClosed().subscribe((result) => {
      console.log(result)
      this.ngOnInit()
    })
  }
  createConfiguration() {
    const createConfiguration = this.dialog.open(CreateConfigurationformComponent,
      {
        autoFocus: false, width: '600px',
        disableClose: true,
      });
    createConfiguration.afterClosed().subscribe((result) => {
      console.log(result)
      this.ngOnInit()
    })
  }

  viewConfiguration() {
      let StartDate :any=  this.datePipe.transform(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
      let EndDate :any=   this.datePipe.transform(new Date(), 'yyyy-MM-dd') 
      let params = new HttpParams()
      .append('NumberOfRecord', '0')
      .append('PageNumber', '1')
      .append('StartDate', StartDate)
      .append('EndDate', EndDate)
      this.DriveService.viewConfigurations(params).subscribe((res) => {
        this.configuration = res;
      });   
  }



  Filterinmapping(){
    const filter=this.dialog.open(FilterCommonComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data:{type:'mappingFilter'}
    })
    filter.afterClosed().subscribe((result: any) => {
      if (result) {
        let StartDate:any = result.StartDate==null?new Date(new Date().getFullYear(), 0, 1):this.datePipe.transform(result.StartDate, 'yyyy-MM-dd');
        let EndDate:any = result.EndDate==null?new Date(): this.datePipe.transform(result.EndDate, 'yyyy-MM-dd');
        let params = new HttpParams()
        .append('NumberOfRecord', '0')
        .append('PageNumber', '1')
        .append('IsFile', result.File)
        .append('IsApikey', result.ApiKey)
        .append('IsImport', result.Import)
        .append('IsExport', result.Export)
        .append('ConfigurationName', result.Configurationid==null?'':result.Configurationid)
        .append('ApplicationName', result.applicationId==null?'':result.applicationId)
        .append('ConfigurationDescription', result.ConfigurationDescription==null?'':result.ConfigurationDescription)
        .append('StartDate', StartDate)
        .append('EndDate',EndDate)
        this.DriveService.FilterMapConfigurations(params).subscribe((res:any) => {
          this.configuration = res.data;
        }); 
      }
    })
  }




  getapplicationname() {
    this.DriveService.getApplications().subscribe((res) => {
      console.log(res);
      this.applicationname = res;
    });
  }

  onChange(name:any) {
    console.log(name);
    this.configurationform.get('applicationName')?.setValue(name.applicationName);
    this.appname = name.id;
    this.getExternalcolumnapplication();
    this.getPlanningColumn();
  }

  getExternalcolumnapplication() {
    this.DriveService.getApplicationsById(this.appname).subscribe((res: any) => {
      this.externalcoulmns = [];
      res.forEach((element:any) => {
        this.id += 1;
        this.externalcoulmns.push({
          id: this.id,
          onseencol: element,
          isChecked: false,
          planingcol: [],
          dropdownvalue: ''
        });
        this.id = this.id;
        this.externalonseencoulmns = this.externalcoulmns;
      });

      console.log(this.externalcoulmns);

    });
  }

  closedialogbox() {
    this.dialog.closeAll()
  }

  getPlanningColumn() {
    this.DriveService.getplanningcolumns('ContactsSites').subscribe((res: any) => {

      this.planningcolumns = [];
      this.planningcolumns.push({
        planingcolumn: res,
        dropdownvalue: ''
      });

      console.log(this.planningcolumns);
      this.planningcolumns = this.planningcolumns;
      let arr3 = this.externalonseencoulmns.forEach((element:any) => {
        this.mappingcol.push({
          id: element.id,
          externalSourceColumn: element.onseencol,
          isChecked: false,
          planingcol: this.planningcolumns[0].planingcolumn,
          planningAndMeMColumn: ''
        });

      });
      console.log(this.mappingcol);
    });
  }

  maintainstock(event:MatSlideToggleChange,templateRef: TemplateRef<any>) {
    const { checked } = event;
    if (checked == true) {
      this.companyForm.get('StockManagement')?.setValue(true)
      this.stockmaintainmess = 'Do You Want Enable Stock Management? '
      this.dialog.open(templateRef, {
        width: '400px',
        autoFocus: false,
        disableClose: true,
      });
    } else {
      this.companyForm.get('StockManagement')?.setValue(false)
      this.stockmaintainmess = 'Do You Want Disable Stock Management? '
      this.dialog.open(templateRef, {
        width: '400px',
        autoFocus: false,
        disableClose: true,
      });
    }
  }
  stockmaintainmessUpdate(){
  this.DriveService.UpdateOrganizationStockStatus(this.companyForm.get('StockManagement')?.value).subscribe((result:any)=>{
    if(result){
      this.dialog.closeAll()
      this.messageService.showMessage(result['response'][0].message);
    }
    console.log(result)
  })

  }


  onSubmit() {
    this.mappingcol.filter((element:any) => {
      if (element.isChecked == true) {
        this.finalmapeddata.push(element);
        console.log(this.finalmapeddata);
      }
    });
    const result = this.finalmapeddata.map(({ id, mappingcol, planingcol, isChecked, ...rest }:any) => ({ ...rest }));
    console.log(result);
    let data = {
      applicationId: this.appname,
      applicationName: this.configurationform.get('applicationName')?.value,
      configurationName: this.configurationform.get('ConfigurationName')?.value,
      configurationDescription: this.configurationform.get('ConfigurationDescription')?.value,
      apiKey: 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl',
      url: 'http://onssendata-testenv.eu-west-3.elasticbeanstalk.com/api/Target/GetUserExportSearchedContacts',
      isFile: false,
      mappedColumns: result
    };
    this.DriveService.createconfiguration(data).subscribe((res:any) => {
      this.viewConfiguration()
      this.messageService.showMessage(res['response'][0].message);
      this.dialog.closeAll();

    });
  }
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.viewConfiguration()
      }
    })
  }


  
  viewconfigurationdetails(templateRef: TemplateRef<any>, configuration:any) {
    this.dialog.open(templateRef, configuration);
    this.appid = configuration;
    this.DriveService.getConfigurationDetails(this.appid.id, this.appid.isFile).subscribe((res: any) => {
      this.configurationdetails = res;
      this.mapedcolumn = res.columns;
    });
  }



  view: any[] = [300, 300];
  single = [
    {
      "name": "Regular Files",
      "value": 34.00
    },
    {
      "name": "Data in DB",
      "value": 46.0
    },
    {
      "name": "Unused Space",
      "value": 20.0
    },
  ];

  colorScheme = {
    domain: ['#3880ff', '#5AA454', '#808080']
  };


  userCapacity() {
    this.userId = localStorage.getItem('id');
    this.DriveService.userDBSize(this.userId).subscribe((res: any) => {
      console.log(res)
      this.personalspace = res
    });
  }

  orgCapacity() {
    this.orgId = localStorage.getItem('orgId');
    this.DriveService.orgDBSize(this.orgId).subscribe((res: any) => {
      this.organisationspace = res
      this.dbsize = [
        {
          "name": "Total_Size in GB",
          "value": parseFloat(this.organisationspace.total_Size)
        },
        {
          "name": "Organization_DB_Size in GB",
          "value": parseFloat(this.organisationspace.organization_DB_Size)
        },
        {
          "name": "AwS_S3_Bucket_Size in MB",
          "value": parseFloat(this.organisationspace.awS_S3_Bucket_Size)
        },
      ];
      this.storagevalue = this.dbsize.map((e: any) => { return (e?.value / 2.4) % 100 })
      this.Global = this.storagevalue[1]
      this.planning = this.storagevalue[2]
      this.showorg = true
    });
  }


  createInvoice() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage('This button allows you to Update  Invoice Configuration','Update Invoice ')
    } else {
    const formData = new FormData();
    formData.append('CompanyName', this.invoiceForm.get('CompanyName')?.value);
    formData.append('Address', this.invoiceForm.get('Address')?.value);
    formData.append('country', this.invoiceForm.get('country')?.value);
    formData.append('city', this.invoiceForm.get('city')?.value);
    formData.append('zipcode', this.invoiceForm.get('zipcode')?.value);
    formData.append('latitude', this.invoiceForm.get('latitude')?.value);
    formData.append('longitude', this.invoiceForm.get('longitude')?.value);
    formData.append('Logo', this.invoiceForm.get('Logo')?.value);
    formData.append('InvoiceColor', this.invoiceForm.get('InvoiceColor')?.value);
    formData.append('PaymentMention', this.invoiceForm.get('PaymentMention')?.value);
    formData.append('BankAccount', this.invoiceForm.get('BankAccount')?.value);
    formData.append('PaymentDeadLine', this.invoiceForm.get('PaymentDeadLine')?.value);
    formData.append('QuoteDeadLine', this.invoiceForm.get('QuoteDeadLine')?.value);
    formData.append('PenaltyMention', this.invoiceForm.get('PenaltyMention')?.value);
    formData.append('FooterMention', this.invoiceForm.get('FooterMention')?.value);
    if (this.invoiceForm?.value!.id) {
      formData.append('id', this.invoiceForm.get('id')?.value);
      this.DriveService.updateInvoice(formData).subscribe((res: any) => {
        this.messageService.showMessage(res['response'][0].message);
      })
    } else {
      this.DriveService.createInvoice(formData).subscribe((res: any) => {
        console.log(res)
        this.messageService.showMessage(res['response'][0].message);
      })
    }
  }
  }

  onFileSelectincompany(event:any,templateRef: TemplateRef<any>) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage('This button allows you to Update Profile for Invoice Configuration','Update Invoice ')
    } else {
    this.imageArray = [];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.form.get('ProfilePicture')?.setValue(file, { emitModelToViewChange: false })
      this.imageArray.push(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePickForCompany = reader.result as string;
        this.form.patchValue({
          fileSource: reader.result
        });
      };
    }
    this.dialog.open(templateRef, {
      width: '400px',
    }) 
  }
  }

  onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.invoiceForm.get('Logo')?.setValue(file);
    }
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.profilePick = event.target.result
      }
    }
  }

  public onEventLog(event: string, data: any): void {
    this.invoiceForm.get('InvoiceColor')?.setValue(data);
  }



  Configurationvalue() {
    this.DriveService.FindInvoiceConfiguration().subscribe((result: any) => {
      if (result) {
        this.profilePick = result?.logoUrl
        this.invoiceDetails = result
        this.color1 = result?.invoiceColor
        this.invoiceForm.get('CompanyName')?.setValue(result?.companyName)
        this.invoiceForm.get('name')?.setValue(result?.userFirstName + ' ' + result?.userLastName)
        this.invoiceForm.get('id')?.setValue(result?.id)
        this.invoiceForm.get('Address')?.setValue(result?.address)
        this.invoiceForm.get('country')?.setValue(result?.country)
        this.invoiceForm.get('city')?.setValue(result?.city)
        this.invoiceForm.get('zipcode')?.setValue(result?.zipcode)
        this.invoiceForm.get('latitude')?.setValue(result?.latitude)
        this.invoiceForm.get('longitude')?.setValue(result?.longitude)
        this.invoiceForm.get('PaymentMention')?.setValue(result?.paymentMention)
        this.invoiceForm.get('InvoiceColor')?.setValue(result?.invoiceColor)
        this.invoiceForm.get('PaymentDeadLine')?.setValue(result?.paymentDeadLine)
        this.invoiceForm.get('QuoteDeadLine')?.setValue(result?.quoteDeadLine)
        this.invoiceForm.get('FooterMention')?.setValue(result?.footerMention)
        this.invoiceForm.get('BankAccount')?.setValue(result?.bankAccounts)
        this.invoiceForm.get('PenaltyMention')?.setValue(result?.penaltyMentions[0].penalty_Mention, result?.penaltyMentions[1].penalty_Mention)

      }
    })
  }

  showAccountDetails() {
    this.dialog.open(AccountDetailsComponent, {
      width: '500px'
    })
  }

  showpaymentMode(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '400px'
    })
  }
  selactpaymentMode() {
    this.dialog.open(PaymentModeAddComponent, {
      width: '500px'
    })
  }




  handleAddressChange(place: object, name:any) {
    const data = this.googleAddress.getFullAddress(place)
    this.companyForm.get('latitude')?.setValue(data.latitude);
    this.companyForm.get('longitude')?.setValue(data.longitude);
    // Address 
    if (data.Address != undefined && data.Address != null && data.Address != 'undefined' && data.Address != 'null') {
      if (name == 'company') {
        this.companyForm.get('Address')?.setValue(data.Address);
      } else {
        this.invoiceForm.get('Address')?.setValue(data.Address);
      }
    } else {
      this.companyForm.get('Address')?.setValue('');
      this.invoiceForm.get('Address')?.setValue('');
    }
    // zipcode 
    if (data.pincode != undefined && data.pincode != null && data.pincode != 'undefined' && data.pincode != 'null') {
      if (name == 'company') {
        this.companyForm.get('zipcode')?.setValue(data.pincode);
      } else {
        this.invoiceForm.get('zipcode')?.setValue(data.pincode);
      }
    } else {
      this.companyForm.get('zipcode')?.setValue('');
      this.invoiceForm.get('zipcode')?.setValue('');
    }
    // city 
    if (data.city != undefined && data.city != null && data.city != 'undefined' && data.city != 'null') {
      if (name == 'company') {
        this.companyForm.get('city')?.setValue(data.city);
      } else {
        this.invoiceForm.get('city')?.setValue(data.city);
      }
    } else {
      this.companyForm.get('city')?.setValue('');
      this.invoiceForm.get('city')?.setValue('');
    }
    // country 
    if (data.country != undefined && data.country != null && data.country != 'undefined' && data.country != 'null') {
      if (name == 'company') {
        this.companyForm.get('country')?.setValue(data.country);
      } else {
        this.invoiceForm.get('country')?.setValue(data.country);
      }
    } else {
      this.companyForm.get('country')?.setValue('');
      this.invoiceForm.get('country')?.setValue('');
    }
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
