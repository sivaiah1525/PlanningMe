import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact } from 'src/app/core/models/contact.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { ManageContactsService } from '../../../../core/services/manage-contacts.service';
import { ContactGroup } from 'src/app/core/models/contact-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-contact-group',
  templateUrl: './edit-contact-group.component.html',
  styleUrls: ['./edit-contact-group.component.scss']
})
export class EditContactGroupComponent implements OnInit {

  editContactForm!: FormGroup;
  contactIds: any[] = [];
  contacts: Contact[] = [];
  id: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  contactdata: any;
  contactgroup: any;
  contacts$!: Observable<Contact[]>;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    private matDialogRef: MatDialogRef<EditContactGroupComponent>,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private manageContactService: ManageContactsService,
    public spinner: SpinnerService,
    private manageContactsService: ManageContactsService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
  }

  ngOnInit(): void {
    console.log(this.data, 'data')
    this.contactdata = this.data;
    this.contactIds = [];
    this.editContactForm = this.formBuilder.group({
      'id': [''],
      'contactGroupName': [''],
      'description': [''],
      'contactsId': [''],
      'keywords': [''],
    });
    this.loadFormData();
    this.contacts$ = this.manageContactsService.findAllContactsDropdown();
  }

  onChange(users:any) {
    var index = this.contactIds.indexOf(users.id);
    if (index === -1) {
      this.contacts.push(users);
      this.contactIds.push(users.id);
    }
    else {
      // val is found, removing from array
      this.contacts.splice(index, 1);
      this.contactIds.splice(index, 1);
    }
  }

  loadFormData() {
    if (this.contactdata?.getKeyword) {
      this.contactdata?.getKeyword.forEach((e:any) => {
        this.keywordlist.push(e)
      })
    }
    this.manageContactService.fetchContactGroupByIdService(this.contactdata.id).subscribe((data: any) => {
      this.contactgroup = data
      this.editContactForm.get('id')?.setValue(this.contactdata.id);
      this.editContactForm.get('contactGroupName')?.setValue(this.contactdata.contactGroupName);
      this.editContactForm.get('description')?.setValue(this.contactdata.description);
      this.contactgroup.forEach((contact: Contact) => {
        this.contacts.push(contact);
        this.contactIds.push(contact.id);
      })
      this.editContactForm.get('contactsId')?.setValue(this.contactIds);
    });
  }

  onSubmit(): void {
    this.editContactForm.get('keywords')?.setValue(this.keywordlist.toString())
    this.manageContactService.updateContactsGroupService(this.editContactForm.value).subscribe((data:any) => {
      this.manageContactService.fetchContactGroupByIdService(this.contactdata.id);
      this.messageService.showMessage(data['response'][0].message);
      this.matDialogRef.close();
    });
  }

  close() {
    this.matDialogRef.close();
  }
  removeContact(contact: Contact): void {
    const id = contact.id;
    for (let i = 0; i < this.contacts.length; i++) {
      const element = this.contacts[i];
      if (id === element.id) {
        this.contacts.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.contactIds.length; i++) {
      if (id === this.contactIds[i]) {
        this.contactIds.splice(i, 1);
        break;
      }
    }
  }





  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
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
}
