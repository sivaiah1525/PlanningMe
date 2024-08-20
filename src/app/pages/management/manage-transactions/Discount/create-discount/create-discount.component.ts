import { Component, OnInit, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent implements OnInit {
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  discountForm: FormGroup;
  todaydate = new Date()
  possible = "ABCD286EFGH475674838475IJKLMN385TUVW38756748XYZ1234567890578934SkSDJ296FHGFHERUT95876584GH475674838475IJKLMN385TUZ1234567890578934SkSDJ296FHGFHE";
  DiscountCode = ''
  DiscountData: any;
  discountCreateScreen = false;
  discountUpdateScreen = false;
  Responsemessage = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manageContactsService: ManageContactsService,
    private messageService: MessageService,
    private matDialogRef: MatDialogRef<CreateDiscountComponent>,
    public datepipe: DatePipe,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
        this.discountForm = this.fb.group({
      'id': [],
      'name': ['', [Validators.required]],
      'code': ['', [Validators.required]],
      'amount': ['', [Validators.required]],
      'startDate': ['', [Validators.required]],
      'endDate': [],
      'limit': [''],
      'description': [''],
      'keyword': [''],
      'isActive': [true],
      'isPercentage': [true],
      'isPublic': [false]

    });
  }

  ngOnInit(): void {
    this.discountForm.get('startDate')?.setValue(this.todaydate)
    console.log(this.data)
    if (this.data.Create == true) {
      this.discountCreateScreen = true;
      this.makeRandom(10, this.possible);
      this.discountForm.get('code')?.setValue(this.DiscountCode)
    } else if (this.data.Edit == true) {
      this.discountForm.get('id')?.setValue(this.data.data.id)
      this.discountUpdateScreen = true
      this.DiscountData = this.data.data;
      this.DiscountCode = this.data.data.code
      this.discountForm.get('name')?.setValue(this.data?.data?.name)
      this.discountForm.get('code')?.setValue(this.data?.data?.code)
      this.discountForm.get('amount')?.setValue(this.data?.data?.amount)
      this.discountForm.get('limit')?.setValue(this.data?.data?.limit)
      this.discountForm.get('startDate')?.setValue(this.data?.data?.startDate)
      this.discountForm.get('endDate')?.setValue(this.data?.data?.endDate)
      this.discountForm.get('description')?.setValue(this.data?.data?.description)
      this.discountForm.get('isPublic')?.setValue(this.data?.data?.isPublic == true)
      if (this.data?.data?.getKeyword != null) {
        this.keywordlist = this.data?.data?.getKeyword.split(',')
      }
      console.log(this.data.data)
    }
  }


  getisPrivateStatus(event:any) {
    if (event) {
      this.discountForm.get('isPublic')?.setValue(true)
    } else {
      this.discountForm.get('isPublic')?.setValue(false)
    }
    console.log(event)
  }


  genrattingNewCode() {
    this.DiscountCode = '';
    this.makeRandom(10, this.possible);

  }
  makeRandom(lengthOfCode: number, possible: string) {
    for (let i = 0; i < lengthOfCode; i++) {
      this.DiscountCode = this.DiscountCode + possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }



  // Create Discount 
  Discountcreate() {
    console.log(this.discountForm.value)
    const data = {
      "code": this.discountForm.value.code,
      "name": this.discountForm.value.name,
      "description": this.discountForm.value.description,
      "isPercentage": true,
      "amount": this.discountForm.value.amount,
      "startDate": this.datepipe.transform(this.discountForm.value.startDate, 'dd-MMM-yyyy'),
      "endDate": this.datepipe.transform(this.discountForm.value.endDate, 'dd-MMM-yyyy'),
      "limit": this.discountForm.value.limit,
      "isActive": this.discountForm.value.isActive,
      "keyword": this.keywordlist.toString(),
      "isPublic": this.discountForm.value.isPublic
    }
    this.manageContactsService.createDiscount(data).subscribe((data: any) => {
      if (data) {
        this.messageService.showMessage(data['response'][0].message);
        this.matDialogRef.close(true)
      }
    }, (error) => {
      this.Responsemessage = ''
      error.error[Object.keys(error.error)[0]].forEach((e:any) => {
        this.Responsemessage += ',' + e
      })
      window.alert(this.Responsemessage)
    });
  }


  // Update Discount 
  DiscountUpdate() {
    console.log(this.discountForm.value)

    const data = {
      "id": this.discountForm.value.id,
      "code": this.discountForm.value.code,
      "name": this.discountForm.value.name,
      "description": this.discountForm.value.description,
      "isPercentage": true,
      "amount": this.discountForm.value.amount,
      "startDate": this.datepipe.transform(this.discountForm.value.startDate, 'dd-MMM-yyyy'),
      "endDate": this.datepipe.transform(this.discountForm.value.endDate, 'dd-MMM-yyyy'),
      "limit": this.discountForm.value.limit,
      "isActive": this.discountForm.value.isActive,
      "keyword": this.keywordlist.toString(),
      "isPublic": this.discountForm.value.isPublic
    }
    console.log(data)
    this.manageContactsService.updateDiscount(data).subscribe((result:any) => {
      if (result) {
        this.messageService.showMessage(result['response'][0].message);
        this.matDialogRef.close(true)
      }
    }, (error) => {
      this.Responsemessage = ''
      error.error[Object.keys(error.error)[0]].forEach((e:any) => {
        this.Responsemessage += ',' + e
      })
      window.alert(this.Responsemessage)
    })
  }







  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    console.log(event.value)
    const value = (event.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    event.input.value = ''
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
  }

}
