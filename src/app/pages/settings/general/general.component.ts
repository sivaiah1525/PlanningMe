import { Component, OnInit, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { error } from 'console';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { PasswordChangeComponent } from '../../auth/password-change/password-change.component';
import { NitificationsRightsComponent } from '../nitifications-rights/nitifications-rights.component';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  animations: [
    trigger('pnmAnimate', [
      transition(':enter', [
        query('.row', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class GeneralComponent implements OnInit {
  @ViewChild("placesRef", { static: false }) placesRef!: GooglePlaceDirective;
  @HostBinding('@pnmAnimate')
  public animatePage = true;
  form: FormGroup;
  password=''
  user!: User;
  isEdit!: boolean;
  imageArray :any= [];
  imageSrc!: string;
  ShowLock:boolean=true
  options = {
    types: ['geocode'],
    componentRestrictions: {}
  }
  APIKEY1 = "k1j3l4h6j7h_78ndjdgjj7h_78ndjdgjk1j3l4h6j7hk1j3l4h6j7h_78ndjdgjj7h_78ndjdgjk1j3l4h6j7hk1j3l4h6j7h_78ndjdgjj7h_78ndjdgjk1j3l4h6j7h"
  APIKEY="**********************************************************************"
  listofcountry = []
  listofcountry$ = []
  constructor(
    private formBuilder: FormBuilder,
    private manageUserService: ManageUsersService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private authService: AuthService,
    private googleAddress: GoogleValidationAddressService,
    private snackBar: MatSnackBar,
    private calendarService: CalendarService,
    public OrgSrvice:CheckOrganationTypeService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }      
    console.log(this.OrgSrvice.checkOrganationType())
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fonction: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      zipCode: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      city: ['', Validators.required],
      country: ['France', Validators.required],
      phoneNumber: ['', Validators.required],
      ProfilePicture: [''],
      timezone: ['']
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      console.log(user);
      this.user = user;
      this.form.get('firstName')?.setValue(user?.firstName);
      this.form.get('lastName')?.setValue(user?.lastName);
      this.form.get('fonction')?.setValue(user?.position);
      this.form.get('password')?.setValue(user?.password);
      this.form.get('email')?.setValue(user?.email);
      this.form.get('address')?.setValue(user?.address);
      this.form.get('zipCode')?.setValue(user?.zipCode);
      this.form.get('latitude')?.setValue(user?.latitude == null ? 0 : user?.latitude);
      this.form.get('longitude')?.setValue(user?.longitude == null ? 0 : user?.longitude);
      this.form.get('city')?.setValue(user?.city);
      this.form.get('country')?.setValue(user?.country);
      this.form.get('phoneNumber')?.setValue(user?.phoneNumber);
      this.form.get('ProfilePicture')?.setValue(user?.profilePicture);
      this.form.get('timezone')?.setValue(user?.timeZone);
    });
    this.getAllcountryList()
  }



  ShowApiKeyWithPassword(templateRef: TemplateRef<any>){
    if(this.ShowLock){
    this.dialog.open(templateRef, {
      width: '400px',
    })
  }

}

PasswordCheck(){
const data={
  username: localStorage.getItem("usermailId"),
  password: this.password
}
this.authService.FindApiKeyByUserCredentials(data).subscribe((result)=>{
  if(result){
    this.ShowLock=!this.ShowLock
    this.APIKEY=result
    this.dialog.closeAll()
  }
},(error)=>{
  if(error){
    if(error.status==200){
      this.ShowLock=!this.ShowLock
      this.APIKEY=error.error.text
      this.dialog.closeAll()
    }
  }
})

}

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0'; 
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copy done', '', { duration: 2000, });
  }



  editProfile() {
    this.form.patchValue({})
  }

  onSubmit() {
    console.log(this.form.value);
    const updatedUser = this.createUserUpdateObject(this.form.value);
    console.log(updatedUser);
    //
  }

  createUserUpdateObject(newValues: User): User {
    let user = this.user;
    user.firstName = newValues.firstName;
    user.lastName = newValues.lastName;
    user.fonction = newValues.fonction;
    user.email = newValues.email;
    user.password = newValues.password;
    user.address = newValues.address;
    user.zipCode = newValues.zipCode;
    user.city = newValues.city;
    user.country = newValues.country;
    user.phoneNumber = newValues.phoneNumber;
    return user;
  }



  onFileChange(event:any,templateRef: TemplateRef<any>) {
    this.imageArray = [];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.form.get('ProfilePicture')?.setValue(file, { emitModelToViewChange: false })
      this.imageArray.push(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.form.patchValue({
          fileSource: reader.result
        });
      };
    }
    this.dialog.open(templateRef, {
      width: '400px',
    }) 
   }

  uploadpicture() {
    const formData = new FormData();
    console.log(this.imageArray[0]);
    formData.append('file', this.imageArray[0]);
    this.authService.updateCurrentUser(formData).subscribe((data:any) => {
      setTimeout(() => {
        this.messageService.showMessage(data['response'][0].message);
        this.ngOnInit();
        window.location.reload();
      }, 2000);
    })
  }


  deleteprofilepic(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);

  }
  closedialogbox() {
    this.dialog.closeAll();
  }

  handleAddressChange(place: object) {
    const data = this.googleAddress.getFullAddress(place)
    this.form.get('latitude')?.setValue(data?.latitude);
    this.form.get('longitude')?.setValue(data?.longitude);
    this.manageUserService.GetTimeZoneFromLocation(data?.latitude, data?.longitude).subscribe((result: any) => {
      console.log(result.error)
      if (result) {
        this.form.get('timezone')?.setValue(result.timeZone);
      }
    }, (error) => {
      if (error.error.text) {
        this.form.get('timezone')?.setValue(error.error.text);

      }
    })
    if (data.Address != undefined && data.Address != null && data.Address != 'undefined' && data.Address != 'null') {
      this.form.get('address')?.setValue(data.Address);
    } else {
      this.form.get('address')?.setValue('');
    }
    if (data.pincode != undefined && data.pincode != null && data.pincode != 'undefined' && data.pincode != 'null') {
      this.form.get('zipCode')?.setValue(data.pincode);
    } else {
      this.form.get('zipCode')?.setValue('');
    }
    if (data.city != undefined && data.city != null && data.city != 'undefined' && data.city != 'null') {
      this.form.get('city')?.setValue(data.city);
    } else {
      this.form.get('city')?.setValue('');
    }
    if (data.country != undefined && data.country != null && data.country != 'undefined' && data.country != 'null') {
      this.form.get('country')?.setValue(data.country);
    } else {
      this.form.get('country')?.setValue('');
    }
  }
  selactcountry(value:any) {
    this.options = { types: ['geocode'], componentRestrictions: { country: value } }
    setTimeout(() => {
      this.placesRef.reset();
    }, 100);
  }

  filterCountry(event:any) {
    const filterValue = event.toLowerCase();
    this.listofcountry$ = this.listofcountry.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }

  getAllcountryList() {
    this.calendarService.getAllcountryList().subscribe((res: any) => {
      if (res) {
        this.listofcountry = res
        this.listofcountry$ = this.listofcountry
      }
    });
  }


  updateuser() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage('This button allows to Update Profile Details','Update Profile')
    } else {
    const formData = new FormData();
    formData.append('id', this.user.id);
    formData.append('FirstName', this.form.get('firstName')?.value);
    formData.append('LastName', this.form.get('lastName')?.value);
    formData.append('Gender', this.user.gender);
    formData.append('Position', this.form.get('fonction')?.value);
    formData.append('Email', this.form.get('email')?.value);
    formData.append('Address', this.form.get('address')?.value);
    formData.append('ZipCode', this.form.get('zipCode')?.value);
    formData.append('City', this.form.get('city')?.value);
    formData.append('Country', this.form.get('country')?.value);
    const managerId:any=this.user.managerId
    formData.append('ManagerId', managerId);
    formData.append('PhoneNumber', this.form.get('phoneNumber')?.value);
    formData.append('longitude', this.form.get('longitude')?.value);
    formData.append('latitude', this.form.get('latitude')?.value);
    formData.append('Profile', this.form.get('ProfilePicture')?.value);
    formData.append('timezone', this.form.get('timezone')?.value);
    formData.append('isActive', 'true');
    this.manageUserService.updateUserService(formData).subscribe((data: any) => {
      if (data) {
        // this.UpdateUserTimeZone()
        this.messageService.showMessage(data['response'][0].message);
        this.ngOnInit()
      }
    });
  }
  }


  updatePassword(){
    this.dialog.open(PasswordChangeComponent, {
      width: '500px',
      // data: { message: message, header: header },
      autoFocus: false,
      disableClose: true
    });
  }
    

  
  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true
    });
  }

  shownotifications(){
    this.dialog.open(NitificationsRightsComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
  }
}
