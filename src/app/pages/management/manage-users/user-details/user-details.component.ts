import { Component, OnInit, Inject, TemplateRef, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { User } from 'src/app/core/models/user.model';
import { Observable } from 'rxjs';
import { UserGroup } from 'src/app/core/models/user-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactDetailsComponent } from '../../manage-contacts/contact-details/contact-details.component';
import { SiteDetailsComponent } from '../../manage-sites/site-details/site-details.component';
import { ProductDetailsComponent } from '../../manage-products/product-details/product-details.component';
import { FileService } from 'src/app/core/services/file.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { ShowgroupComponent } from '../showgroup/showgroup.component';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { GraphFilterComponent } from 'src/app/pages/graph/components/graph-filter/graph-filter.component';
import { StrategyComponent } from 'src/app/pages/settings/strategy/strategy.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { ManageUsersComponent } from '../manage-users.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateUserComponent } from '../../manage-create/create-user/create-user.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivitLogComponent } from '../../activit-log/activit-log.component';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit, PipeTransform {

  user$!: Observable<User>;
  userGroup$!: Observable<UserGroup>;
  userData: any;
  color = 'primary';
  mode = 'indeterminate';
  name = 'Users';
  percentagee: any;
  ViewOrders: any;
  userList: any
  value = 10;
  user!: User;
  showcontact = false;
  getcontact: any;
  showProduct = false;
  cssClass!: string;
  getProduct: any;
  showSite = false;
  getSite: any;
  showGrp = false;
  getGrp: any;
  showfile = false;
  getfile: any;
  shownotes = false;
  getnotes: any;
  getEvents: any;
  showEvents = false;
  showProductDetails = false
  getTransaction: any;
  showTransaction = false
  getCurrentYearTargetValue = []
  AdminStatus: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUsersService: ManageUsersService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private fileService: FileService,
    public userComponent: ManageUsersComponent,
    private matDialogRef: MatDialogRef<UserDetailsComponent>,
    private manageUserContactsService: ManageContactsService,
    private translate: TranslateService ,
    private profilepickformat:ProfilePickFormatService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.AdminStatus = localStorage.getItem("isAdmin");

  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
    let ammount1 = ammount.replace(/,/g, '')
    return ammount1.replace('$', '')
  }

  ngOnInit(): void {
    this.userData = this.data;
    console.log(this.data)
    if (this.userData.type === 'user') {
      this.manageUserContactsService.GetCurrentYeartarget(this.userData.data.id, 'Users').subscribe((res: any) => {
        this.getCurrentYearTargetValue = res
        console.log(res)
      })
      this.manageUsersService.fetchUserByIdService(this.userData.data.id).subscribe((res) => {
        this.user = res;
      });
    } else {
      this.manageUsersService.fetchUserGroupByIdService(this.userData.data.id).subscribe(console.log);
      this.userGroup$ = this.manageUsersService.fetchUserGroupByIdService(this.userData.id);
    }
  }

  assignCssClass(progress:any) {
    let value:any=''
    if (progress >= 0 && progress <= 20) {
      value= 'color-20';
    } else if (progress >= 21 && progress <= 50) {
      value= 'color-50';
    } else if (progress >= 51 && progress <= 80) {
      value= 'color-80';
    } else if (progress >= 81 && progress <= 90) {
      value= 'color-90';
    } else if (progress >= 100) {
      value= 'color-100';
    }
    return value
  }


  closedialogbox() {
    this.dialog.closeAll();
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      console.log(result)
    })
  }
  // findcontactLinked
  findcontactLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.user.id, getname).subscribe((res) => {
        console.log(res)
        this.getcontact = res;
        this.showcontact = !this.showcontact;
      });
    }
  }
  // findProductLinked
  findProductLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.user.id, getname).subscribe((res) => {
        this.getProduct = res;
        this.showProduct = !this.showProduct;
      });
    }
  }
  // findSiteLinked
  findSiteLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.user.id, getname).subscribe((res) => {
        this.getSite = res;
        this.showSite = !this.showSite;
      });
    }
  }
  // findGroupLinked
  findGroupLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getgrpByUserId(this.user.id).subscribe((res) => {
        this.getGrp = res;
        this.showGrp = !this.showGrp;
      });
    }
  }

  // findfilesLinked
  findfilesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getfile(this.user.id, 'Users').subscribe((res) => {
        this.getfile = res;
        this.showfile = !this.showfile;
      });
    }
  }

  // findnotesLinked
  findnotesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getnotes(this.user.id, 'Users').subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }


  // getEventDetails
  getEventDetails(count:any) {
    this.manageUsersService.getEvents(this.user.id, 'Users').subscribe((res) => {
      this.getEvents = res;
    });
    if (this.getEvents.length == 0) {
      this.snackBar.open(' Events not found', 'Undo', { duration: 3000 });
    } else {
      this.showEvents = !this.showEvents;

    }
  }
  // getProductDetails
  getProductDetails(getname:any) {
    this.manageUsersService.getAllCountes(this.name, this.user.id, getname).subscribe((res) => {
      this.getProduct = res;
      this.showProductDetails = !this.showProductDetails;
    });
  }

  // Vew details 
  // ShowContactDetails
  ShowContactDetails(row:any, type: string) {
    this.dialog.open(ContactDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px',
      position: { top: '150px', left: '700px' },

    });
  }

  // ShowSiteDetails
  ShowSiteDetails(row:any, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true, 
      data: { data: row, type: type },
      width: '500px',
      position: { top: '150px', left: '700px' },
    });
  }
  // ShowProductDetails
  ShowProductDetails(row:any, type: string): void {
    this.dialog.open(ProductDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px',
      position: { top: '150px', left: '700px' },
    });
  }
  // ShowNote
  ShowNote(id:any) {
    this.fileService.getNote(id,1,10).subscribe(data => {
      console.log(data);
      this.dialog.open(ViewNotesComponent, {
        width: '500px',
        position: { top: '125px', left: '700px' },
        autoFocus: false,
        disableClose: true,
        data: {
          type: 'view', 
          data: data
        },
      })
    });
  }

  // ShowGroup
  ShowstaticGroup(data:any) {
    this.manageUsersService.getGroupUserService(data).subscribe(data => {
      var result = data;
      if (result.length == 0) {
        this.snackBar.open(' Details not found', 'Undo', { duration: 3000 });
      } else {
        this.dialog.open(ShowgroupComponent, {
          width: '500px',
          position: { top: '125px', left: '700px' },
          autoFocus: false,
          disableClose: true,
          data: {
            data: result,
            entity: 'Users'
          },
        })
      }
    });
  }
  // ShowGroup
  ShowdynamicGroup(data:any) {
    this.manageUsersService.getDynamicGroupUserService('Users', data).subscribe(data => {
      var result = data;
      if (result.length == 0) {
        this.snackBar.open(' Details not found', 'Undo', { duration: 3000 });
      } else {
        this.dialog.open(ShowgroupComponent, {
          width: '500px',
          position: { top: '125px', left: '700px' },
          autoFocus: false,
          disableClose: true,
          data: {
            data: result,
            entity: 'Users'
          },
        })
      }
    });
  }
  // viewOrders
  viewOrders(count:any) {
    this.manageUsersService.FindLastTenOrders(this.user.id, 'Users').subscribe((res) => {
      this.ViewOrders = res;
      if (this.ViewOrders.length == 0) {
        this.snackBar.open(' Orders not found', 'Undo', { duration: 3000 });
      }
      else {
        this.getTransaction = res;
        this.showTransaction = !this.showTransaction;
      }

    });
  }
  // gotofiles
  gotofiles(row:any) {
    this.dialog.open(FileDownloadShareComponent, {
      width: '500px',
      data: row,
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
    })
  }
  // three point icon 
  //  EditUder

  updateuserDialog(row:any) {
    const UpdateUserDialog = this.dialog.open(CreateUserComponent, {
      data: { screenType: 'UpdateUser', data: row },
      disableClose: true,
      width: '500px'
    });
    UpdateUserDialog.afterClosed().subscribe(result => {
      
      console.log(`Dialog result: ${result}`);
    });
  }


  // createTarget
  createTarget() {
    this.closedialogbox()
    this.dialog.open(TargetCreateComponent, {
      disableClose: true,
      data: { data: this.user, type: 'Users', state: 'Single' },
      position: { top: '125px', left: '700px' },
      width: '500px',
    });
  }

  // AddFile
  AddFile(user:any, type:any) {
    const addFilesDialog = this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: { data: user, attachmentLevel: 'Users', ismanage: true, type: type },
      position: { top: '125px', left: '700px' },
      width: '500px',
      panelClass: ['addFiles']
    });
    addFilesDialog.afterClosed().subscribe(result => {
      if (result) {
        const formData = new FormData(); formData.append('AttachmentLevel', result.attachmentLevel);
        formData.append('SelectIds', result.selectName);
        formData.append('Keywords', result.Keywords);
        formData.append('Created', new Date().toDateString());
        const accompSize = result.AttachmentsArr.length;
        for (let i = 0; i < accompSize; i++) {
          let element = result.AttachmentsArr[i];
          formData.append('Attachments[' + i + '].file', element.upFile);
          formData.append('Attachments[' + i + '].Title', element.title);
          formData.append('Attachments[' + i + '].IsPrivate', element.isPrivate);
        }
        console.log(formData)
        this.fileService.createFile(formData).subscribe(data => {
          if (data) {
            console.log(data)
            this.snackBar.open(data.response[0].message, '', { duration: 2000, });
          }
        });
      }
    });
  }

  //  AddNote
  AddNote(row:any, type:any) {
    const addNotesDialog = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: { data: row, attachmentLevel: 'Users', ismanage: true, type: type },
      position: { top: '125px', left: '700px' },
      width: '600px',
      panelClass: ['addNotes']
    });
  }


  // openAddEventDialog
  openAddEventDialog() {
    this.dialog.open(CreateEventComponent, {
      width: '500px',
      autoFocus: false,
      position: { top: '125px', left: '700px' },
      data: { screenType: 'CreateEvent' },
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }
  // ActivityReport
  ActivityReport(data:any, value:any) {
    this.dialog.open(GraphFilterComponent, {
      width: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
      data: { data, Name: 'Users', single: value, management: true },
    });
  }
  // CreateStratergy
  CreateStratergy() {
    this.dialog.open(CreateStrategyComponent, {
      width: '600px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true
    });
  }
  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  
  getColor(index:number) {
    return this.profilepickformat.getColor(index)
  }

  showActivitylogs(data:any){
    this.dialog.open(ActivitLogComponent, {
      width: '600px',
      data: { type: 'Users', data:data },
      autoFocus: false,
      disableClose: true,
    });
  }
}
