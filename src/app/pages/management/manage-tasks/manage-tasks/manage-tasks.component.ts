import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GanttChartComponent } from '../gantt-chart/gantt-chart.component';
import { CheckScreenWidthPercentageService } from 'src/app/core/services/check-screen-width-percentage.service';
import { SelectPipelineComponent } from 'src/app/core/components/select-pipeline/select-pipeline.component';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { MatExpansionPanelHeader } from '@angular/material/expansion';
import { ChooseTaskOptionComponent } from '../../management-initiatives/create-initiatives/choose-task-option/choose-task-option.component';
import { ConformationComponent } from '../../management-initiatives/conformation/conformation.component';
import { DatePipe } from '@angular/common';
import { MessageService } from 'src/app/core/services/message.service';
import { TaskInToEventComponent } from '../task-in-to-event/task-in-to-event.component';
import { ManageCreateComponent } from '../manage-create/manage-create.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateMilestoneComponent } from '../create-milestone/create-milestone.component';
import { Board } from '../kanban-Task/kanban-task-view/model/board.model';
import { MatSelectChange } from '@angular/material/select';
import { Column } from '../kanban-Task/kanban-task-view/model/column.model';
import { TaskDependenciesComponent } from './task-dependencies/task-dependencies.component';
import { UpdateInitiativesKanbanComponent } from '../../management-initiatives/update-initiatives-kanban/update-initiatives-kanban.component';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { ResizeService } from 'src/app/core/services/resize.service';
import { AdvanceSearchInManagementSingleComponent } from '../../advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrls: ['./manage-tasks.component.scss'],
})
export class ManageTasksComponent implements OnInit {

  tabnumber!: number;
  showicon: boolean = false;
  activeIndex:any;
  taskDataSource: any;
  targetDataSource:any;
  initiatives:any;
  columns!: string[];
  KanbanView=false;
  userGroupTargetsColumns!: string[];
  progressValue =60;
  customColor = 'purple';
   progress: number = 60;
   radius: number = 40;
   PageNumber=1
   NumberOfRecord=10
   Search=''
   subtasklistA:any=[]; 
   subtasklistB:any=[];
   subtasklistC:any=[];
  taskData :any= []
  loader=false
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  tasklength=0
  Listofassignes=0
  targetData = [
    {name: 'project1', CreaterName: 'demo', year: '2018', target: '100232', percentage: '80'},
    {name: 'project2', CreaterName: 'dummy', year: '2019', target: '1045232', percentage: '67'},
    {name: 'project3', CreaterName: 'sample', year: '2020', target: '1045632', percentage: '45'},
    {name: 'project4', CreaterName: 'testing', year: '2021', target: '7684532', percentage: '100'},
   
  ]
  listofFindPipelines:any;
  selectedOption:any; // Set default value here
  taskcardview:any;
  size: any;
  width!: number;
  isMobileView!: boolean;
  SearchResult: any = [];
  ListOftragetfiltervalues:any= [];
  displayedItems: any[] = [];
  startIndex: number = 0;
  totalValue: any;
  selectedPipeLine: any;
  StepsByPipe!: any[];
  stepName!: any[];
  StatusColorClass:any;
  constructor(
    private translate: TranslateService ,
    private findScreenpresentage:CheckScreenWidthPercentageService,
    private dialog: MatDialog,
    private userService: ManageUsersService, 
    public datepipe: DatePipe,  
    private messageService: MessageService,
    private profilepickformat:ProfilePickFormatService,
    private resizeService: ResizeService,
    ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  
   }

