import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MonthTargetDTO } from '../../../models/month-target-dto.model';
import { ManageContactsService } from '../../../services/manage-contacts.service';
import { ManageProductsService } from '../../../services/manage-products.service';
import { ManageSitesService } from '../../../services/manage-sites.service';
import { AchievedAmount } from '../../../models/achieved-amount.model';
import { Observable } from 'rxjs';
import { TargetComponent } from '../target/target.component';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';

@Component({
  selector: 'app-achieved-amount',
  templateUrl: './achieved-amount.component.html'
})
export class AchievedAmountComponent implements OnInit {
  columns: string[] = ['image', 'StartDate', 'EndDate', 'AchievedValue'];
  monthlyTargets: MonthTargetDTO[] = [];
  targetData: any;
  dataSource: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private manageContactsService: ManageContactsService,
    private manageProductsService: ManageProductsService,
    private manageSitesService: ManageSitesService,
    private translate: TranslateService ,
    private profilepickformat:ProfilePickFormatService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  
   }

  ngOnInit(): void {
    console.log("achivedddddd", this.data)
    this.targetData = this.data.data
    this.dataSource = new MatTableDataSource(this.targetData);
    
  }

  private calculatePerformanceGain(target: any) {
    if (target.progressPercentage > 1) {
      target.performanceGain = Math.round((target.monthlyAchievedAmount - target.monthlyTarget) / target.monthlyTarget) * 100;
    }
  }

  private assignCssClass(progress: number): string {
    let cssClass = '';
    if (progress >= 0 && progress <= 20) {
      cssClass = 'color-20';
    } else if (progress >= 21 && progress <= 50) {
      cssClass = 'color-50';
    } else if (progress >= 51 && progress <= 80) {
      cssClass = 'color-80';
    } else if (progress >= 81 && progress <= 90) {
      cssClass = 'color-90';
    } else if (progress >= 100) {
      cssClass = 'color-100';
    }
    return cssClass;
  }

  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  
  getColor(index:number) {
    return this.profilepickformat.getColor(index)
  }
}
