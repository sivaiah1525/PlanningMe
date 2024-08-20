
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
import { TranslateService } from '@ngx-translate/core';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ViewTaskComponent } from '../../manage-tasks/view-task/view-task.component';
import { UserDetailsComponent } from '../../manage-users/user-details/user-details.component';
import { colors } from 'src/app/pages/graph/mock/graph.mock';
import { CreateInitiativesComponent } from '../create-initiatives/create-initiatives.component';
import { CheckScreenWidthPercentageService } from 'src/app/core/services/check-screen-width-percentage.service';
import { PopupForAllComponent } from 'src/app/pages/commonForAll/popup-for-all/popup-for-all.component';

@Component({
  selector: 'app-view-initiatives',
  templateUrl: './view-initiatives.component.html',
  styleUrls: ['./view-initiatives.component.scss']
})
export class ViewInitiativesComponent implements OnInit, PipeTransform {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader: boolean = false; // Variable to control overlay visibility
  Showdirectsubtask:boolean[]=[]
  Initiativedata: any;
  AdminStatus: any;
  showsteps=false;
  showTask: boolean[] = [];
  showusers!: boolean;
  showTeams!: boolean;
  directtask: boolean=false;
  getUser: any;
  getTeams: any;
  colorScheme = colors;
  stepsformatdata:any=[]
  taskdataformat:any=[]
  directsubtaskdata:any=[[]]
  progressValue =60; 
  customColor = 'purple';
   progress: number = 60;
   radius: number = 40; 
   FindTasksUnderInitiativeByID=[]
   FindTasksUnderInitiativestatus:boolean=false
   subteams:any;
   teamusers:any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageTransactionService: ManageTransactionsService,
    public spinner: SpinnerService,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<ViewInitiativesComponent>,
    private translate: TranslateService ,
    private fileService: FileService,
    private manageUsersService: ManageUsersService,
    private userService: ManageUsersService,
    private findScreenpresentage: CheckScreenWidthPercentageService,

  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  this.AdminStatus = localStorage.getItem("isAdmin");

  }



  transform(value: any, ...args: any[]) {
    if (typeof (value) == 'number') {
      let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
      let ammount1 = ammount.replace(/,/g, ' ')
      let ammount2 = ammount1.replace('$', ' ')
      let ammount3 = ammount2.replace('.00', ' ')
      let ammount4 = ammount3 + ' ' + '€'
      return ammount4.toString()
    } else {
      return value
    }

  } 

  getstatus(value:any){
    return value.replace('_',' ')
  }


  temformat(value:any) {
    const fractionalPart = Number(value) % 1;
    if (fractionalPart >= 0.5) {
      return Math.ceil(Number(value))+'%';
    } else if (value == 0) {
      return 0;
    } else {
      return Math.floor(Number(value))+'%';
    }
  }
  public circumference: number = 2 * Math.PI * this.radius;
  calculateDashoffset(progress:any) {
    const percent = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return this.circumference - (percent / 100) * this.circumference;
  }

  assignCssClass(progress: number): string {
    let cssClass = '';
    if (Number(progress) >= 0 && Number(progress) <= 20) {
      cssClass = 'color-20';
    } else if (Number(progress) >= 21 && Number(progress) <= 50) {
      cssClass = 'color-50';
    } else if (Number(progress) >= 51 && Number(progress) <= 80) {
      cssClass = 'color-80';
    } else if (Number(progress) >= 81 && Number(progress) <= 90) {
      cssClass = 'color-90';
    } else if (Number(progress) >= 100) {
      cssClass = 'color-100';
    }
    return cssClass;
  }
  assignCssClass1(progress: number): string {
    let cssClass = '';
    if (Number(progress) >= 0 && Number(progress) <= 20) {
      cssClass = 'color1-20';
    } else if (Number(progress) >= 21 && Number(progress) <= 50) {
      cssClass = 'color2-50';
    } else if (Number(progress) >= 51 && Number(progress) <= 80) {
      cssClass = 'color3-80';
    } else if (Number(progress) >= 81 && Number(progress) <= 90) {
      cssClass = 'color4-90';
    } else if (Number(progress) >= 100) {
      cssClass = 'color5-100';
    }
    return cssClass;
  }

  numberdigimal(value:any){
     return  value.toFixed(2);
  }
  ngOnInit(): void {
    this.Showdirectsubtask = new Array(false);
    console.log(this.data)
    this.getInitiativebyId(this.data.data.id)
  }





  findstepsLinked(){
    this.showsteps=!this.showsteps
  }

  toggleTasksVisibility(index: number,data:any): void {
    console.log(data)
    this.showTask[index] = !this.showTask[index];
    data.forEach((element:any,i:number) => {
      const formardata=[]
      formardata.push({
        "name": element.title,
         "value": element.progress
      },
      {
        name: 'Remaining',
        value: 100-element.progress
      })
      this.taskdataformat[index][i]=formardata
    });
}


