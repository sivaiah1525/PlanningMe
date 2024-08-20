import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { DriveService } from 'src/app/core/services/drive.service';
import { FileService } from 'src/app/core/services/file.service';
import { GraphService } from 'src/app/core/services/graph.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';
import { StrategyService } from 'src/app/core/services/strategy.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';

@Component({
  selector: 'app-delete-commom',
  templateUrl: './delete-commom.component.html',
  styleUrls: ['./delete-commom.component.scss']
})
export class DeleteCommomComponent implements OnInit {
  type: any;
  Deletedata: any;
  entitydata: any;
  DemoOrganation:boolean=false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<DeleteCommomComponent>,
    public snackBar: MatSnackBar,
    private manageContactsService: ManageContactsService,
    private managesitesService: ManageSitesService, 
    private manageproductsService: ManageProductsService,
    private manageUserService: ManageUsersService,
    private calendarService: CalendarService,
    private fileService: FileService,
    private strategyservice: StrategyService,
    private ManageTransactionsService: ManageTransactionsService,
    private graphService: GraphService,
    private DriveService: DriveService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private goole: GoogleApiService,
  ) {
    if(localStorage.getItem('DemoOrganation')==='true'){
this.DemoOrganation==true
    }else{
      this.DemoOrganation==false
    }
   }

  ngOnInit(): void {
    this.entitydata = this.data?.entitydata
    this.Deletedata = this.data.data;
    this.type = this.data.type
    console.log(this.data)
  }



  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true
    });
  }


  // deleteorder 
  async deleteorder() {
    try {
      await this.manageContactsService.deleteOrder(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete order', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele order falid', 'Undo', { duration: 2000 });
    }

  }

  //  deleteTransation 
  async deleteTransation() {
    try {
      await this.ManageTransactionsService.deletetransaction(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Transation', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Transation falid', 'Undo', { duration: 2000 });
    }

  }

  // deletediscount 
  async deletediscount() {
    try {
      await this.manageContactsService.deleteDiscount(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Discount', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Discount falid', 'Undo', { duration: 2000 });
    }
  }
  // deletediscount 
  async deleteContact() {
    try {
      await this.manageContactsService.deletecontact(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete contact', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele contact falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteContactGroup 
  async deleteContactGroup() {
    try {
      await this.manageContactsService.deleteContactsGroupService(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete ContactGroup', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele ContactGroup falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteContacttarget 
  async deleteContacttarget() {
    if (this.Deletedata.isGroup == true) {
      try {
        await this.manageContactsService.DeleteTargetOfGroupOfContacts(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open('Delete Contacttarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open(' Detele Contacttarget falid', 'Undo', { duration: 2000 });
      }
    } else {
      try {
        await this.manageContactsService.deletetargetcontact(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open('Delete Contacttarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open(' Detele Contacttarget falid', 'Undo', { duration: 2000 });
      }
    }

  }
  // deleteSite 
  async deleteSite() {
    try {
      await this.managesitesService.deleteSitesService(this.Deletedata.id,)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete deleteSite', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele deleteSite falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteSite 
  async deleteSiteGroup() {
    try {
      await this.managesitesService.deleteSitesGroupService(this.Deletedata.id,)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete SiteGroup', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele SiteGroup falid', 'Undo', { duration: 2000 });
    }
  }
  // Sitetarget 
  async deleteSitetarget() {
    if (this.Deletedata.isGroup == true) {
      try {
        await this.managesitesService.DeleteTargetOfGroupOfSites(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open('Delete Sitetarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open(' Detele Sitetarget falid', 'Undo', { duration: 2000 });
      }
    } else {
      try {
        await this.managesitesService.deleteSitestarget(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open('Delete Sitetarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open(' Detele Sitetarget falid', 'Undo', { duration: 2000 });
      }
    }

  }
  // deleteProduct 
  async deleteProduct() {
    try {
      await this.manageproductsService.deleteproduct(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' deleteProduct', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  deleteProduct falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteProductGroup 
  async deleteProductGroup() {
    try {
      await this.manageproductsService.deleteProductsGroupService(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' deleteProductGroup', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  deleteProductGroup falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteProducttarget 
  async deleteProducttarget() {
    if (this.Deletedata.isGroup == true) {
      try {
        await this.manageproductsService.DeleteTargetOfGroupOfProducts(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteProducttarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteProducttarget falid', 'Undo', { duration: 2000 });
      }
    } else {
      try {
        await this.manageproductsService.deletetargetproduct(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteProducttarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteProducttarget falid', 'Undo', { duration: 2000 });
      }
    }

  }
  // deleteUser 
  async deleteUser() {
    try {
      await this.manageUserService.deleteuser(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' deleteUser', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  deleteUser falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteUserGroup 
  async deleteUserGroup() {
    try {
      await this.manageUserService.deleteUsersGroupService(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' deleteUserGroup', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  deleteUserGroup falid', 'Undo', { duration: 2000 });
    }
  }
  // deleteUserTarget 
  async deleteUserTarget() {
    if (this.Deletedata.isGroup == true) {
      try {
        await this.manageUserService.DeleteTargetOfGroupOfUsers(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteUserTarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteUserTarget falid', 'Undo', { duration: 2000 });
      }
    } else {
      try {
        await this.manageUserService.deleteUserTarget(this.Deletedata.targetIdentity)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteUserTarget', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteUserTarget falid', 'Undo', { duration: 2000 });
      }
    }
  }
  async DeleteTarget() {
    try {
      await this.manageUserService.DeleteTarget(this.Deletedata.targetIdentity)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' Delete Target', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  Delete Target falid', 'Undo', { duration: 2000 });
    }

  }

  // DiscountFromManagement 
  async DiscountFromManagement() {
    const data = { entity: this.entitydata.name, entityId: this.entitydata.id, discountId: this.Deletedata.id }
    try {
      await this.manageContactsService.RemoveDiscountFromManagement(data)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open(' deleteDiscount', 'Undo', { duration: 2000 });
    } catch (error:any) {
      window.alert(error.error.response[0].message)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('  deleteDiscount falid', 'Undo', { duration: 2000 });
    }
  }

  // deleteEvent 
  async deleteEvent() {
    try {
      await this.calendarService.deleteEvent(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.calendarService.createevent$.next(true)
      this.snackBar.open(' deleteEvent', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('  deleteEvent falid', 'Undo', { duration: 2000 });
    }
  }



  // deleteEvent 
  async deletefileAndNote() {
    if (this.Deletedata.isNote) {
      console.log('note')
      try {
        await this.fileService.deleteNote(this.Deletedata.id)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteFile', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteFile falid', 'Undo', { duration: 2000 });
      }
    } else {
      console.log('file')
      try {
        await this.fileService.deleteFile(this.Deletedata.id)
        this.MatDialogRefDelet.close(true)
        this.snackBar.open(' deleteFile', 'Undo', { duration: 2000 });
      } catch (error) {
        this.snackBar.open('  deleteFile falid', 'Undo', { duration: 2000 });
      }
    }

  }

  // deleteUserTarget 
  async deletecategroy() {
    try {
      await this.calendarService.deleteCategory(this.Deletedata.id)
      this.snackBar.open(' deletecategroy', 'Undo', { duration: 2000 });
      this.MatDialogRefDelet.close(true)
    } catch (error) {
      this.snackBar.open('  deletecategroy falid', 'Undo', { duration: 2000 });
    }
  }

  // deletestategy 
  async deletestategy() {
    try {
      await this.strategyservice.deletestrategyinfo(this.Deletedata.id)
      this.snackBar.open(' deletestategy', 'Undo', { duration: 2000 });
      this.MatDialogRefDelet.close(true)
    } catch (error) {
      this.snackBar.open('  deletestategy falid', 'Undo', { duration: 2000 });
    }
  }

  // deletetag 
  deletetag() {
    console.log('deletetag')
    this.manageContactsService.deletetag(this.Deletedata.id).subscribe((result) => {
      this.snackBar.open(' deletetag', 'Undo', { duration: 2000 }); 
      this.MatDialogRefDelet.close(true)
    }), ((error:any) => {
      this.snackBar.open('  deletetag falid', 'Undo', { duration: 2000 });
    })
  }

  deleteChart() {
    this.graphService.deleteReport(this.Deletedata.id).subscribe((result) => {
      this.snackBar.open(' deleteChart', 'Undo', { duration: 2000 });
      this.MatDialogRefDelet.close(true)
    }), ((error:any) => {
      this.snackBar.open('  deleteChart falid', 'Undo', { duration: 2000 });
    })
  }
  DeleteSubNote() {
    this.fileService.deleteSubNote(this.Deletedata.id).subscribe((result: any) => {
      if (result) {
        this.snackBar.open('Subnotes Removed', '', { duration: 2000, });
        this.MatDialogRefDelet.close(true)
      }
    }, (error) => {
      this.snackBar.open('  Subnotes falid', 'Undo', { duration: 2000 });

    });
  }

  deletconfig() {
    this.DriveService.removeConfiguration(this.Deletedata.id, this.Deletedata.isFile).subscribe((res:any) => {
      if (res) {
        this.MatDialogRefDelet.close(true)
        this.messageService.showMessage(res['response'][0].message);
      }
    });
  }

  Deletesuycaccount() {
    this.goole.DeleteSyncAccount(this.Deletedata.id).subscribe((res:any) => {
      if (res) {
        this.MatDialogRefDelet.close(true)
        this.messageService.showMessage(res['response'][0].message);
      }
    },error=>{
      if(error.status===200){
        this.MatDialogRefDelet.close(true)
        this.messageService.showMessage('Account Removed')
      }
    });
  }


  deletedynamickeyword() {
    this.DriveService.DeleteDynamicGroup(this.Deletedata.id).subscribe((res:any) => {
      if (res) {
        this.MatDialogRefDelet.close(true)
        this.messageService.showMessage(res['response'][0].message);
      }
    });
  }

  // deletediscount 
  async deleteTask() {
    try {
      await this.manageContactsService.deleteTask(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Task', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Task falid', 'Undo', { duration: 2000 });
    }
  }

  async deleteInitiatives() {
    try {
      await this.manageContactsService.deleteInitiative(this.Deletedata.id)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Initiative', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Initiative falid', 'Undo', { duration: 2000 });
    }
  }
  
  async deletepipeforInitiative() {
    try {
      await this.manageContactsService.RemovePipeline(this.Deletedata)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Pipeline done', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Pipeline falid', 'Undo', { duration: 2000 });
    }
  }

  async deletepipeforTask() {
    try {
      await this.manageContactsService.RemovePipeline(this.Deletedata)
      this.MatDialogRefDelet.close(true)
      this.snackBar.open('Delete Pipeline done', 'Undo', { duration: 2000 });
    } catch (error) {
      this.snackBar.open(' Detele Pipeline falid', 'Undo', { duration: 2000 });
    }
  }


  

























}

