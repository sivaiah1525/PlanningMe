import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { FileService } from '../../../../core/services/file.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-access-file-notes',
  templateUrl: './access-file-notes.component.html',
  styleUrls: ['./access-file-notes.component.scss'],
})
export class AccessFileNotesComponent implements OnInit {
  @ViewChild('alluserSelected') private alluserSelected!: MatOption;
  @ViewChild('allgroupSelected') private allgroupSelected!: MatOption;

  myForm!: FormGroup;
  users$:any;
  userGroups$:any;
  filteredList1:any;
  filteredList4:any;
  newUser:any;
  userId:any;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<AccessFileNotesComponent>,
    private manageUsersService: ManageUsersService,
    private fileService: FileService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService,
    
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
      this.myForm = this.formBuilder.group({
      users: [''],
      GroupId: [''],
    });
    if (this.data) {
      this.newUser = this.data.users;
    }
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    this.manageUsersService.findAllUsersDropdown().subscribe((res) => {
      this.users$ = res;
      this.users$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList1 = this.users$.slice();
      this.myForm.controls.users.patchValue([
        ...this.filteredList1.map((item:any) => item.id),
        0,
      ]);
      this.setUserPermission();
    });

    this.manageUsersService.fetchUserGroupsService(100, 1).subscribe((res) => {
      this.userGroups$ = res;
      this.userGroups$.sort(function (a:any, b:any) {
        var textA = a.userGroupName.toUpperCase();
        var textB = b.userGroupName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      this.filteredList4 = this.userGroups$.slice();
      this.myForm.controls.GroupId.patchValue([
        ...this.filteredList4.map((item:any) => item.id),
        0,
      ]);
    });

    console.log(this.data);

  }

  setUserPermission() {
    if (this.data) {
      if (this.data.userIds.length !== 0) {
        this.alluserSelected.value = 1;
        this.allgroupSelected.value = 1;
        this.myForm.controls.users.patchValue([
          ...this.data.userIds.map((item:any) => item),
          0,
        ]);
        this.myForm.controls.GroupId.patchValue([
          ...this.data.groupIds.map((item:any) => item),
          0,
        ]);

      } else {
        this.alluserSelected.value = 0;
        this.allgroupSelected.value = 0;

      }

    }
  }

  submit() {
    this.matDialogRef.close(this.myForm.value);
  }
  shareLink() {
    const user = this.myForm.controls['users'].value;
    var userData = user.filter((e:any) => {
      return e !== 0
    })
    const group = this.myForm.controls['GroupId'].value;
    var iddata = group.filter((e:any) => {
      return e > 0
    })
    group.filter((ele:any) => ele > 0);
    const accessObj = {
      id: this.data.id,
      isFile: this.data.isFile === true ? true : false,
      isNote: this.data.isFile === false ? true : false,
      isReport: false,
      nameOfTheFile: this.data.fileName,
      fileCreatorId: this.data.fileCreatorId,
      userIds: userData,
      userGroupIds: iddata
    }
    console.log(accessObj)
    this.fileService.shareFile(accessObj).subscribe(resp => {
      if (resp) {
        this._snackBar.open(resp.response[0].message, '', {
          duration: 2000,
        });

      }
    });
  }

  toggleAllUserSelection() {
    if (this.alluserSelected.selected) {
      this.alluserSelected.value = 0;
      this.myForm.controls.users.patchValue([
        ...this.filteredList1.map((item:any) => item.id),
        0,
      ]);
    } else {
      this.myForm.controls.users.patchValue([]);
    }
  }

  toggleAllGroupSelection() {
    if (this.allgroupSelected.selected) {
      this.myForm.controls.GroupId.patchValue([
        ...this.filteredList4.map((item:any) => item.id),
        0,
      ]);
    } else {
      this.myForm.controls.GroupId.patchValue([]);
    }
  }
}