opendirectTask(data:any,i:number){
  if(data.subTaskCount!=0){
    if(this.Showdirectsubtask[i]==true){
      this.Showdirectsubtask[i]=false
    }else{
      this.Showdirectsubtask[i]=true
    }
    this.loader=true
    this.userService.FindSubTaskbyID(data.id).subscribe((result)=>{
      if(result){
        this.loader=false
        console.log(result)
        this.directsubtaskdata[i]=result
        console.log(this.directsubtaskdata)
      }
    },error=>{
      this.loader=false
    })
  }
 
}

initializeTaskVisibility(): void {
  this.showTask = new Array(this.Initiativedata.stepsDto.length).fill(false);
}

opentaskDialog(id:any) {
  this.dialog.open(ViewTaskComponent, {
    width: '550px',
    position: { top: '125px', left: '700px' },
    autoFocus: false,
    disableClose: true,
    data: id
  });
}


get50TenCharacters(value:any){
  if(value.length>30){
    let firstTenCharacters = value.slice(0, 30);
    var data=firstTenCharacters +'...'
    return this.toTitleCase(data);
  }else{
   return this.toTitleCase(value);
  }
}
 toTitleCase(str:any) {
  return str.toLowerCase().split(' ').map((word:any)=> {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
getStatusColorClass(status:any) {
  let value:any=''
  if (status == 'Not Started' || status == 'NotAssigned'||status=='Not_Assigned') {
    value= 'Assign-color';
  } else if (status == 'In Progress' || status == 'Assigned'||status == 'In_Progress') {
    value= 'InProgress-color';
  } else if (status == 'Completed') {
    value= 'completed-color';
  } else if (status == 'Canceled') {
    value= 'cancelled-color'; 
  } else if (status == 'Failed'|| status=='Late') {
    value= 'Failed-color';
  }
  return value
}


createInitiatives(data:any, type:any) {
  const creaInitiatives = this.dialog.open(CreateInitiativesComponent, {
    data: { data: data, type: type },
    disableClose: true,
    width: this.findScreenpresentage.screenpercentage()
  });
  creaInitiatives.afterClosed().subscribe(result => {
    if (result) {
      console.log(result);
      this.getInitiativebyId(this.data.data.id)

    }
  });
}

deleteDialogConfirmation(data:any, type:any) {
  const deleteInitiative = this.dialog.open(DeleteCommomComponent, { 
    data: { data, type: type } 
  });
  deleteInitiative.afterClosed().subscribe((result: any) => {
    if (result) {
    }

  })
}

findtaskLinked(id:any){
  this.loader=true
  this.FindTasksUnderInitiativestatus=!this.FindTasksUnderInitiativestatus
  this.userService.FindTasksUnderInitiative(id).subscribe((result: any) => {
    if (result) {
      this.loader=false
      this.FindTasksUnderInitiativeByID=result
      this.directtask=true
    }
    console.log(result)
  }, error => {
    this.loader=false
  })

}



  getInitiativebyId(id:any){
    this.loader = true; 
    this.manageUsersService.FindInitiativeById(id).subscribe((result)=>{
      if(result){
        this.Initiativedata=result
        console.log(result)
        this.loader=false
        if(this.Initiativedata.hasStep==false&&this.Initiativedata.directTaskCount!=0){
          this.findtaskLinked(this.Initiativedata.id)
        }
      }
    })
  }
  getsubteams(id:any,data:any) {
    this.manageUsersService.FindSubteamofTeam(id,data.id).subscribe((result:any)=>{
      if(result.length!=0){
        console.log(result)
        this.subteams=result
        result.teamname=data.teamName
        result.Initiativeid=id
      this.InitiativeTeam(result,'subteams')
      }
    })

  }


  

  // openUserDialog
  InitiativeTeam(row:any, type: string) {
    this.dialog.open(PopupForAllComponent, {
      width: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
      data: { data: row, type: type },
    });
  }



  getteamusers(id:any,data:any) {
    this.manageUsersService.FindUsersOFTeam(id,0).subscribe((result:any)=>{
      if(result.length!=0){
        console.log(result)
        this.teamusers=result
        result.teamname=data.teamName
        result.Initiativeid=id
        this.InitiativeTeam(result,'teamusers')
      }
    })
  }

  findUserLinked(data:any) {
      this.manageUsersService.FindUserById(data).subscribe((res: any) => {
        console.log("userrrr",res)
        this.getUser = res;
        this.showusers = !this.showusers;
      });
  }

  findteamUserLinked() {
    this.showTeams = !this.showTeams;
    // this.manageUsersService.FindUsersByInitiative(id,1).subscribe((res: any) => {
    //   console.log("userrrr",res)
    //   this.getTeams = res;
    //   this.showTeams = !this.showTeams;
    // });
}



  // openUserDialog
  openUserDialog(row:any, type: string) {
    this.dialog.open(UserDetailsComponent, {
      width: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
      data: { data: row, type: type },
    });
  }
}
