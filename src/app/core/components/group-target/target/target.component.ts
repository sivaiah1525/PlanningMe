import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AchievedAmount } from '../../../models/achieved-amount.model';
import { TargetCreateComponent } from '../target-create/target-create.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html'
})
export class TargetComponent implements OnInit {
  columns: any[] = ['contact', 'result', 'options'];
  monthName!: string;
  dataSource: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public target: any,
     private dialog: MatDialog,
     private translate: TranslateService ,
     ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }     
      }

  ngOnInit(): void {
    this.monthName = this.target.achievedAmountsMonthly[0].month;
    this.dataSource = new MatTableDataSource<AchievedAmount>(this.target.achievedAmountsMonthly);

  }

  createTarget(): void {
    this.dialog.open(TargetCreateComponent, {
      width: '500px'
    });
  }

}
