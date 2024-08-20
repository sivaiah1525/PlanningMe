import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Contact } from 'src/app/core/models/contact.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageContactsService } from '../../../../core/services/manage-contacts.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ManagecontactService } from '../managecontact.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
export class ContactRes {
  firstName!: string;
  id!: number;
  lastName!: string;
  profilePicture!: string;
  selected?: boolean;
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent implements OnInit {

  form!: FormGroup;
  contactIds!: number[];
  allContacts: ContactRes[] = [];
  fliteredUsers!: Observable<ContactRes[]>;
  userControl = new FormControl();
  lastFilter: string = '';
  selectedUsers: ContactRes[] = new Array<ContactRes>();
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private messageService: MessageService,
    private managecontactsService: ManagecontactService,
    @Inject(MAT_DIALOG_DATA) public contacts: Contact[],
    private formBuilder: FormBuilder,
    private manageContactService: ManageContactsService,
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
    this.manageContactService.findAllContactsDropdown().subscribe(
      data => {
        console.log(data);
        this.allContacts = data;
        //this.allUsers = data;
        this.fliteredUsers = this.userControl.valueChanges.pipe(
          startWith<string | ContactRes[]>(''),
          map(value => typeof value === 'string' ? value : this.lastFilter),
          map(filter => this.filter(filter))
        );
      }
    )
    console.log(this.contacts);
    this.contactIds = [];
    this.form = this.formBuilder.group({
      keyword:[''],
      contactGroupName: ['', Validators.required],
      description: [''],
      contactsId: [this.contactIds]
    });
  }
  filter(filter: string): ContactRes[] {
    this.lastFilter = filter;
    if (filter) {
      return this.allContacts.filter(option => {
        return option.firstName.toLowerCase().indexOf(filter.toLowerCase()) >= 0
          || option.lastName.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.allContacts.slice();
    }
  }

  onSubmit(): void {
    this.form.get('keyword')?.setValue(this.keywordlist)
    this.selectedUsers.forEach(contact => this.contactIds.push(contact.id));
    this.manageContactService.createContactGroupService(this.form.value).subscribe(
      data => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message)
        this.managecontactsService.managecontactgroup$.next(true);
      }
    );
  }

  optionClicked(event: Event, user: ContactRes) {

    event.stopPropagation();
    this.toggleSelection(user);
  }
  displayFn(value: ContactRes[] | string): string | undefined {
    let displayValue:any;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.firstName + ' ' + user.lastName;
        } else {
          displayValue += ', ' + user.firstName + ' ' + user.lastName;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }
  toggleSelection(user: ContactRes) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.firstName === user.firstName && value.lastName === user.lastName);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl?.setValue(this.selectedUsers);
  }
  removeContact(contact: Contact): void {
    for (let i = 0; i < this.contacts.length; i++) {
      const element = this.contacts[i];
      if (contact.id === element.id) {
        this.contacts.splice(i, 1);
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

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
  }
}
