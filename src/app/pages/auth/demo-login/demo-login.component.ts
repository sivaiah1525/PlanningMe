import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DelegationService } from 'src/app/core/services/delegation.service';
import { error } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../../commonForAll/message-popup/message-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeZoneComponent } from '../time-zone/time-zone.component';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { TranslateService } from '@ngx-translate/core';
import { CookiesComponent } from 'src/app/core/components/cookies/cookies.component';
import { GlobalTranslationService } from 'src/app/core/services/global-translation.service';
@Component({
  selector: 'app-demo-login',
  templateUrl: './demo-login.component.html',
  styleUrls: ['./demo-login.component.scss']
})
export class DemoLoginComponent implements OnInit {
  loginForm!: FormGroup;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinnerloding = false;
  fieldTextType = 'password'
  Height: Window["innerHeight"];
  imagecount = 1
  image = '../../../../assets/images/management.png'
  backgroundImages = [
    '../../../../assets/images/management.png',
    '../../../../assets/images/planning.png',
    '../../../../assets/images/map.png',
    '../../../../assets/images/report.png',
    '../../../../assets/images/setting.png',
    '../../../../assets/images/file.png',
  ];
  logindetails: any;
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
  ) {
    this.Height = window.innerHeight;
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    }
  ngOnInit(): void {
    this.calculateTimeDifference();
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    setInterval(() => {
      this.onTimeOut()
    }, 4000);
    this.getTrialUsers()

  }

  calculateTimeDifference() {
    const storedDate:any= localStorage.getItem('CookiesDate');
    console.log(storedDate);
    const date1 = new Date(storedDate); // First date and time
    const date2 = new Date(); // Second date and time
    console.log(date1);
    console.log(date2);
    const timeDifference = date2.getTime() - date1.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursDifference > 24) {
      this.ShowCookiesPopup();
      this.matoService.trackPageView('Demo-Login-page');
      console.log(hoursDifference);
    } else {
      this.matoService.trackPageView('Demo-Login-page');
      console.log(hoursDifference);
    }
  }



  ShowCookiesPopup() {
    const Cookies=this.dialog.open(CookiesComponent, {
      width: '100%',
      position: { bottom: '0' },
      disableClose: true,
    });
    Cookies.afterClosed().subscribe(result => {
      this.matoService.trackPageView('Demo-Login-page');
    });
  }
























  gotodashboard(){
    this.router.navigate(['/home/Welcome-Page'])
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
  }


  onSubmit(value:any) {
    this.loginForm.get('username')?.setValue(value.userName)
    this.loginForm.get('password')?.setValue(value.password)
    this.spinnerloding = true
    this.authService.authenticateService(this.loginForm.value).subscribe((data: any) => {
      this.spinnerloding = false;
      localStorage.setItem("DemoOrganation", 'true');
      localStorage.setItem("access_token", data['accessToken']);
      localStorage.setItem("id", data['user']['id']);
      localStorage.setItem("userName", data.user.firstName + '' + data.user.lastName);
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
      this.gettimegone(data)
    }, (error: HttpErrorResponse) => {
      this.spinnerloding = false
      if (error.status == 400) {
        let message = 'Invalid password or username. Please try again.'
        this.ShowMessagePopup(message)
      } else if((error.status == 500)){
        let message = 'We apologize for the inconvenience, but were experiencing technical difficulties. Please try again later.'
        this.ShowMessagePopup(message)
      }else{
        let message = 'There is a network issue. Please check your internet connection and try again later.'
        this.ShowMessagePopup(message)
      }
    });
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



  getTrialUsers() {
    this.spinnerloding = true
    this.authService.FindTrialUsers().subscribe((reullt: any) => {
      if (reullt) {
        this.logindetails = reullt
        this.spinnerloding = false
      }
      console.log(reullt)
    })
  }
}
