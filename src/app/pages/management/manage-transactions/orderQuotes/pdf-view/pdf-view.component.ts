import { Component, Inject, OnInit, PipeTransform } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { StrategyService } from 'src/app/core/services/strategy.service';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss'],
})
export class PdfViewComponent implements OnInit, PipeTransform {
  id: any;
  invoicedata: any;
  pdfstatus: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private manageContactsService: ManageContactsService,
    private strategyservice: StrategyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }

  ngOnInit(): void {
    this.id = this.data;
    this.manageContactsService.FindOrderQuoteForPdf(this.id.id).subscribe((data: any) => {
      console.log(data)
      if (data.isOrder == false) {
        this.pdfstatus = 'QUOTE  '
      }
      if (data.isOrder == true) {
        this.pdfstatus = 'ORDER  '
      }
      this.invoicedata = data;
      console.log(this.invoicedata.orders)
    })
  }
  downloadpdf() {
    console.log(this.id.id);
    this.strategyservice.data(this.id);
    this.closedialogbox()
    this.snackBar.open(' PDF Loding......', ' ', { duration: 10000, panelClass: 'my-custom-snackbar' });
  }
  closedialogbox() {
    this.dialog.closeAll();
  }


}
