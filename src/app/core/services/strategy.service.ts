import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF, { CellConfig } from 'jspdf';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ManageContactsService } from './manage-contacts.service';
import { DatePipe } from '@angular/common';
import { DriveService } from './drive.service';
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  pdfMake: any;
  transactions: any;
  invoicedata: any;
  invoicelogo: any;
  date: any;
  pdfstatus: any;
  orderID: any;
  constructor(
    private http: HttpClient,
    private manageContactsService: ManageContactsService,
    public datepipe: DatePipe,
    private DriveService: DriveService,
  ) { }

  strategy(): Observable<any> {
    return this.http.get(baseUrl + '/api/Strategy/FindStrategyByFilterCriteria')

  }
  deletestrategyinfo(id:any): Observable<any> {
    return this.http.delete(baseUrl + '/api/Strategy/DeleteStrategy?Id=' + id);
  }
  createstrategy(reqData: any) {
    return this.http.post(baseUrl + '/api/Strategy/CreateStrategy', reqData)
  }

  updatestratergy(reqData: any): Observable<any> {
    return this.http.put(baseUrl + '/api/Strategy/UpdateStrategy', reqData);
  }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      // const pdfMakeModule = await import('pdfmake/build/pdfmake');
      // const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      // this.pdfMake = pdfMakeModule.default;
      // this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf() {

    let pnmInvoice = {
      footer: {
        columns: [
          {
            text: this.invoicedata.footerMention,
            bold: false,
            color: '#aba5a5',
            fontSize: 12,
            margin: [30, 15, 30, 15],
            alignment: 'center'
          }
        ]
      },
      content: [
        {
          columns: [
            [
              {
                image: await this.getBase64ImageFromURL(this.invoicelogo),
                width: 100,
                margin: [0, 10, 0, 10],
              },
              {
                text: this.invoicedata.companyName,
                color: '#333333',
                width: '*',
                fontSize: 14,
                bold: true,
              },
              {
                text: this.invoicedata.mainAddress,
                bold: false,
                color: '#333333',
                fontSize: 10,
              },
              {
                text: this.invoicedata.siteName,
                color: '#333333',
                width: '*',
                fontSize: 14,
                alignment: 'right',
                margin: [0, 0, 0, 0],
                bold: true,
              },
              {
                text: this.invoicedata.customerAddress,
                bold: false,
                color: '#333333',
                fontSize: 11,
                alignment: 'right',
              },
              {
                text: this.invoicedata.customerCity + ' ' + this.invoicedata.customerZipcode + ' ,' + this.invoicedata.customerCountry,
                fontSize: 10,
                alignment: 'right',
                color: '#333333',
                bold: false,
              },
              {
                text: this.pdfstatus + this.invoicedata.orderId,
                bold: true,
                color: '#333333',
                alignment: 'left',
                fontSize: 13,

              },
              {
                text: 'Contact Name :' + this.invoicedata.customerFirstName + ' ' + this.invoicedata.customerLastName,
                color: '#333333',
                fontSize: 13,
                alignment: 'left',
                bold: true,
              },
              {
                width: '100%',
                alignment: 'right',
                text: 'Issue Date: ' + this.datepipe.transform(this.invoicedata.issueDate, 'd MMM y'),
                bold: false,
                fontSize: 11,
              },
            ],
          ],
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function (i:any, node:any) {
              return 1;
            },
            vLineWidth: function (i:any, node:any) {
              return 1;
            },
            hLineColor: function (i:any, node:any) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function (i:any, node:any) {
              return '#eaeaea';
            },
            hLineStyle: function (i:any, node:any) {
              return null;
            },
            paddingLeft: function (i:any, node:any) {
              return 10;
            },
            paddingRight: function (i:any, node:any) {
              return 10;
            },
            paddingTop: function (i:any, node:any) {
              return 2;
            },
            paddingBottom: function (i:any, node:any) {
              return 2;
            },
            fillColor: function (rowIndex:any, node:any, columnIndex:any) {
              return '#ffffff';
            },
          },


          table: {
            headerRows: 1,
            bold: true,
            fontSize: 10,
            widths: [70, '*', 'auto', 30, 50, 75],
            body: this.getTransactionDetails(),
          },
        },

        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'VAT amount in euros  ',
                  border: [false, false, false, false],
                  defaultBorder: false,
                  alignment: 'left',
                  margin: [0, 30, 0, 0],
                },
                {
                  border: [false, false, false, false],
                  defaultBorder: false,
                  text: this.currencyformat(this.invoicedata.vatAmountInEuros) + ' €',
                  alignment: 'right',
                  margin: [0, 30, 0, 0],
                },
              ],
              [
                {
                  text: 'Total amount in euros without VAT  ',
                  border: [false, false, false, false],
                  defaultBorder: false,
                  alignment: 'left',
                  margin: [0, 0, 0, 0],
                },
                {
                  text: this.currencyformat(this.invoicedata.totalAmountInEurosWithoutVAT) + ' €',
                  border: [false, false, false, false],
                  defaultBorder: false,
                  alignment: 'right',
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  text: 'Total amount in euros with VAT  ',
                  border: [false, false, false, false],
                  defaultBorder: false,
                  alignment: 'left',
                  bold: true,
                  margin: [0, 5, 0, 5],
                },
                {
                  text: this.currencyformat(this.invoicedata.totalAmountInEurosWithVAT) + ' €',
                  border: [false, false, false, false],
                  defaultBorder: false,
                  bold: true,
                  alignment: 'right',
                  margin: [20, 5, 0, 5],
                },
              ],
            ],
          },
        },

        {
          text: 'Nous vous remercions d établir le paiement par chèque à l adresse indiquée ci-dessus ou par virement aux coordonnées suivantes',
          margin: [0, 15, 0, 15],
          fontSize: 12,
          alignment: 'lift'
        },
        {
          table: {
            headerRows: 1,
            widths: [100, 275, 100],
            body: [
              [

                {
                  border: [false, false, false, false],
                  padding: [5, 5, 5, 5],
                  color: '#ffffff',
                  text: '2',
                  alignment: 'center',
                  margin: [0, 10, 0, 10],
                  fillColor: '#ffffff',
                },
                {
                  text: this.invoicedata.getBankAccounts,
                  padding: [5, 5, 5, 5],
                  color: '#ffffff',
                  bold: true,
                  border: [false, false, false, false],
                  alignment: 'center',
                  margin: [0, 10, 0, 10],
                  fillColor: '#F53737',
                },

                {
                  border: [false, false, false, false],
                  padding: [5, 5, 5, 5],
                  color: '#ffffff',
                  text: '1',
                  alignment: 'center',
                  margin: [0, 10, 0, 10],
                  fillColor: '#ffffff',
                },
              ],
            ],
          },
        },


        {
          columns: [
            {
              text: 'Payment deadline : ' + this.datepipe.transform(this.invoicedata.paymentDeadLine, 'd MMM y'),
              bold: false,
              color: '#333333',
              alignment: 'left',
              margin: [0, 15, 0, 15],

            },
          ],
        },
        {
          text: 'Le faux des penalities exigibles a compter du ler decembre 2013 en l absence de paiement est egalau faux de refinancement de la BCE (Banque Centrale Europeenne) majore de 10 poins, soit 10,25%. Indemnite forfaitaire pour frais de recouvrement en cas de retard de paiement: 40 euro. Nos conditions de vente ne prevoient pas d escompte pour paiement anticipe.',
          margin: [0, 15, 0, 15],
          fontSize: 12,
          alignment: 'lift'
        },
      ],

      defaultStyle: {
        columnGap: 15
      },
      pageMargins: [30, 50, 30, 80],
    };
    const pdfOptions = {
      // You can specify additional options here
      filename: 'Invoice.pdf', // Set the default filename
      pageSize: 'A4', // Set the page size (A4 is the default)
      pageOrientation: 'portrait', // Set the page orientation ('portrait' or 'landscape')
      // Add more options as needed
    };

    // pdfMake.createPdf(pnmInvoice,pdfOptions).download('Invoice.pdf');
  }




  data(row:any) {
    if (row?.isOrder == true) {
      this.pdfstatus = 'QUOTE ID : '
    } else {
      this.pdfstatus = ' ORDER ID : '
    }
    this.manageContactsService.FindOrderQuoteForPdf(row.id).subscribe((data: any) => {
      console.log(data);
      this.invoicelogo = data.companyLogo;
      this.invoicedata = data;
      this.generatePdf();
    });
  }

  publicinvoicecreate(data:any){
    this.pdfstatus = ' ORDER ID : '
    console.log(data);
    this.invoicelogo = data.companyLogo;
    this.invoicedata = data;
    this.generatePdf();
  }



  getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx:any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }


  getTransactionDetails() {

    let transactionHeader :any= [
      [
        {
          text: 'Transaction Ref',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
        {
          text: 'Name',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
        {
          text: 'Quantity',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
        {
          text: 'VAT',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
        {
          text: 'Unit Price',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
        {
          text: 'Total Amount',
          fillColor: '#f53737',
          color: '#ffffff',
          border: [false, false, false, false],
          bold: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 11,
        },
      ]
    ];
    let transaction :any= [];
    this.invoicedata?.orders.forEach((item:any, index:number) => {
      transaction.push([
        {
          text: item.transactionReference,
          border: [false, true, false, true],
          bold: true,
          margin: [0, 5, 0, 5],
          fontSize: 10
        },
        {
          text: item.name,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10
        },
        {
          border: [false, false, false, true],
          text: item.quantity,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 10
        },
        {
          border: [false, false, false, true],
          text: item.vat + ' ' + '%',
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 10
        },
        {
          border: [false, false, false, true],
          text: this.currencyformat(item.unitPrice) + ' ' + item.currencySymbol,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 10
        },
        {
          border: [false, false, false, true],
          text: this.currencyformat(item.totalAmount) + ' ' + item.currencySymbol,
          alignment: 'right',
          margin: [0, 5, 0, 5],
          fontSize: 10
        }]
      );
      if (item.discountOrderDtos.length != 0) {
        item.discountOrderDtos.forEach((discountlist:any) => {
          transaction.push([
            {
              text: ' ',
              border: [false, true, false, true],
              margin: [0, 5, 0, 5],
              fontSize: 10
            },
            {
              text: discountlist.discountName + ' ' + '-(' + discountlist.discountPercentage + ')' + '-Applied to ' + discountlist.entityName,
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
              alignment: 'left',
              fontSize: 10
            },
            //  + ' ' + '-' +
            {
              border: [false, false, false, true],
              text: discountlist.discountQuantity,
              alignment: 'right',
              margin: [0, 5, 0, 5],
              fontSize: 10
            },
            {
              border: [false, false, false, true],
              text: ' ',
              alignment: 'right',
              margin: [0, 5, 0, 5],
              fontSize: 10
            },
            {
              border: [false, false, false, true],
              text: this.currencyformat(discountlist.discount) + ' ' + item.currencySymbol,
              alignment: 'right',
              margin: [0, 5, 0, 5],
              fontSize: 10
            },
            {
              border: [false, false, false, true],
              text: this.currencyformat(discountlist.discount) + ' ' + item.currencySymbol,
              alignment: 'right',
              margin: [0, 5, 0, 5],
              fontSize: 10
            }]
          );
        })

      }
    });
    return transactionHeader.concat(transaction);
  }

  currencyformat(value: any) {
    let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }
}























