import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-other-user-password-set',
  templateUrl: './other-user-password-set.component.html',
  styleUrls: ['./other-user-password-set.component.scss'],
})
export class OtherUserPasswordSetComponent implements OnInit {
  apistatus = 'going';
  loginForm: FormGroup;
  fieldTextType = 'password';
  showcard = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader = false;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.loginForm = this.formBuilder.group({
      Code: [null],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      UserId: [null],
    });
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params?.['UserId']) {
        this.loginForm.get('UserId')?.setValue(params?.['UserId']);
      }
      if(params?.['Code']){
        this.loginForm.get('Code')?.setValue(params?.['Code']);
      }
    });
  }
  
  validatePassword(): boolean {
    const password = this.loginForm.get('password')?.value;
    // Add your validation logic here
    const hasNumber = /\d/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return hasNumber && hasAlphabet && hasSpecialChar;
  }
  getpasswordmismatch() {
    if (this.loginForm?.value.confirmPassword != null) {
      if (
        this.loginForm?.value.password === this.loginForm?.value.confirmPassword
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
  backtologin() {
    localStorage.setItem('DemoOrganation', 'false');
    this.router.navigate(['/app/login'], { queryParams: { IsTrail: 'false' } });
  }

  onSubmit() {
    console.log(this.loginForm?.value)
    if (this.loginForm?.value.Code != null) {
      if (this.loginForm?.value.UserId != null) {
        this.authService.ResetPassword(this.loginForm?.value).subscribe((result) => {
            if (result) {
              this.messageService.showMessage(result['response'][0].message);
              console.log(result);
              setTimeout(() => {
                this.backtologin();
              }, 100);
            }
          },error=>{
            this.messageService.showMessage(error['response'][0].message);
          });
      }
    } else {
      if (this.loginForm?.value.UserId != null) {
        this.loginForm.removeControl('Code')
        this.authService.setPassword(this.loginForm?.value).subscribe((result) => {
            if (result) {
              console.log(result);
              this.messageService.showMessage(result['response'][0].message);
              setTimeout(() => {
                this.backtologin();
              }, 100);
            }
          },error=>{
            this.messageService.showMessage(error['response'][0].message);
          });
      }
    }
  }

}
