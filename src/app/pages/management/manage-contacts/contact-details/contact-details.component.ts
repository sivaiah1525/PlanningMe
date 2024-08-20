import { Component, OnInit, Inject, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { Contact } from 'src/app/core/models/contact.model';
import { Observable } from 'rxjs';
import { ContactGroup } from 'src/app/core/models/contact-group.model';
import { ContactGroupTarget } from 'src/app/core/models/contact-group-target.model';
import { Tag } from 'src/app/core/models/tag.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from '../../manage-users/user-details/user-details.component';
import { SiteDetailsComponent } from '../../manage-sites/site-details/site-details.component';
import { ProductDetailsComponent } from '../../manage-products/product-details/product-details.component';
import { FileService } from 'src/app/core/services/file.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { ShowgroupComponent } from '../../manage-users/showgroup/showgroup.component';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { GraphFilterComponent } from 'src/app/pages/graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateContactComponent } from '../../manage-create/create-contact/create-contact.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivitLogComponent } from '../../activit-log/activit-log.component';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],

})

export class ContactDetailsComponent implements OnInit, PipeTransform {
  panelOpenState = false;
  contact$!: Observable<Contact>;
  contactGroup$:any;
  contactGroupTarget$:any;
  userConactData: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  name = 'Contacts';
  ViewOrders: any
  tagviewmodel!: Observable<Contact>;
  contact!: Contact;
  myModel = true;
  showUser = false;
  getuser: any;
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
  getProduct!: Object;
  getCurrentYearTargetValue :any= [];
  AdminStatus: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fileService: FileService,
    public spinner: SpinnerService,
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
  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  
  getColor(index:any) {
    return this.profilepickformat.getColor(index)
  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
    let ammount1 = ammount.replace(/,/g, '')
    return ammount1.replace('$', '')
  }

  ngOnInit(): void {
    this.userConactData = this.data;
    console.log(this.userConactData, 'this.userConactData');
    if (this.userConactData.type === 'contact') {
      this.manageUserContactsService.GetCurrentYeartarget(this.data.data.id, 'Contacts').subscribe((res: any) => {
        this.getCurrentYearTargetValue = res
        console.log(res)
      })
      this.manageUserContactsService.fetchContactByIdService(this.data.data.id).subscribe((res) => {
        this.contact = res;
      }); 
    } else {
      this.manageUserContactsService.fetchContactGroupByIdService(this.data.data.id).subscribe(console.log);
      this.contactGroup$ = this.manageUserContactsService.fetchContactGroupByIdService(this.data.data.id);
    }

  }


  updateContactDialog(row:any) {
    const createContactDialog = this.dialog.open(CreateContactComponent, {
      data: { screenType: 'UpdateContact', data: row },
      disableClose: true,
      width: '500px'
    });

    createContactDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }


  assignCssClass(progress:any) {
    let value:any
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

  // findUserLinked
  findUserLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.contact.id, getname).subscribe((res) => {
        this.getuser = res;
        this.showUser = !this.showUser
      });
    }
  }

  // findSiteLinked
  findSiteLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.contact.id, getname).subscribe((res) => {
        this.getSite = res;
        this.showSite = !this.showSite
      });
    }
  }
  // getProductDetails
  getProductDetails(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.contact.id, getname).subscribe((res) => {
        this.getProduct = res;
        this.showProductDetails = !this.showProductDetails;
      });
    }
  }
  // findGroupLinked
  findGroupLinked(count:any) {
    if (count) {
      this.manageUsersService.getgrpByContactId(this.contact.id).subscribe((res) => {
        this.getGrp = res;
        this.showGrp = !this.showGrp
      });
    }
  }
  // findfilesLinked
  findfilesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getfile(this.contact.id, 'Contacts').subscribe((res) => {
        this.getfile = res;
        this.showfile = !this.showfile;
      });
    }
  }
  // findnotesLinked
  findnotesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getnotes(this.contact.id, 'Contacts').subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }
  // getEventDetails
  getEventDetails(count:any) {
    if (count > 0) {
      this.manageUsersService.getEvents(this.contact.id, 'Contact').subscribe((res) => {
        this.getEvents = res;
        this.showEvents = !this.showEvents;
      });
    }
  }
  // viewOrders
  viewOrders(count:any) {
    this.manageUsersService.FindLastTenOrders(this.contact.id, 'Contacts').subscribe((res) => {
      this.ViewOrders = res;
      if (this.ViewOrders.length == 0) {
        this._snackBar.open(' Orders not found', 'Undo', {
          duration: 3000
        });
      } else {
        this.getTransaction = res;
        this.showTransaction = !this.showTransaction;
      }
    });
  }
  // ShowUserDEtails
  ShowUserDEtails(row:any, type: string): void {
    this.dialog.open(UserDetailsComponent, {
      data: { data: row, type: type, },
      disableClose: true,
      width: '500px',
      position: { top: '125px', left: '700px' },
    },);
  }

  // ShowSiteDetails
  ShowSiteDetails(row:any, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px',
      position: { top: '125px', left: '700px' },
    });
  }
  // ShowProductDetails
  ShowProductDetails(row:any, type: string): void {
    this.dialog.open(ProductDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px',
      position: { top: '150px', left: '700px' }
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
    this.manageUserContactsService.fetchContactGroupByIdService(data).subscribe((data: any) => {
      var result = data;
      if (result.length == 0) {
        this._snackBar.open(' Details not found', 'Undo', {
          duration: 3000
        });
      } else {
        this.dialog.open(ShowgroupComponent, {
          width: '500px',
          position: { top: '125px', left: '700px' },
          autoFocus: false,
          disableClose: true,
          data: {
            data: result,
            entity: 'Contacts'
          },
        })
      }
    });
  }
  // ShowGroup
  ShowdynamicGroup(data:any) {
    this.manageUserContactsService.getDynamicGroupService('Contacts', data).subscribe((data: any) => {
      var result = data;
      if (result.length == 0) {
        this._snackBar.open(' Details not found', 'Undo', {
          duration: 3000
        });
      } else {
        this.dialog.open(ShowgroupComponent, {
          width: '500px',
          position: { top: '125px', left: '700px' },
          autoFocus: false,
          disableClose: true,
          data: {
            data: result,
            entity: 'Contacts'
          },
        })
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
  // createTarget
  createTarget() {
    this.dialog.open(TargetCreateComponent, {
      disableClose: true,
      position: { top: '125px', left: '700px' },
      data: {
        data: this.contact,
        type: 'Contacts',
        state: 'Single'
      },
      width: '500px',
    });
  }
  // AddFile
  AddFile(row:any, type:any) {
    this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: type
      },
      position: { top: '125px', left: '700px' },
      width: '500px',
      panelClass: ['addFiles']
    });
  }
  //  AddNote
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: type
      },
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
      data: { data, Name: 'Contacts', single: value, management: true },
    });
  }
  // CreateStratergy
  CreateStratergy() {
    this.dialog.open(CreateStrategyComponent, {
      width: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true
    });
  }

  
  showActivitylogs(data:any){
    this.dialog.open(ActivitLogComponent, {
      width: '600px',
      data: { type: 'Contacts', data:data },
      autoFocus: false,
      disableClose: true,
    });
  }


}