   getallFindPipelines() {
    this.userService.FindPipelinesfortask().subscribe(result => {
      if (result) {
        this.listofFindPipelines = result
        this.selectedOption = result[0].id
        console.log(this.selectedOption)
        this.getStepsByPipelineId(result[0].id)
      }
    }, error => {
      this.loader = false
    })
  }
  onSelectionChange(event: MatSelectChange) {
    this.getStepsByPipelineId(event.value)
    this.selectedPipeLine = event.value
    console.log(this.selectedPipeLine)
  }
  getStepsByPipelineId(id:number) {
    this.loader=true
    this.userService.FindStepsByPipelineIdfortask(id).subscribe((result: any) => {
      this.loader=false
      this.taskcardview=result
      console.log(result)
        var columns:any = []
        var columnids:any = []
        result.forEach((element:any) => {
          columnids.push(
            element.step.toString()
          )
        }); 
        result.forEach((element:any, index:number) => {
          columns.push({
            "name": element.stepName,
            "id": element.step.toString(),
            "columnids": columnids,
            "tasks": []
          })

          if(element.tasks!=null){
            element.tasks.forEach((res:any) => {
              columns[index].tasks.push(res)
            });
          }

          console.log("coloumnssss", columns)
          this.taskcardview = new Board('Test Board', columns); 
          this.StepsByPipe = columns
          console.log(this.taskcardview)
    }, (error:any) => {
      this.loader = false
    })
  })
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
  getstatus(value:any){
    return value.replace('_',' ')
  }
  public circumference: number = 2 * Math.PI * this.radius;
  calculateDashoffset(progress:number) {
    const percent = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return this.circumference - (percent / 100) * this.circumference;
  }
  ngOnInit(): void {
    this.tabnumber = 0;
    this.loadTask(20, 1, '')
    this.getallFindPipelines()
    // this.columns = ['options', 'name', 'email', 'gender', 'position', 'city'];
    this.columns = ['options', 'Title', 'progress', 'Status','startdate','enddate', 'Duration', 'Creater'];
    this.userGroupTargetsColumns = ['options', 'name', 'CreaterName', 'year', 'target', 'progress'];
    this.resizeService.size$.subscribe(
      user => {
        this.size = user.size;
        if (this.size < 992) {
          this.isMobileView = true;
        } else {
          this.isMobileView = false;
        }
      }
    );
    this.width = window.innerWidth; 
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }
  }

  get30TenCharacters(value:any){
    if(value.length>30){
      let firstTenCharacters = value.slice(0, 30);
      return firstTenCharacters +'...'
    }else{
     return value
    }
  }

  togglePanel1(i:any): void {
    console.log(i)
    this.taskData[i].expanded=!this.taskData[i].expanded
  }


  togglePanel2(panel:any): void {
    panel.expanded = !panel.expanded;
    this.subtasklistB.forEach((p:any) => {
      if (p !== panel) {
        p.expanded = !p.expanded; 
      }
    });
  }

