import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DelegationService } from 'src/app/core/services/delegation.service';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../../commonForAll/message-popup/message-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeZoneComponent } from '../time-zone/time-zone.component';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalTranslationService } from 'src/app/core/services/global-translation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinnerloding = false;
  fieldTextType = 'password'
  Height: Window["innerHeight"];
  imagecount = 1
  image = '../../../../assets/images/management.png'
  currentImageIndex = 0;
  IsTrailOrganization=false
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public spinner: SpinnerService,
    private delegationService: DelegationService,
    private dialog: MatDialog,
    private matoService: MatomoService,
    private translate: TranslateService,
    private globaltranslate: GlobalTranslationService,
    private route: ActivatedRoute,
    @Inject('UserService') private userService: any
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
      this.matoService.trackPageView('login-page');
    this.Height = window.innerHeight
  } 

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.onTimeOut()
    this.route.queryParams.subscribe(params => {
      const paramValue = params['IsTrail'];
      console.log(paramValue)
      if(paramValue){
        this.IsTrailOrganization=paramValue=='true'?true:false
      }else{
      this.IsTrailOrganization=false
      }
    });
  }
  gotodashboard(){
    this.router.navigate(['/home/dash/Welcome-Page'])
  }
  onTimeOut() {
    if (this.imagecount == 1) {
      this.image = '../../../../assets/images/planning.png';
      this.imagecount = 2;
    } else if (this.imagecount == 2) {
      this.image = '../../../../assets/images/map.png';
      this.imagecount = 3;
    } else if (this.imagecount == 3) {
      this.image = '../../../../assets/images/report.png';
      this.imagecount = 4;
    } else if (this.imagecount == 4) {
      this.image = '../../../../assets/images/setting.png';
      this.imagecount = 5;
    }else if (this.imagecount == 5) {
      this.image = '../../../../assets/images/file.png';
      this.imagecount = 1;
    }
    setTimeout(() => {
      this.onTimeOut()
    }, 4000);
  }


  ForgotPassword(){
    this.router.navigate(['/mail/SuccessPageForForgotPassword'])
  }


  onSubmit() {
    this.spinnerloding = true
    this.authService.authenticateService(this.loginForm.value).subscribe((data: any) => {
      this.spinnerloding = false;
      if(data?.accessToken){
        localStorage.setItem("DemoOrganation", 'false');
        localStorage.setItem("isTrailVersion", data.user.isTrailVersion);
        localStorage.setItem("access_token", data['accessToken']);
        localStorage.setItem("id", data['user']['id']);
        localStorage.setItem("userName", data.user.firstName + '' + data.user.lastName);
        localStorage.setItem("usermailId", data.user.userName);
        localStorage.setItem("orgId", data['user']['organizationId']);
        this.authService.setUserData(data['user'])
        this.authService.details.emit(data['user']['id']);
        localStorage.setItem("AdminUserId", data.user.id);
        localStorage.setItem("timeZone", data.user.timeZone);
        if (data.user.isAdmin == true) {
          localStorage.setItem("isAdmin", 'true');
          localStorage.setItem("Invoice", 'true');
        } else {
          this.getDelegation()
        }
        if (data.user.isManager == true) {
          localStorage.setItem("isManager", 'true');
        } else {
          localStorage.setItem("isManager", 'false');
        }
        this.router.navigate(['/app/home/calendar'])
        setTimeout(() => {
          this.gettimegone(data)
        }, 1000);
      }else if(data?.response[0]?.code==='401'){
        this.ShowMessagePopup(data.response[0].message)
      }
    }, (error: HttpErrorResponse) => {
      this.spinnerloding = false
      console.log(error)
      if (error.status == 400) {
        let message = 'Invalid password or username. Please try again.'
        this.ShowMessagePopup(message)
      } else if((error.status === 500||error.status === 0)){
        let message = 'We apologize for the inconvenience, but were experiencing technical difficulties. Please try again later.'
        this.ShowMessagePopup(message)
      }else{
        let message = 'There is a network issue. Please check your internet connection and try again later.'
        this.ShowMessagePopup(message)
      }
    });
  }


  locationchange(value:any) {
      this.router.navigate(['/app/singup'],{ queryParams: { IsTrail : value } });
    }


  gettimegone(data:any) {
    this.authService.GetTimeZone().subscribe((result: any) => {
      console.log(result)
      if (result) {
        const currenttimezone = result.timeZone
        console.log(currenttimezone)
        if (data?.user?.timeZone != currenttimezone) {
          this.dialog.open(TimeZoneComponent, {
            width: '500px',
            data: { TimeZone: currenttimezone, TimeZone2:data?.user?.timeZone,flagUrl1:data?.user?.flagUrl,flagUrl2:result.flagUrl}
          })
        }
      }
    })
  }


  ShowMessagePopup(message:any) {
    this.dialog.open(MessagePopupComponent, {
      data: { message: message, screenType: 'loginpage' },
      width: '400px'
    }) 
  }

  showpassword(value:any) {
    console.log(value)
    if (value == 'on') {
      this.fieldTextType = 'password'
    } else if (value == 'off') {
      this.fieldTextType = 'text'

    }
  }
  getDelegation() {
    let Admin = false
    let invoice = false
    this.delegationService.getDelegation().subscribe((res: any) => {
      if (res.length != 0) {
        res.forEach((e:any) => {
          if (e.rightsName == 'Admin') {
            Admin = true
          }
          else if (e.rightsName == 'Invoice') {
            invoice = true
          }
        })
      }
      setTimeout(() => {
        if (Admin == true) {
          localStorage.setItem("isAdmin", 'true');
        } else {
          localStorage.setItem("isAdmin", 'false');
        }
        if (invoice == true) {
          localStorage.setItem("Invoice", 'true');
        } else {
          localStorage.setItem("Invoice", 'false');
        }
      },);
    });
  }
}
