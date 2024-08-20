import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,Validators,FormControl,} from '@angular/forms';
import { PasswordValidator } from '../validation/password.validations';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
declare var Stripe: any;
import { environment } from 'src/environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { error } from 'console';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalTranslationService } from 'src/app/core/services/global-translation.service';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { PolicyComponent } from '../../PnmDashboard/components/policy/policy.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ApiSuccessMessagesComponent } from 'src/app/api-success-messages/api-success-messages.component';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagePopupComponent } from '../../commonForAll/message-popup/message-popup.component';
import { PaymentCardDetailsComponent } from 'src/app/core/components/payment-card-details/payment-card-details.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  // ---------- 
  persontokenResult: any;
  accounttokenResult: any;
  cfvalue: any;
  singupForm: FormGroup;
  userForm: FormGroup;
  cfvalueStatus = false;
  singupFormstatus = true;
  userFormsatus = false;
  value = 1;
  image = '../../../../assets/images/management.png';
  Height: Window['innerHeight'];
  accountToken: any;
  errorMessage='';
  registerdata: any;
  fieldTextType = 'password';
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private matoService: MatomoService,
    private translate: TranslateService,
    private globaltranslate: GlobalTranslationService,
    private route: ActivatedRoute,
    private googleAddress: GoogleValidationAddressService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.matoService.trackPageView('Signup-page');
    this.Height = window.innerHeight;
    this.singupForm = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      Address: ['', Validators.compose([Validators.required])],
      zipCode: [''],
      city: [''],
      country: [''],
      activityType: ['testing'],
      latitude: [0],
      longitude: [0],
      PhoneNumber:[null],
      IsTrailOrganization :[false],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      organizationCurrency: ['', Validators.compose([Validators.required])],
    });

    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      Gender: ['', Validators.compose([Validators.required])],
      position: ['', Validators.compose([Validators.required])],
      Address: ['', Validators.compose([Validators.required])],
      zipCode: [''],
      city: [''],
      country: [''],
      PhoneNumber:[null],
      latitude: [0],
      longitude: [0],
      policy:[false],
    });
  }

  getstatuspolicy(){
     return this.userForm.value.policy
  }


  validatePassword(): boolean {
    const password = this.singupForm.get('password')?.value;
    // Add your validation logic here
    const hasNumber = /\d/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return hasNumber && hasAlphabet && hasSpecialChar;
  }


  Showpolicy() {
    this.dialog.open(PolicyComponent, {
     width: '1000px',
     disableClose: true,
     position: { top: '10px' },

   });
 }

 getpasswordmismatch() {
  if (this.singupForm.value.confirmPassword != null) {
    if (
      this.singupForm.value.password === this.singupForm.value.confirmPassword
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
showpassword(value:any) {
  console.log(value);
  if (value == 'on') {
    this.fieldTextType = 'password';
  } else if (value == 'off') {
    this.fieldTextType = 'text';
  }
}

  gotodashboard(){
    this.router.navigate(['/home/dash/Welcome-Page'])
  }

  ngOnInit(): void {
    this.onTimeOut();
    this.route.queryParams.subscribe((params:any) => {
      const paramValue = params['IsTrail'];
      console.log(paramValue);
      this.singupForm.get('IsTrailOrganization')?.setValue(paramValue=='true'?true:false) 
    });
  }

  onTimeOut() {
    if (this.value == 1) {
      this.image = '../../../../assets/images/planning.png';
      this.value = 2;
    } else if (this.value == 2) {
      this.image = '../../../../assets/images/map.png';
      this.value = 3;
    } else if (this.value == 3) {
      this.image = '../../../../assets/images/report.png';
      this.value = 4;
    } else if (this.value == 4) {
      this.image = '../../../../assets/images/setting.png';
      this.value = 5;
    }else if (this.value == 5) {
      this.image = '../../../../assets/images/file.png';
      this.value = 1;
    }
    setTimeout(() => {
      this.onTimeOut();
    }, 4000);
  }

  get f() {
    return this.singupForm.controls;
  }

  get u() {
    return this.userForm.controls;
  }

  cfpassword(e:any) {
    this.cfvalue = e.target.value;
    this.validation();
  }

  validation() {
    if (this.singupForm.controls.password.value !== this.cfvalue) {
      this.cfvalueStatus = true;
    } else {
      this.cfvalueStatus = false;
    }
  }

  clicksingupForm() {
      this.singupFormstatus = false;
      this.userFormsatus = true;
  }

  clickUserForm() {
    if(this.singupForm.value.IsTrailOrganization==true){
      this.Accountregister('')
    }else{
      this.paymentCardPopup()
    }
  }

  backclickUserForm(){
    this.singupFormstatus = true;
    this.userFormsatus = false;
  }
  backpaymentform(){
    this.userFormsatus = true;
    this.singupFormstatus = false;
  }



  closedialogbox() {
    this.dialog.closeAll();
  }


  formatfinaldata(cardtoken:any){
    if(this.singupForm.value.IsTrailOrganization==true){
      const data=   {
        "CompanyName" : this.singupForm.value.companyName,
        "IsTrailOrganization" : this.singupForm.value.IsTrailOrganization ,
        "ActivityType" : this.singupForm.value.activityType,
        "Address" : this.singupForm.value.Address,
        "ZipCode":this.singupForm.value.zipCode,
        "City":this.singupForm.value.city,
        "Country":this.singupForm.value.country,
        'latitude': this.singupForm.value.latitude,
        'longitude': this.singupForm.value.longitude,
        "Password":this.singupForm.value.password,
        "ConfirmPassword":this.singupForm.value.confirmPassword,
        "PhoneNumber":this.singupForm.value.PhoneNumber==null?'0':this.singupForm.value.PhoneNumber.toString(),
        "OrganizationCurrency" : this.singupForm.value.organizationCurrency,
        "UsersViewModel" : {
        "email":this.singupForm.value.email,
        "FirstName":this.userForm.value.firstName,
        "LastName":this.userForm.value.lastName,
        "Gender" :this.userForm.value.Gender,
        "PhoneNumber" :this.userForm.value.PhoneNumber==null?'0':this.userForm.value.PhoneNumber.toString(),
        "Position" : this.userForm.value.position,
        "Address":this.userForm.value.Address,
        "ZipCode":this.userForm.value.zipCode,
        "City":this.userForm.value.city,
        "Country":this.userForm.value.country,
        'latitude': this.userForm.value.latitude,
        'longitude': this.userForm.value.longitude,
        }
        }
      return data
      
    }else{
      const data=   {
        "CompanyName" : this.singupForm.value.companyName,
        "IsTrailOrganization" : this.singupForm.value.IsTrailOrganization ,
        "ActivityType" : this.singupForm.value.activityType,
        "PhoneNumber" : this.singupForm.value.PhoneNumber==null?'0':this.singupForm.value.PhoneNumber.toString(),
        "Address" : this.singupForm.value.Address,
        "ZipCode":this.singupForm.value.zipCode,
        "City":this.singupForm.value.city,
        "Country":this.singupForm.value.country,
        'latitude': this.singupForm.value.latitude.toString(),
        'longitude': this.singupForm.value.longitude.toString(),
        "Password":this.singupForm.value.password,
        "ConfirmPassword":this.singupForm.value.confirmPassword,
        "OrganizationCurrency" : this.singupForm.value.organizationCurrency,
        "UsersViewModel" : {
        "email":this.singupForm.value.email,
        "FirstName":this.userForm.value.firstName,
        "LastName":this.userForm.value.lastName,
        "PhoneNumber":this.userForm.value.PhoneNumber==null?'0':this.userForm.value.PhoneNumber.toString(),
        "Gender" :this.userForm.value.Gender,
        "Position" : this.userForm.value.position,
        "Address":this.userForm.value.Address,
        "ZipCode":this.userForm.value.zipCode,
        "City":this.userForm.value.city,
        "Country":this.userForm.value.country,
        'latitude': this.userForm.value.latitude,
        'longitude': this.userForm.value.longitude,
        },
        token: cardtoken.id,
        cardId: cardtoken.card.id,
        }
      return data
  
    }

  }






  Accountregister(cardtoken:any) {
    const data=this.formatfinaldata(cardtoken)
    // debugger
    this.authService.Accountregister(data).subscribe((result) => {
      if (result) {
        this.dialog.closeAll()
        this.router.navigate(['/mail/VerificationEmailSent']);
      }
    },(error)=>{
      if(error){
        console.log(error)
        if(error.status===500 || error.status===false||error.status===0||error.status===422){
          this.ShowerrorMessagePopup('The server encountered an unexpected condition that prevented it from fulfilling your request. Please try again later or contact our support team for assistance.')
        }else if(error.status===400){
          this.errorMessage=''
          console.log(error.error)
          if(error?.error?.errors?.['Address']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['Address'][0]?.Message
          }
          if(error?.error?.errors?.['City']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['City'][0]?.Message
          }
          if(error?.error?.errors?.['CompanyName']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['CompanyName'][0]?.Message
          }
          if(error?.error?.errors?.['Country']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['Country'][0]?.Message
          }
          if(error?.error?.errors?.['Password']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['Password'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.Address']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.Address'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.City']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.City'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.Country']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.Country'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.Email']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.Email'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.FirstName']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.FirstName'][0]?.Message
          }
          if(error?.error?.errors?.['UsersViewModel.LastName']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.LastName'][0]?.Message
          }  if(error?.error?.errors?.['UsersViewModel.Position']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.Position'][0]?.Message
          }  if(error?.error?.errors?.['UsersViewModel.ZipCode']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['UsersViewModel.ZipCode'][0]?.Message
          }
          if(error?.error?.errors?.['ZipCode']){
            this.errorMessage=this.errorMessage +' ,'+error?.error?.errors?.['ZipCode'][0]?.Message
          }
          this.ShowerrorMessagePopup(this.errorMessage)
        } else if(error.error.response[0].code==='409'){
          this.ShowerrorMessagePopup(error.error.response[0].message)
        }
      }
    });
  }




// company address 
  handleAddressChange(place: object) {
    console.log(place)
    const data = this.googleAddress.getFullAddress(place);
    this.singupForm.get('latitude')?.setValue(data.latitude);
    this.singupForm.get('longitude')?.setValue(data.longitude);

    if (
      data.Address != undefined &&
      data.Address != null &&
      data.Address != 'undefined' &&
      data.Address != 'null'
    ) {
      this.singupForm.get('Address')?.setValue(data.Address);
    } else {
      this.singupForm.get('Address')?.setValue('');
    }
    if (
      data.pincode != undefined &&
      data.pincode != null &&
      data.pincode != 'undefined' &&
      data.pincode != 'null'
    ) {
      this.singupForm.get('zipCode')?.setValue(data.pincode);
    } else {
      this.singupForm.get('zipCode')?.setValue('');
    }
    if (
      data.city != undefined &&
      data.city != null &&
      data.city != 'undefined' &&
      data.city != 'null'
    ) {
      this.singupForm.get('city')?.setValue(data.city);
    } else {
      this.singupForm.get('city')?.setValue('');
    }
    if (
      data.country != undefined &&
      data.country != null &&
      data.country != 'undefined' &&
      data.country != 'null'
    ) {
      this.singupForm.get('country')?.setValue(data.country);
    } else {
      this.singupForm.get('country')?.setValue('');
    }
  }
// user address 
  handleAddressChangeuser(place: object) {
    console.log(place)
    const data = this.googleAddress.getFullAddress(place);
    this.userForm.get('latitude')?.setValue(data.latitude);
    this.userForm.get('longitude')?.setValue(data.longitude);

    if (
      data.Address != undefined &&
      data.Address != null &&
      data.Address != 'undefined' &&
      data.Address != 'null'
    ) {
      this.userForm.get('Address')?.setValue(data.Address);
    } else {
      this.userForm.get('Address')?.setValue('');
    }
    if (
      data.pincode != undefined &&
      data.pincode != null &&
      data.pincode != 'undefined' &&
      data.pincode != 'null'
    ) {
      this.userForm.get('zipCode')?.setValue(data.pincode);
    } else {
      this.userForm.get('zipCode')?.setValue('');
    }
    if (
      data.city != undefined &&
      data.city != null &&
      data.city != 'undefined' &&
      data.city != 'null'
    ) {
      this.userForm.get('city')?.setValue(data.city);
    } else {
      this.userForm.get('city')?.setValue('');
    }
    if (
      data.country != undefined &&
      data.country != null &&
      data.country != 'undefined' &&
      data.country != 'null'
    ) {
      this.userForm.get('country')?.setValue(data.country);
    } else {
      this.userForm.get('country')?.setValue('');
    }
  }


  ApiSuccessMessages(message:any, header:any) {
   const ApiSuccessMessages= this.dialog.open(ApiSuccessMessagesComponent, {
      width: '500px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
    ApiSuccessMessages.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    })
  }

  ShowerrorMessagePopup(message:any) {
    this.dialog.open(MessagePopupComponent, {
      data: { message: message, screenType: 'loginpage' },
      width: '400px'
    })
  }


  paymentCardPopup() {
    const gettokendetails=this.dialog.open(PaymentCardDetailsComponent, {
      width: '400px'
    })
    gettokendetails.afterClosed().subscribe((result: any) => {
      if (result) {
        this.Accountregister(result)
      }
    })
  }

}
