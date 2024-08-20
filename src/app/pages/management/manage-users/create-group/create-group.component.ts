import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageUsersService } from '../../../../core/services/manage-users.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageuserService } from '../manageuser.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';

export class UserResponse {
  endDate!: string;
  endTime!: string;
  firstName!: string;
  id!: string;
  isAvailable!: boolean
  lastName!: string;
  profilePicture!: string;
  startDate!: string;
  startTime!: string;
  selected!: boolean;
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent implements OnInit {
  form!: FormGroup;
  userIds!: string[];
  userControl = new FormControl();
  fliteredUsers!: Observable<UserResponse[]>;
  lastFilter: string = '';
  allUsers: UserResponse[] = [];
  selectedUsers: UserResponse[] = new Array<UserResponse>();
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public users: User[],
    private formBuilder: FormBuilder,
    private manageUserService: ManageUsersService,
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private messageService: MessageService,
    private manageuserrservice: ManageuserService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }   }

  ngOnInit(): void {
    console.log(this.users)
    this.userIds = [];
    this.manageUserService.findAllUsersDropdown().subscribe(data => {
      console.log(data)
      this.allUsers = data;
      this.fliteredUsers = this.userControl.valueChanges.pipe(
        startWith<string | UserResponse[]>(''),
        map(value => typeof value === 'string' ? value : this.lastFilter),
        map(filter => this.filter(filter))
      );
    }
    )
    this.form = this.formBuilder.group({
      userGroupName: ['', Validators.required],
      description: [''],
      keywords: [''],
      userId: [this.userIds]
    });
  }
  filter(filter: string): UserResponse[] {
    this.lastFilter = filter;
    if (filter) {
      return this.allUsers.filter(option => {
        return option.firstName.toLowerCase().indexOf(filter.toLowerCase()) >= 0
          || option.lastName.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.allUsers.slice();
    }
  }
  onSubmit() {
    this.form.get('keywords')?.setValue(this.keywordlist.toString())
    this.selectedUsers.forEach(user => this.userIds.push(user.id))
    this.manageUserService.createUserGroupService(this.form.value).subscribe(data => {
      this.dialogRef.close();
      this.messageService.showMessage(data['response'][0].message)
      this.manageuserrservice.manageusergroup$.next(true);
    }
    )
  }
  optionClicked(event: Event, user: UserResponse) {

    event.stopPropagation();
    this.toggleSelection(user);
  }
  displayFn(value: UserResponse[] | string): string | undefined {
    let displayValue: any;
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
  toggleSelection(user: UserResponse) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.firstName === user.firstName && value.lastName === user.lastName);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl?.setValue(this.selectedUsers);
  }
  removeUser(user: User) {
    for (let i = 0; i < this.users.length; i++) {
      const element = this.users[i];
      if (user.id === element.id) {
        this.users.splice(i, 1);
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
