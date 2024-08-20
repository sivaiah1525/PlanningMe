import { Component, OnInit, Inject, PipeTransform, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/core/models/transaction.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { GraphFilterComponent } from 'src/app/pages/graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { TransationEditComponent } from '../transation-edit/transation-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, PipeTransform {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader: boolean = false; // Variable to control overlay visibility
  transData: any;
  transaction = [];
  tagViewModels: any[] = [];
  ListOfDiscount: any;
  showDiscount = false;
  screenType: any;
  AdminStatus: any;
  showfile = false;
  getfile: any;
  shownotes = false;
  getnotes: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageTransactionService: ManageTransactionsService,
    public spinner: SpinnerService,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<TransactionDetailsComponent>,
    private translate: TranslateService ,
    private fileService: FileService,
    private manageUsersService: ManageUsersService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }      this.AdminStatus = localStorage.getItem("isAdmin");

  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }

  numberdigimal(value:any){
     return  value.toFixed(2);
  }
  ngOnInit(): void {
    console.log(this.data)
    this.screenType = this.data.type
    this.transData = this.data.data;
    if (this.data.type == 'transation') {
      this.loader=true
      this.manageTransactionService.fetchTransactionById(this.transData.id).subscribe((result: any) => {
        if (result) {
          this.transaction = result;
          this.loader=false
        }
      });

    } else {
      this.loader=true
      this.manageTransactionService.gettransactionDiscountPercentage(this.transData.id, this.data.public, this.data.private,this.data.external).subscribe((result: any) => {
        if (result) {
          this.loader=false
          this.ListOfDiscount = result;
        }
      })
    }
  }

  viewdiscountForTransation(transaction:any, value1:any, value2:any,value3:any) {
    this.dialog.open(TransactionDetailsComponent, {
      disableClose: true,
      data: { data: transaction, public: value1, private: value2,external:value3, type: 'discounttable' },
      width: '600px'
    });
  }

  findUserLinked() {
    this.showDiscount = true
  }


  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.matDialogRef.close(true)
    })
  }

  updatetransactionDialog(data:any) {
    const Createduplicatefortranction = this.dialog.open(TransationEditComponent, {
      width: '500px',
      data: { data: data, screenType: 'UpdateTransation' },
      autoFocus: false,
      disableClose: true,
    })
    Createduplicatefortranction.afterClosed().subscribe(result => {
      if (result) {
        this.matDialogRef.close(true)
      }
    });
  }


  // AddFile
  AddFile(row:any) {
    this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Orders',
        ismanage: true
      },
      width: '500px',
      position: { top: '125px', left: '700px' },
      panelClass: ['addFiles']
    });
  }
  //  AddNote
  AddNote(row:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Orders',
        ismanage: true
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
      height: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true
    });
  }
  // ActivityReport
  ActivityReport() {
    this.dialog.open(GraphFilterComponent, {
      width: '500px',
      height: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true
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
        this.manageUsersService.getfileforoder(this.transData.id, 'Orders',true).subscribe((res) => {
          this.getfile = res;
          this.showfile = !this.showfile;
        });
      }
    }

      // findnotesLinked
  getnotesfororder(count:any) {
    if (count > 0) {
      this.manageUsersService.getnotesfororder(this.transData.id, 'Orders',true).subscribe((res) => {
        this.getnotes = res;
        this.shownotes = !this.shownotes;
      });
    }
  }

}
