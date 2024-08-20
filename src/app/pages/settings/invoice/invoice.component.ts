import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { trigger, query, style, transition, stagger, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDetailComponent } from '../../../core/components/invoice-detail/invoice-detail.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  currentDate = new Date();
  AllinvoiceData: any;
  constructor(
    private dialog: MatDialog,
    private service: ManageContactsService
  ) { }

  ngOnInit(): void {
    this.getAllinvoices()
  }


  Downloadinvoice(data:any) {
    this.service.DownloadInvoiceById(data.id).subscribe((result) => {
      console.log(result)
    })
  }

  getAllinvoices() {
    this.service.getAllInvoice().subscribe((result) => {
      this.AllinvoiceData = result
    })
  }


  invoiceDetailModal(data:any): void {
    const createSiteDialog = this.dialog.open(InvoiceDetailComponent, {
      data: data,
      width: '600px'
    });

    createSiteDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
