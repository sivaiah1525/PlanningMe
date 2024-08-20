//import { ModalController } from '@ionic/angular';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageContactsService } from '../../services/manage-contacts.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'pm-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
  invoiceDetails: any
  constructor(
    private matDialogRef: MatDialogRef<InvoiceDetailComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ManageContactsService,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }

  }

  ngOnInit() {
    console.log(this.data)
    this.getinvoiceDetails()
  }

  getinvoiceDetails() {
    this.service.getInvoiceById(this.data.id).subscribe((result: any) => {
      if (result) {
        this.invoiceDetails = result
      }
    })
  }

  closeInvoiceModal() {
    this.matDialogRef.close();
  }

  print() {

  }

  download() {

  }
}
