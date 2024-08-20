import { Component, OnInit, Inject, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { Site } from 'src/app/core/models/site.model';
import { Observable } from 'rxjs';
import { SiteGroup } from 'src/app/core/models/site-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from '../../manage-users/user-details/user-details.component';
import { ContactDetailsComponent } from '../../manage-contacts/contact-details/contact-details.component';
import { ProductDetailsComponent } from '../../manage-products/product-details/product-details.component';
import { FileService } from 'src/app/core/services/file.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { ShowgroupComponent } from '../../manage-users/showgroup/showgroup.component';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { GraphFilterComponent } from 'src/app/pages/graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { AddOrderComponent } from '../../manage-transactions/orderQuotes/add-order/add-order.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateSiteComponent } from '../../manage-create/create-site/create-site.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss']
})
export class SiteDetailsComponent implements OnInit, PipeTransform {
  site$:any;
  siteGroup$:any;
  siteData: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  site!: Site;
  name = 'Sites';
  ViewOrders: any;
  percentagee!: number;
  showcontact = false;
  getcontact: any;
  showUser = false;
  getuser: any;
  showGrp = false;
  getGrp: any;
  showfile = false;
  getfile: any;
  shownotes = false;
  getnotes: any;
  cssClass!: string;
  getEvents: any;
  showEvents = false;
  showProductDetails = false;
  getTransaction: any;
  showTransaction = false;
  getProduct!: Object;
  getCurrentYearTargetValue = [];
  AdminStatus: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageSitesService: ManageSitesService,
    private manageUsersService: ManageUsersService,
    private manageUserContactsService: ManageContactsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fileService: FileService,
    public spinner: SpinnerService,
    private translate: TranslateService ,
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
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, '')
    return ammount1.replace('$', '')
  }

  ngOnInit(): void {
    console.log(this.data)
    this.siteData = this.data
    if (this.siteData.type === 'site') {
      this.manageUserContactsService.GetCurrentYeartarget(this.data?.data?.id, 'Sites').subscribe((res: any) => {
        this.getCurrentYearTargetValue = res
        console.log(res)
      })
      this.manageSitesService.fetchSiteByIdService(this.data.data.id).subscribe((res) => {
        this.site = res;
      });
    } else {
      this.manageSitesService.fetchSiteGroupByIdService(this.data.data.id).subscribe(console.log);
      this.siteGroup$ = this.manageSitesService.fetchSiteGroupByIdService(this.data.data.id);
    }
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
      this.manageUsersService.getAllCountes(this.name, this.site.id, getname).subscribe((res) => {
        this.getuser = res;
        this.showUser = !this.showUser;
      });
    }
  }
  // findcontactLinked
  findcontactLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.site.id, getname).subscribe((res) => {
        this.getcontact = res;
        this.showcontact = !this.showcontact;
      });
    }
  }
  // getProductDetails
  getProductDetails(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.site.id, getname).subscribe((res) => {
        this.getProduct = res;
        this.showProductDetails = !this.showProductDetails;
      });
    }
  }
  // findGroupLinked
  findGroupLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getgrpBySiteId(this.site.id).subscribe((res) => {
        this.getGrp = res;
        this.showGrp = !this.showGrp;
      });
    }
  }
  // findfilesLinked
  findfilesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getfile(this.site.id, 'Sites').subscribe((res) => {
        this.getfile = res;
        this.showfile = !this.showfile;
      });
    }
  }
  // findnotesLinked
  findnotesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getnotes(this.site.id, 'Sites').subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }
  // getEventDetails
  getEventDetails(count:any) {
    if (count > 0) {
      this.manageUsersService.getEvents(this.site.id, 'Site').subscribe((res) => {
        this.getEvents = res;
        this.showEvents = !this.showEvents;
      });
    }
  }
  // viewOrders
  viewOrders(count:any) {
    this.manageUsersService.FindLastTenOrders(this.site.id, 'Sites').subscribe((res) => {
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
  // ShowContactDetails
  ShowContactDetails(row:any, type: string) {
    this.dialog.open(ContactDetailsComponent, {
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
      position: { top: '125px', left: '700px' },
    });
  }

  updatesiteDialog(row:any) {
    const createSiteDialog = this.dialog.open(CreateSiteComponent, {
      data: { screenType: 'UpdateSite', data: row },
      disableClose: true,
      width: '500px'
    });

    createSiteDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // ShowNote
  ShowNote(id:any) {
    this.fileService.getNote(id,1,20).subscribe(data => {
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
    this.manageSitesService.fetchSiteGroupByIdService(data).subscribe((data: any) => {
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
            entity: 'Sites'
          },
        })
      }
    });
  }
  // ShowGroup
  ShowdynamicGroup(data:any) {
    this.manageSitesService.getDynamicGroupService('Sites', data).subscribe((data: any) => {
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
            entity: 'Sites'
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
    this.closedialogbox()
    this.dialog.open(TargetCreateComponent, {
      disableClose: true,
      position: { top: '125px', left: '700px' },
      data: {
        data: this.site,
        type: 'Sites',
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
        attachmentLevel: 'Sites',
        ismanage: true,
        type: type
      },
      width: '500px',
      position: { top: '125px', left: '700px' },
      panelClass: ['addFiles']
    });
  }
  //  AddNote
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Sites',
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
      data: { data, Name: 'Sites', single: value, management: true },
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

  // CreateQuote
  CreateQuote() {
    this.dialog.open(AddOrderComponent, {
      disableClose: true,
      position: { top: '125px', left: '700px' },
      // data:data,
      width: '500px'
    });
  }

  // CreateInvoice
  CreateInvoice() {
    this.dialog.open(AddOrderComponent, {
      disableClose: true,
      position: { top: '125px', left: '700px' },
      // data:data,
      width: '500px'
    });
  }

}
