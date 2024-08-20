import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { ManageUsersService } from '../../../../core/services/manage-users.service';
import { UserGroup } from 'src/app/core/models/user-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user-group',
  templateUrl: './edit-user-group.component.html',
  styleUrls: ['./edit-user-group.component.scss'],
})
export class EditUserGroupComponent implements OnInit {
  editUserForm!: FormGroup;
  userIds: string[] = [];
  users: User[] = [];
  userdata: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  usergroup: any;
  users$!: Observable<User[]>;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  constructor(
    private matDialogRef: MatDialogRef<EditUserGroupComponent>,
    private formBuilder: FormBuilder,
    private manageUserService: ManageUsersService,
    public spinner: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  }

  ngOnInit(): void {
    this.userdata = this.data;
    this.userIds = [];
    this.editUserForm = this.formBuilder.group({
      id: ['', Validators.required],
      userGroupName: ['', Validators.required],
      description: [''],
      userId: [''],
      keywords: [''],

    });
    this.loadFormData();
    this.users$ = this.manageUserService.findAllUsersDropdown();
  }

  onChange(users:any) {
    var index = this.userIds.indexOf(users.id);
    if (index === -1) {
      this.users.push(users);
      this.userIds.push(users.id);
    }
    else {
      // val is found, removing from array
      this.users.splice(index, 1);
      this.userIds.splice(index, 1);
    }
  }

  loadFormData(): void {
    if (this.userdata?.getKeyword) {
      this.userdata?.getKeyword.forEach((e:any) => {
        this.keywordlist.push(e)
      })
    }
    this.manageUserService.fetchUserGroupByIdService(this.userdata.id).subscribe((data: UserGroup) => {
      this.usergroup = data
      this.editUserForm.get('id')?.setValue(this.userdata.id);
      this.editUserForm.get('userGroupName')?.setValue(this.userdata.userGroupName);
      this.editUserForm.get('description')?.setValue(this.userdata.description);
      this.usergroup.forEach((user: User) => {
        this.users.push(user);
        this.userIds.push(user.id);
      })
      this.editUserForm.get('userId')?.setValue(this.userIds);
    });
  }

  onSubmit() {
    this.editUserForm.get('keywords')?.setValue(this.keywordlist.toString())
    this.manageUserService.updateUsersGroupService(this.editUserForm.value).subscribe(data => {
      this.manageUserService.fetchUserGroupByIdService(this.userdata.id);
      this.matDialogRef.close();
    });
  }

  removeUser(user: User): void {
    const id = user.id;
    for (let i = 0; i < this.users.length; i++) {
      const element = this.users[i];
      if (id === element.id) {
        this.users.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.userIds.length; i++) {
      if (id === this.userIds[i]) {
        this.userIds.splice(i, 1);
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
