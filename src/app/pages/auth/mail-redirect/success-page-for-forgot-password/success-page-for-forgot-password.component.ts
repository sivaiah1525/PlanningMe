import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiSuccessMessagesComponent } from 'src/app/api-success-messages/api-success-messages.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';
@Component({
  selector: 'app-success-page-for-forgot-password',
  templateUrl: './success-page-for-forgot-password.component.html',
  styleUrls: ['./success-page-for-forgot-password.component.scss'],
})
export class SuccessPageForForgotPasswordComponent implements OnInit {
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
    private dialog: MatDialog,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.loginForm = this.formBuilder.group({
      email:['', Validators.required]
    });
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }
  ngOnInit(): void {

  }

  backtologin(){
    localStorage.setItem("DemoOrganation", 'false');
      this.router.navigate(['/app/login'],{ queryParams: { IsTrail :'false'} });
  }




  onSubmit() {
    this.authService.ForgotPassword(this.loginForm.value).subscribe((result)=>{
  if(result){
    this.ApiSuccessMessages(result['response'][0].message,'Success',)
  }
   },error=>{
    console.log(error)
  this.messageService.showMessage(error['response'][0].message);
   })
    
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
        this.backtologin()
      }
     })
   }
}
