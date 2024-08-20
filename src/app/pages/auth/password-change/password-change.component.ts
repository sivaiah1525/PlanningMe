import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MessagePopupComponent } from '../../commonForAll/message-popup/message-popup.component';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  loginForm: FormGroup;
  fieldTextType = 'password'

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private matDialogRef: MatDialogRef<PasswordChangeComponent>,
    private messageService: MessageService,
    private dialog: MatDialog,

  ) { 

    this.loginForm = this.formBuilder.group({
      existPassword: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
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

  getpasswordmismatch(){
    if(this.loginForm.value.confirmPassword!=null){
    if(this.loginForm.value.password===this.loginForm.value.confirmPassword){
      return false
    }else{ 
     return true
    }
    }else{
      return false
    }
  }

  ngOnInit(): void {
  }



  updatepassword(){
    this.authService.UpdatePassword(this.loginForm.value).subscribe((result)=>{
      if(result){
        console.log(result)
        this.messageService.showMessage(result['response'][0].message);
        this.matDialogRef.close()
      }
    },error=>{
      if(error){
        console.log(error)
        if(error.status==400){ 
          this.ShowMessagePopup(error.error.response[0].message)
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

}
