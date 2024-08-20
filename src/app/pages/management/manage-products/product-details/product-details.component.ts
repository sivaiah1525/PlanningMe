import { Component, OnInit, Inject, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { Product } from 'src/app/core/models/product.model';
import { Observable } from 'rxjs';
import { ProductGroup } from 'src/app/core/models/product-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from '../../manage-users/user-details/user-details.component';
import { ContactDetailsComponent } from '../../manage-contacts/contact-details/contact-details.component';
import { SiteDetailsComponent } from '../../manage-sites/site-details/site-details.component';
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
import { CreateTransactionComponent } from '../../manage-create/create-transaction/create-transaction.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateProductComponent } from '../../manage-create/create-product/create-product.component';
import { BaseUnitPriceHistoryComponent } from '../base-unit-price-history/base-unit-price-history.component';
import { TranslateService } from '@ngx-translate/core';
import { PriceMatrixComponent } from '../price-matrix/price-matrix.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, PipeTransform {
  product$:any
  productGroup$:any
  profilePick: any;
  profilePickid: any
  productData: any;
  color = 'primary';
  mode = 'indeterminate';
  name = 'Products'
  ViewOrders: any;
  value = 50;
  product!: Product;
  percentagee!: number;
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
  getProduct: any;
  showcontact = false;
  getcontact: any;
  getCurrentYearTargetValue = []
  showSite = false;
  getSite: any;
  AdminStatus: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUsersService: ManageUsersService,
    private manageProductsService: ManageProductsService,
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
    console.log(this.data);
    this.productData = this.data;
    if (this.productData.type === 'product') {
      this.manageUserContactsService.GetCurrentYeartarget(this.data.data.id, 'Products').subscribe((res: any) => {
        this.getCurrentYearTargetValue = res
        console.log(res)
      })
      this.manageProductsService.fetchProductByIdService(this.data.data.id).subscribe((res) => {
        this.product = res;
      });
    } else {
      this.manageProductsService.fetchProductGroupByIdService(this.data.data.id).subscribe(console.log);
      this.productGroup$ = this.manageProductsService.fetchProductGroupByIdService(this.data.data.id);
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



  GetBaseUnitPriceHistory(data:any, type:any) {
    const BaseUnitPriceHistory = this.dialog.open(BaseUnitPriceHistoryComponent, {
      data: { data: data, type: type },
      disableClose: true,
      width: '600px'
    });
    BaseUnitPriceHistory.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }




  closedialogbox() {
    this.dialog.closeAll();
    this.ngOnInit()
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
      this.manageUsersService.getAllCountes(this.name, this.product.id, getname).subscribe((res) => {
        this.getuser = res;
        this.showUser = !this.showUser;
      });
    }
  }

  // findcontactLinked
  findcontactLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.product.id, getname).subscribe((res) => {
        this.getcontact = res;
        this.showcontact = !this.showcontact;
      });
    }
  }
  // findSiteLinked
  findSiteLinked(count:any, getname:any) {
    if (count > 0) {
      this.manageUsersService.getAllCountes(this.name, this.product.id, getname).subscribe((res) => {
        this.getSite = res;
        this.showSite = !this.showSite;
      });
    }
  }
  // findGroupLinked
  findGroupLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getgrpByProductId(this.product.id).subscribe((res) => {
        this.getGrp = res;
        this.showGrp = !this.showGrp;
      });
    }
  }

  // findfilesLinked
  findfilesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getfile(this.product.id, 'Products').subscribe((res) => {
        this.getfile = res;
        this.showfile = !this.showfile;
      });
    }
  }
  // findnotesLinked
  findnotesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService.getnotes(this.product.id, 'Products').subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }
  // getEventDetails
  getEventDetails(count:any) {
    if (count > 0) {
      this.manageUsersService.getEvents(this.product.id, 'Product').subscribe((res) => {
        this.getEvents = res;
        this.showEvents = !this.showEvents;
      });
    }
  }
  // getProductDetails
  getProductDetails(count:any) {
    if (count > 0) {
      this.manageUsersService.getProduct(this.product.id).subscribe((res) => {
        this.getProduct = res;
        this.showProductDetails = !this.showProductDetails;
      });
    }
  }
  // viewOrder
  viewOrder(count:any) {
    this.manageUsersService.FindLastTenOrders(this.product.id, 'Products').subscribe((res) => {
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




  updateproductDialog(row:any) {
    const createProductDialog = this.dialog.open(CreateProductComponent, {
      data: { screenType: 'UpdateTransation', data: row },
      disableClose: true,
      width: '500px'
    });
    createProductDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  // onFileChange
  onFileChange(e:any) {
    var file = e.target.files[0];
    const id = this.profilePickid
    var formData = new FormData();
    formData.append('Profile', file);
    this.manageProductsService.updateprofileproductId(id, formData).subscribe((res) => {
      console.log(res)
    })
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.profilePick = event.target.result
      }
    }
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
  // ShowSiteDetails
  ShowSiteDetails(data:any, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true,
      data: { data: data, type: type },
      width: '500px',
      position: { top: '125px', left: '700px' },
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
    this.manageProductsService.fetchProductGroupByIdService(data).subscribe((data: any) => {
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
            entity: 'Products'
          },
        })
      }
    });
  }
  // ShowGroup
  ShowdynamicGroup(data:any) {
    this.manageProductsService.getDynamicGroupService('Products', data).subscribe((data: any) => {
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
            entity: 'Products'
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



  PriceMatrix(row:any){
    this.dialog.open(PriceMatrixComponent, {
      width: '500px',
      data: row,
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
        data: this.product,
        type: 'Products',
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
        attachmentLevel: 'Prodcuts',
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
        attachmentLevel: 'Prodcuts',
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
      data: { data, Name: 'Prodcuts', single: value, management: true },

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
  //  CreateTransaction
  CreateTransaction() {
    this.dialog.open(CreateTransactionComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
  }
}
