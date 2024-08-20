import { Component, OnInit } from '@angular/core';
import { DriveService } from '../../services/drive.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StrategyService } from '../../services/strategy.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-download',
  templateUrl: './invoice-download.component.html',
  styleUrls: ['./invoice-download.component.scss']
})
export class InvoiceDownloadComponent implements OnInit {
  Failed:boolean=false
  Successful:boolean=false
  Initiating:boolean=false
  constructor(
    private DriveService: DriveService,
    private route: ActivatedRoute,
    private router: Router,
    private strategyservice: StrategyService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if(params?.['id']) {
            this.downloadpdf(params?.['id']) 
      } 
    });
  }

  downloadpdf(id:any) {
    this.Failed=false
    this.Successful=false
    this.Initiating=true
    this.DriveService.FindOrderQuoteForPdf(id).subscribe((result:any)=>{
      this.strategyservice.publicinvoicecreate(result);
      this.Failed=false
      this.Successful=true
      this.Initiating=false
    },error=>{
      this.Failed=true
      this.Successful=false
      this.Initiating=false
    })
  }

}
