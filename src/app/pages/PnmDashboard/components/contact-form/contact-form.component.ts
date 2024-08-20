import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;

  constructor(
    private router: Router, 
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }      this.contactForm = this.formBuilder.group({
        FirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        LastName: ['', [Validators.minLength(3), Validators.maxLength(20)]],
        Raisonsociale: ['',Validators.required],
        CodePostal: ['',Validators.required],
        Téléphone: [''],
        Comments: [''],
        Email: ['', [Validators.email]],
      });
    }

  
    
  ngOnInit(): void {
  }

clocepopup(){
  this.dialog.closeAll()
}

  get f() {
    return this.contactForm.controls;
  }



  onSubmit(){
    
  }
}
