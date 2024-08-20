import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AchievedAmount } from '../../../models/achieved-amount.model';
import { TargetCreateComponent } from '../target-create/target-create.component';
import { TranslateService } from '@ngx-translate/core';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { AchievedAmountComponent } from '../Achieved-Amount/achieved-amount.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-target-year',
  templateUrl: './target-year.component.html'
})
export class TargetYearComponent implements OnInit {
  columns: string[] = ['image', 'options', 'progress'];
  dataSource: any;
  groupUser: any;
  targetData: any;
  achievedAmount: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
     private dialog: MatDialog,
     private translate: TranslateService,
     private manageUserService: ManageUsersService,
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
    
    this.targetData = this.data.target;
    console.log('targetData',this.targetData) 
    this.groupUser = this.data.data
    console.log('groupUser',this.groupUser) 
    this.groupUser.forEach((user:any) => {
      let fullName = user.firstName + ' ' + user.lastName;
      user.fullName = fullName;
  });

  this.ViewAchievedAmount(this.targetData)
  }

  
  ViewAchievedAmount(data:any): void {
    let id: any
    if(this.data.type == 'Users') {
       id = data.childUserIds;
    }
    else {
      id = data.childIds;
    }
       
    
   
    const entity = data.targetAssignee;
    const targetType = data.targetType;
    const valueType = data.targetValueType;
    const startdate = data.startDate;
    const enddate = data.endDate;

    this.manageUserService.fetchusersAchievedAmountService(entity, targetType, valueType, id, startdate, enddate)
      .subscribe((result: any) => {
        console.log("userrrrr", result)
        result.forEach((result:any) => {
          const userToUpdate = this.groupUser.find((user:any) => user.id == result.id);
          if (userToUpdate) {
            userToUpdate.achievedAmount = result.achievedValue;
            userToUpdate.achievedDuration = result.achievedDuration;
          }
          this.dataSource = new MatTableDataSource(this.groupUser);
        })
        this.groupUser.forEach((user:any) => {
          if (data.targetTypeName === 'Orders') {
            let percentage = Math.round((user.achievedAmount / data.targetValue) * 100);
            user.percentage = percentage > 100 ? 100 : percentage;
          } else {
            const timeStringToSeconds = (timeString: string): number => {
              const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
              return hours * 3600 + minutes * 60 + seconds;
            };
  
            const totalAchievedSeconds = timeStringToSeconds(user.achievedDuration);
            const targetSecondsValue = timeStringToSeconds(data.targetDuration);
            let percentage = 0;
  
            if (targetSecondsValue !== 0) {
              percentage = Math.round((totalAchievedSeconds / targetSecondsValue) * 100);
            }
            
            user.percentage = Math.min(percentage, 100);
          }
        });
      });
  }

  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  
  getColor(index:any) {
    return this.profilepickformat.getColor(index)
  }

  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }
}
