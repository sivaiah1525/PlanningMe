import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-addtag-common',
  templateUrl: './addtag-common.component.html',
  styleUrls: ['./addtag-common.component.scss']
})
export class AddtagCommonComponent implements OnInit {
  selectedradioval: any;
  selectednumeralval: any;
  productForm: FormGroup;
  viewtagmodel :any= {};
  showfreefeild!: boolean;
  tagViewModels:any = [];
  showcheckbox!: boolean;
  dropdownValues = [1, 2, 3, 4, 5]
  tags: any;
  tagType: any
  selectedvalue: any;
  value!: number;
  i = 1;
  dropdownValue :any= []


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddtagCommonComponent>,
    private manageProductsService: ManageProductsService,
    private messageService: MessageService,
  ) {
    this.productForm = this.formBuilder.group({
      TagViewModels: [[]],
      tagType: [''],
      title: [''],
      tagdropdown: [''],
      ischecked: [''],
      numeralType: [''],
      freefeildTitle: ['', Validators.pattern('^[a-zA-Z \-\']+')],
      freefeildnumber: [''],
      feildname: [''],
      fieldvalue: [],
      dropdownValue: [''],
      freefeildvalue: [''],
      dropdowntype: [''],
      dropdown: [''],
      isMandatory:[false],
      Adddropdownvalue: this.formBuilder.array([
        this.createBody()
      ])
    });
  }

  createBody(): FormGroup {
    return this.formBuilder.group({
      dropdownvalue: ['']
    })
  }
  addcreateBody() {
    this.getfileBody().push(this.createBody())
  }

  removeConditionalBody(i: number) {
    this.getfileBody().removeAt(i);
  }
  getfileBody() {
    return this.productForm.get('Adddropdownvalue') as FormArray;
  }
  ngOnInit(): void {
    this.tagType = this.data
  }

  close() {
    this.dialogRef.close(true)
  }
  checkChanges() {
    this.productForm.get('numeralType')?.valueChanges.subscribe(val => {
      this.selectednumeralval = val;
    });
  }
  getdropdown(i:number) {
    this.selectedvalue = i;
  }
  onChanges() {
    this.productForm.get('tagType')?.valueChanges.subscribe(val => {
      this.selectedradioval = val;
    });
  }

  applytag() {
    if (this.tagType == 'TransactionsfororderScreen') {
      this.dialogRef.close(this.productForm.value)
    } else {
      if (this.productForm.value.Adddropdownvalue.length != 0) {
        this.productForm.value.Adddropdownvalue.forEach((element:any) => {
          this.dropdownValue.push(element.dropdownvalue)
        })
      }

      this.tagViewModels = [];
      if (this.selectedradioval == 'Checkbox') {
        this.viewtagmodel['fieldName'] = this.productForm.value.title;
        this.viewtagmodel['isMandatory'] = this.productForm.value.isMandatory;
        this.viewtagmodel['fieldType'] = 'Bool';
        this.viewtagmodel['fieldValue'] = '';
        this.viewtagmodel['dropdownValues'] = '';
        this.tagViewModels.push(this.viewtagmodel);
      }
      else if (this.selectedradioval == 'Freefeild') {
        if (this.selectednumeralval == 'Numerals') {
          this.viewtagmodel['fieldName'] = this.productForm.value.title;
          this.viewtagmodel['isMandatory'] = this.productForm.value.isMandatory;
          this.viewtagmodel['fieldType'] = 'Number';
          this.viewtagmodel['fieldValue'] = '';
          this.viewtagmodel['dropdownValues'] = '';
          this.tagViewModels.push(this.viewtagmodel);
        } else {
          this.viewtagmodel['fieldName'] = this.productForm.value.title;
          this.viewtagmodel['isMandatory'] = this.productForm.value.isMandatory;
          this.viewtagmodel['fieldType'] = 'Text';
          this.viewtagmodel['fieldValue'] = '';
          this.viewtagmodel['dropdownValues'] = '';
          this.tagViewModels.push(this.viewtagmodel);
        }

      } else if (this.selectedradioval == 'Dropdown') {
        this.viewtagmodel['fieldName'] = this.productForm.value.title;
        this.viewtagmodel['isMandatory'] = this.productForm.value.isMandatory;
        this.viewtagmodel['fieldType'] = 'Dropdown';
        this.viewtagmodel['fieldValue'] = '';
        this.viewtagmodel['dropdownValues'] = this.dropdownValue.toString();
        this.tagViewModels.push(this.viewtagmodel);
      }
      this.manageProductsService.createtag(this.tagViewModels, this.tagType).subscribe(
        (data) => {
          this.messageService.showMessage(data['response'][0].message);
          this.tagViewModels = [];
          this.dialogRef.close(true)
        });
    }


  }


}
