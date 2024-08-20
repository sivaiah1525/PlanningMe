import { Component, Inject, OnInit, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/core/models/transaction.model';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { ProductDetailsComponent } from '../../../manage-products/product-details/product-details.component';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { AddOrderComponent } from '../add-order/add-order.component';
import { StrategyService } from 'src/app/core/services/strategy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfViewComponent } from '../pdf-view/pdf-view.component';
import { TranslateService } from '@ngx-translate/core';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { FileService } from 'src/app/core/services/file.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';

@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.component.html',
  styleUrls: ['./viewdetails.component.scss']
})
export class ViewdetailsComponent implements OnInit, PipeTransform {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  OrderData: any;
  FindProductsByOrderQuote :any= []
  FindtransationsByOrderQuote :any= []
  orderId: any
  transaction!: Observable<Transaction>;
  tagViewModels: any[] = [];
  showProduct = false;
  showTransaction = false
  screenType = ''
  ListOfDiscount: any;
  showfile = false;
  getfile: any;
  shownotes = false;
  getnotes: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageContactsService: ManageContactsService,
    public spinner: SpinnerService,
    private dialog: MatDialog,
    private manageTransactionService: ManageTransactionsService,
    public snackBar: MatSnackBar,
    private strategyservice: StrategyService,
    private translate: TranslateService ,
    private manageUsersService: ManageUsersService,
    private fileService: FileService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }
  numberdigimal(value:any){
    return  value.toFixed(2);
 }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }

  ngOnInit(): void {
    console.log(this.data.data)
    this.orderId = this.data.data;
    this.screenType = this.data.type
    if (this.data.type == 'OrderQuote') {
      this.manageContactsService.fetchOrderById(this.orderId.id).subscribe((res:any) => {
        this.OrderData = res[0];
      })
      this.manageContactsService.FindProductsByOrderQuoteId(this.orderId.id).subscribe((result: any) => {
        if (result.length!=0) {
          result.forEach((element:any) => {
            if(this.FindProductsByOrderQuote.length==0){
              this.FindProductsByOrderQuote.push(element)
            }else{
              this.FindProductsByOrderQuote.forEach((A:any)=>{
                if(A.productId!=element.productId){
                  this.FindProductsByOrderQuote.push(element)
                }
              })
            }            
          });
        }
      });
    } else {
      this.manageTransactionService.getOrderQuoteDiscountPercentage(this.orderId.orderId, this.data.public, this.data.private).subscribe((result: any) => {
        if (result) {
          this.ListOfDiscount = result;
        }
      })
    }

  }

  viewdiscountForTransation(transaction:any, value1:any, value2:any) {
    this.dialog.open(ViewdetailsComponent, {
      disableClose: true,
      data: { data: transaction, public: value1, private: value2, type: 'discounttable' },
      width: '600px'
    });

  }
  findProductLinked() {
    this.showProduct = !this.showProduct
  }

  findTransationLinked(transationIds:any) {
    if (this.showTransaction == false) {
      this.manageTransactionService.FindOrderQuoteTransactions(transationIds).subscribe((result: any) => {
        if (result) {
          this.FindtransationsByOrderQuote = result;
        }
      });
      this.showTransaction = !this.showTransaction
    } else {
      this.showTransaction = !this.showTransaction
    }
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



  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.ngOnInit();
      }
    })
  }

  EditorderDialog(data: any): void {
    const UpdateOrder = this.dialog.open(AddOrderComponent, {
      data: { data: data, screenType: 'EditOrder' },
      width: '500px'
    });
  }
  download(row:any) {
    this.strategyservice.data(row);
    this.snackBar.open(' PDF Loding......', ' ', {
      duration: 3000,
      panelClass: 'my-custom-snackbar'
    });
  }
  ViewPdf(row:any) {
    this.dialog.open(PdfViewComponent, {
      disableClose: true,
      data: row,
      width: '800px'
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

    // findfilesLinked
    findfilesLinked(count:any) {
      if (count > 0) {
        this.manageUsersService.getfileforoder(this.orderId.id, 'Orders',false).subscribe((res) => {
          this.getfile = res;
          this.showfile = !this.showfile;
        });
      }
    }

      // findnotesLinked
  findnotesLinked(count:any,type:any) {
    if (count > 0) {
      this.manageUsersService.getnotesfororder(this.orderId.id, 'Orders',false).subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }

}
