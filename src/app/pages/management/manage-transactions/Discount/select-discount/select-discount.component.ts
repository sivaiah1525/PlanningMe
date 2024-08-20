import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { MessageService } from 'src/app/core/services/message.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-discount',
  templateUrl: './select-discount.component.html',
  styleUrls: ['./select-discount.component.scss']
})
export class SelectDiscountComponent implements OnInit {
  discountDetails: any;
  discountForm: FormGroup
  ManagementData: any;
  ManagenemtEntity: any
  hasPrivateDiscount!:boolean;
  hasPublicDiscount!:boolean;
  isOverride = false;
  errorMessange: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  discountid = 0;
  addbutton = false;
  updatebutton = false;
  selactdropdowndiscountforPrivate: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageContactsService: ManageContactsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private messageService: MessageService,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<SelectDiscountComponent>,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
      
    }else{
      this.translate.use('English');
    }
        this.discountForm = this.fb.group({
      discountBody: this.fb.array([
        this.createDiscounteBody()
      ])
    });
  }

  ngOnInit(): void {
    console.log(this.data)
    if (this.data?.AddDiscount == true) {
      this.addbutton = true
      this.hasPrivateDiscount = this.data.row?.hasPrivateDiscount == true ? false : true
      this.hasPublicDiscount = this.data.row?.hasPublicDiscount == true ? false : true
      this.getAllDiscounts()
      this.ManagementData = this.data.row
      this.ManagenemtEntity = this.data.ManagenemtEntity
    }
    if (this.data?.EditDiscount == true) {
      this.updatebutton = true
      this.hasPrivateDiscount = this.data.discoundata?.isPublic == true ? false : true
      this.hasPublicDiscount = this.data.discoundata?.isPublic == true ? true : false
      this.getAllDiscounts()
      this.ManagementData = this.data.row
      this.ManagenemtEntity = this.data.ManagenemtEntity;
      this.discountid = this.data.discoundata?.id
      this.keywordlist = this.data?.discoundata?.getKeyword?.split(',')
      this.getDiscountBody().at(0).get('name')?.setValue(this.data.discoundata.id);
      this.getDiscountBody().at(0).get('selactdiscountId')?.setValue(this.data.discoundata.id);
      this.getDiscountBody().at(0).get('code')?.setValue(this.data.discoundata.code);
      this.getDiscountBody().at(0).get('amount')?.setValue(this.data.discoundata.amount);
      this.getDiscountBody().at(0).get('startDate')?.setValue(this.data.discoundata.startDate);
      this.getDiscountBody().at(0).get('endDate')?.setValue(this.data.discoundata.endDate);
      this.getDiscountBody().at(0).get('limit')?.setValue(this.data.discoundata.limit);
      this.getDiscountBody().at(0).get('description')?.setValue(this.data.discoundata.description);
    }
  }


  createDiscounteBody(): FormGroup {
    return this.fb.group({
      'name': [''],
      'code': [''],
      'amount': [''],
      'startDate': [''],
      'endDate': [''],
      'limit': [''],
      'keyword': [''],
      'description': [''],
      'selactdiscountId': ['']
    })
  }

  getDiscountBody() {
    return this.discountForm.get('discountBody') as FormArray;
  }

  // Conditions
  addCondition() {
    this.getDiscountBody().push(this.createDiscounteBody())
  }

  getAllDiscounts() {
    this.manageContactsService.FindDiscountsForDropdown(this.hasPrivateDiscount, this.hasPublicDiscount).subscribe((data: any) => {
      console.log(data)
      this.discountDetails = data

    })
  }



  selectDiscount(list:any, i: number) {
    this.selactdropdowndiscountforPrivate = list?.isPublic == true ? false : true
    this.manageContactsService.getDiscountbtId(list.id).subscribe((result: any) => {
      console.log(result)
      if (result) {
        this.keywordlist = result.keywords
        this.getDiscountBody().at(i).get('selactdiscountId')?.setValue(result.id);
        this.getDiscountBody().at(i).get('code')?.setValue(result.code);
        this.getDiscountBody().at(i).get('amount')?.setValue(result.amount);
        this.getDiscountBody().at(i).get('startDate')?.setValue(result.startDate);
        this.getDiscountBody().at(i).get('endDate')?.setValue(result.endDate);
        this.getDiscountBody().at(i).get('limit')?.setValue(result.limit);
        this.getDiscountBody().at(i).get('description')?.setValue(result.description);
      }
    })

  }

  Discountcreate(templateRef: TemplateRef<any>) {
    const template = templateRef

    this.discountForm.value.discountBody.forEach((e:any) => {
      var data = {
        entityId: this.ManagementData.id,
        entity: this.ManagenemtEntity,
        discountId: e.selactdiscountId,
        isOverride: this.isOverride
      }
      this.manageContactsService.AddDiscountToManagement(data).subscribe((data: any) => {
        if (data) {
          if (data.response[0].code == '102') {
            this.isOverride = true
            this.errorMessange = data.response[0].message
            this.ConfirmationAddDiscountDialog(template)
          } else {
            this.matDialogRef.close(data)
            this.messageService.showMessage(data['response'][0].message);
          }
        }
      })
    })
  }
  ConfirmationAddDiscountDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '500px',
      disableClose: true,
    });
  }
  ConfirmationAddDiscount(templateRef: TemplateRef<any>) {
    const template = templateRef
    this.Discountcreate(template)
  }



  UpdatediscountFormanagement() {
    this.discountForm.value.discountBody.forEach((e:any) => {
      var data = {
        entityId: this.ManagementData.id,
        entity: this.ManagenemtEntity,
        discountId: e.selactdiscountId,
        isOverride: this.isOverride,
        IsPublic: this.selactdropdowndiscountforPrivate == true ? false : true
      }
      this.manageContactsService.UpdateDiscountToManagement(data).subscribe((data: any) => {
        if (data) {
          this.matDialogRef.close(data)
          this.messageService.showMessage(data['response'][0].message);
        }

      }, (err) => { window.alert(err.error.response[0].message) })
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