  togglePanel3(panel:any): void {
    panel.expanded = !panel.expanded;
    this.subtasklistC.forEach((p:any) => {
      if (p !== panel) {
        p.expanded = !p.expanded; 
      }
    });
  }
  getListofassignes(data:any){
    return data.Listofassignes=data.Listofassignes+3
  }
  getassigned(value:any,data:any){
    if(value.Listofassignes==0){
      const firstThreeObjects = data.slice(0, 3);
      return firstThreeObjects
    }else if(value.Listofassignes==3){
      const secondThreeObjects = data.slice(3, 6);
      return secondThreeObjects
    }else if(value.Listofassignes==6){
      const thirdThreeObjects = data.slice(6, 9);
      return thirdThreeObjects
    }
  }
  isImageValid(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
  checkImageValidity(url: string) {
    this.isImageValid(url)
      .then(valid => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
      .catch(error => {
        return false
      });
  }

  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  getColor(index:any) {
    return this.profilepickformat.getColor(index)
  }
 
  getsubtasksA(data:any,index:number){
    this.loader=true
    this.userService.FindSubTaskbyID(data.id).subscribe((result)=>{
      if(result){
        this.loader=false
        this.subtasklistA[index]=result
        this.subtasklistA[index].forEach((element:any) => {
          element.expanded=false
          element.Listofassignes=0
        },(error:any)=>{
          this.loader=false
        });
      }
    })
  }
  
  getsubtasksB(data:any,index:number){
    this.loader=true
    this.userService.FindSubTaskbyID(data.id).subscribe((result)=>{
      if(result){
        this.loader=false
        this.subtasklistB[index]=result
        this.subtasklistB[index].forEach((element:any) => {
          element.expanded=false
          element.Listofassignes=0
        },(error:any)=>{
          this.loader=false
        });
      }
    })
  }

  getsubtasksC(data:any,index:number){
    this.loader=true
    this.userService.FindSubTaskbyID(data.id).subscribe((result)=>{
      if(result){
        this.loader=false
        this.subtasklistC[index]=result
        this.subtasklistC[index].forEach((element:any) => {
          element.expanded=false
          element.Listofassignes=0
        },(error:any)=>{
          this.loader=false
        });
      }
    })
  }
  tabChange(tabIndex: number): void {
    this.showicon = false
    this.tabnumber = tabIndex;
    if (tabIndex == 0) {
     this.loadTask(20, 1, '')
    } else if (tabIndex === 1) {

    } else if (tabIndex === 2) {
     this.loadTargets()
    }
  }



  getlinkedpredecessor(data:any,count:any){
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,false,true).subscribe((result)=>{
        if(result){
          this.loader=false
          if(result.length==1){
            this.opentaskDialog(result[1].taskId)
          }else{
            this.showlistofsuccessorandpredecessor(result,'predecessor')
          }
        }
      },error=>{
        this.loader=false
      })
    }
  }
  getlinkedsuccessor(data:any,count:any){
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,true,false).subscribe((result)=>{
        if(result){
          this.loader=false
          if(result.length==1){
            this.opentaskDialog(result[1].taskId)
          }else{
       this.showlistofsuccessorandpredecessor(result,'successor')
          }
        }
      },error=>{ 
        this.loader=false
      })
    }
  }


  showlistofsuccessorandpredecessor(data:any,type:any){
    const listofsuccessorandpredecessor = this.dialog.open(TaskDependenciesComponent, {
      width: '500px',
      panelClass: ['files'],
      data: {data:data,type:type},
      disableClose: false,
    });
    listofsuccessorandpredecessor.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(result)
        this.opentaskDialog(result)
      } 
    })
  } 



  



  showGanttView(row:any){
    this.dialog.open(GanttChartComponent, {
      data: { data: row },
      disableClose: true,
      width:'100%'
      // width:this.findScreenpresentage.screenpercentage()
    },);
  }

  searchKanbanView(){
    const SelectPipeline = this.dialog.open(SelectPipelineComponent, {
      disableClose: true,
      width: '500px',
      data:{ selectedOption: this.selectedOption, stepsByPipe: this.StepsByPipe, type:'taskKanbanScreen'}
    });
    SelectPipeline.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        const values = Object.entries(result).map(([key, value]) => ({
          [key]: value,
        }));
        
        // Transforming the data into the desired format
        const ListOftragetfiltervalues = values.map((obj) => {
          const key = Object.keys(obj)[0];
          const value = obj[key];
          return { name: key, value: value };
        });
        let filteredArray = ListOftragetfiltervalues.filter((element) => {
          if (
            element.value != null &&
            element.value !== '' &&
            element.value !== false &&
            element.value !== undefined
          ) {
            return true;
          }

          return false; // Exclude element from filtered result
        });
        this.ListOftragetfiltervalues = filteredArray;
        console.log(this.ListOftragetfiltervalues);
        const params=this.createparams()
        console.log(params)
        this.userService.FilterKanbanTasks(params).subscribe((res:any)=>{
          var columns:any = []
          var columnids:any= []
          res.forEach((element:any) => {
            columnids.push(
              element.step.toString()
            )
          }); 
          res.forEach((element:any, index:number) => {
            columns.push({
              "name": element.stepName,
              "id": element.step.toString(),
              "columnids": columnids,
              "tasks": []
            })
  
            if(element.tasks!=null){
              element.tasks.forEach((res:any) => {
                columns[index].tasks.push(res)
              });
            }
            
            console.log("coloumnssss", columns)
            this.taskcardview = new Board('Test Board', columns); 
            console.log(this.taskcardview)
            this.stepName = columns
            this.showicon = true
          }, (error:any) => {
            this.loader = false
          })
            // this.taskData = res.taskdto;
            // this.tasklength=res.totalCount
            // this.taskData.forEach((element:any) => {
            //   element.Listofassignes=0
            // });
            // this.showicon = true
          
          if(this.isMobileView == false) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
          } else if (this.isMobileView == true) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
          }
        })
      }
    });
  }

  searchandfiltrer(){
    const SelectPipeline = this.dialog.open(SelectPipelineComponent, {
      disableClose: true,
      width: '500px',
      data:{type:'taskScreen'}
    });
    SelectPipeline.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        const values = Object.entries(result).map(([key, value]) => ({
          [key]: value,
        }));
        
        // Transforming the data into the desired format
        const ListOftragetfiltervalues = values.map((obj) => {
          const key = Object.keys(obj)[0];
          const value = obj[key];
          return { name: key, value: value };
        });
        let filteredArray = ListOftragetfiltervalues.filter((element) => {
          if (
            element.value != null &&
            element.value !== '' &&
            element.value !== false &&
            element.value !== undefined
          ) {
            return true;
          }

          return false; // Exclude element from filtered result
        });
        this.ListOftragetfiltervalues = filteredArray;
        console.log(this.ListOftragetfiltervalues);
        const params=this.createparams()
        console.log(params)
        this.userService.FilterTasks(10, 1, params).subscribe((res:any)=>{
          if(res){
            this.taskData = res.taskdto;
            this.tasklength=res.totalCount
            this.taskData.forEach((element:any) => {
              element.Listofassignes=0
            });
            this.showicon = true
          }
          if(this.isMobileView == false) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
          } else if (this.isMobileView == true) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
          }
        })
      }
    });
  }

  navigateItems(direction: string): void {
    if (direction === 'left') {
      if (this.startIndex > 0 && this.isMobileView == false) {
        this.startIndex -= 5;
      }
       else if (this.startIndex > 0  && this.isMobileView == true) {
        this.startIndex -= 1;
      }
    } else if (direction === 'right') {
      if (this.startIndex + 5 < this.ListOftragetfiltervalues.length && this.isMobileView == false) {
        this.startIndex += 5;
      } else if (this.startIndex + 1 < this.ListOftragetfiltervalues.length && this.isMobileView == true) {
        this.startIndex += 1;
      }
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }

  removekeyword(value:any,index:any){
    this.ListOftragetfiltervalues.splice(index, 1);
    const params = this.createparams();
    if(this.ListOftragetfiltervalues.length!=0){
      this.userService.FilterTasks(10, 1, params).subscribe((res:any)=>{
        if(res){
          this.taskData = res.taskdto;
          this.tasklength=res.totalCount
          this.taskData.forEach((element:any) => {
            element.Listofassignes=0
          });
          this.showicon = true
        }
        if(this.isMobileView == false) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
        } else if (this.isMobileView == true) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
        }
      })
    }else{
      this.showicon = false;
      this.loadTask(20, 1, '')
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
    //this.calculateTotalTargetValue()
  }

  // calculateTotalTargetValue(): void {
  //   this.totalValue = this.taskData.reduce((acc, obj) => acc + obj.budget, 0);
  // }

  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      if(this.KanbanView) {
        this.getStepsByPipelineId(this.selectedOption)
      } else {
        this.loadTask(20, 1, '');
      }
      
    } else if (value == 'multiple') {
      this.showicon = false;
    } else if (value == 'target') {
      this.showicon = false;
    }
  }

  RoundAmount(value:any) {
    return value.toFixed(2)
  }

  createparams() {
    const paramList = this.ListOftragetfiltervalues
    let params = new HttpParams()
    paramList.forEach((element:any) => {
      if(element.name=='EndDate'||element.name=='StartDate'){
        const data:any=this.datepipe.transform(element.value, 'dd-MMM-yyyy')
        params = params.set(element.name, data);
      }else{
      params = params.set(element.name, element.value);
      }
    });
    console.log(params.toString()); // Log the parameters for debugging
    return params;
  }

  getDate(value:any){
    if(value==null){
      return ''
    }else{
     return this.datepipe.transform(value, 'yyyy/MM/dd')
    }
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

  getStatusColorClass(status: string) {
    let cssClass = '';
    if (status == 'Assigned') {
      cssClass= 'Assign-color';
    }  else if (status == 'NotAssigned' || status == 'Not_Assigned') {
      cssClass= 'NotAssign-color';
    }  else if (status == 'Completed') {
      cssClass= 'completed-color';
    }  else if (status == 'Canceled') {
      cssClass= 'cancelled-color';
    }  else if (status == 'Canceled') {
      cssClass= 'cancelled-color';
    }  else if (status == 'In Progress'||status == 'In_Progress') {
      cssClass= 'InProgress-color';
    }
    return cssClass;

  }

  getfirstTenCharacters(value:any){
    let firstTenCharacters = value.slice(0, 7);
    return firstTenCharacters 

  }

  changeKanbanView(){
    this.KanbanView=!this.KanbanView
  }

  next(e:any) {
    this.PageNumber=e.pageIndex + 1
    this.loadTask(20, 1, '');
  }

  nextAdvanceSearch(e:any) {
    this.PageNumber=e.pageIndex + 1
    const params = this.createparams();
    this.userService.FilterTasks(10, this.PageNumber, params).subscribe((res:any)=>{
      if(res){
        this.taskData = res.taskdto;
        this.tasklength=res.totalCount
        this.taskData.forEach((element:any) => {
          element.Listofassignes=0
        });
        this.showicon = true
      }
      if(this.isMobileView == false) {
        this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
      } else if (this.isMobileView == true) {
        this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
      }
    })
  }




  // fetch Task data
  loadTask(NumberOfRecord:any, pagenumber:any, search:any){
    this.loader=true
    this.userService.FindAllTask(this.NumberOfRecord,this.PageNumber).subscribe((result:any)=>{
      if(result){
        this.loader=false
        this.taskData = result.taskdto;
        this.tasklength=result.totalCount
        this.taskData.forEach((element:any) => {
          element.Listofassignes=0
        });
      }
    },error=>{
      this.loader=false

    })
  }

  updatepipe(id:any,type:any){
    this.userService.FindStepsByPipelineId(id).subscribe((data)=>{
      data.id=id
      const deleteInitiative = this.dialog.open(UpdateInitiativesKanbanComponent, { 
        data: { data, type: type},
        disableClose: true,
        width: '500px'
      });
      deleteInitiative.afterClosed().subscribe((result: any) => {
        if (result) {
          this.getallFindPipelines()
          this.loadTask(20, 1, '')      
        }
      })
    })
  }
  loadTargets() {
    this.targetDataSource = new MatTableDataSource(this.targetData);
  }




  createNewTask(value:any,data:any){
    const CreateDialog = this.dialog.open(ManageCreateComponent, {
      width: '500px',
      panelClass: ['files'],
      data: { create: value,data:data },
      disableClose: false,
    });

    CreateDialog.afterClosed().subscribe((result: any) => {
      if(result) {
        this.loadTask(20, 1, '')
      } 
    })
  } 

  updateTask(data:any, type:any){
    const CreateDialog = this.dialog.open(CreateTaskComponent, {
      width: '500px',
      panelClass: ['files'],
      data: {data: data, type: type },
      disableClose: false,
    });
    CreateDialog.afterClosed().subscribe((result: any) => {
      if(result) {
        this.loadTask(20, 1, '')
        this.getallFindPipelines()
      } 
    })
  }

  updateMilestone(data:any, type:any){
    const CreateDialog = this.dialog.open(CreateMilestoneComponent, {
      width: '500px',
      panelClass: ['files'],
      data: {data: data, type: type },
      disableClose: false,
    });
    CreateDialog.afterClosed().subscribe((result: any) => {
      if(result) {
        this.loadTask(20, 1, '')
        this.getallFindPipelines()
      } 
    })
  }



  deleteDialogConfirmation(data:any, type:any) {
    const deleteInitiative = this.dialog.open(DeleteCommomComponent, { 
      data: { data, type: type } 
    });
    deleteInitiative.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getallFindPipelines()
        this.loadTask(20, 1, '')      
      }
    })
  }


  TaskInToMilestone(data:any){
  const TaskInToMilestone=this.dialog.open(ConformationComponent, {
    width: '400px',
    autoFocus: false, 
    data: { data: '',type:'ConverttoMilestone' },
    disableClose: true
  });
  TaskInToMilestone.afterClosed().subscribe((result:any)=>{
    this.userService.ConvertTasktoMilestone(
      data.id,
      this.datepipe.transform(data.endDate, 'yyyy/MM/dd')
         ).subscribe((res:any)=>{
      if(res){
        console.log(res)
        if(res.response[0].code=='200'){
          this.messageService.showMessage(' Milestone Created successfully.');
          this.loadTask(20, 1, '')
        }
      }
     })
  })
}







TaskInToEvent(data:any) {
  localStorage.setItem("Screen", 'taskeventconvert');
  const TaskInToEvent = this.dialog.open(TaskInToEventComponent, {
    width: '100%',
    height:'90vh',
    disableClose: true,
    data: { data:data },
  });
  TaskInToEvent.afterClosed().subscribe((result: any) => {
    if (result) {
      this.loadTask(20, 1, '')
    }
  })
}



  opentaskDialog(id:any) {
   const opentaskDialog= this.dialog.open(ViewTaskComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: id
    });
    opentaskDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadTask(10, 1 , '')
      }
    })
  }

  // Search
  AdvanceSearchSingle() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementSingleComponent,
      {
        disableClose: true,
        data: { type: 'Tasks' },
        width: '500px',
      }
    );
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      if (result) {
       this.SearchResult.push(result)
        this.showicon = true;
        this.loadTask(20, 1, this.SearchResult);
      }
    });
  }

} 
