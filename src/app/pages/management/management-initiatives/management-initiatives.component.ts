import { Component, OnInit, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckScreenWidthPercentageService } from 'src/app/core/services/check-screen-width-percentage.service';
import { GanttChartComponent } from '../manage-tasks/gantt-chart/gantt-chart.component';
import { SelectPipelineComponent } from 'src/app/core/components/select-pipeline/select-pipeline.component';
import { CreateInitiativesComponent } from './create-initiatives/create-initiatives.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MatSelectChange } from '@angular/material/select';
import { Board } from '../manage-tasks/kanban-Initiative/kanban-view/model/board.model';
import { ViewInitiativesComponent } from './view-initiatives/view-initiatives.component';
import { ViewTaskComponent } from '../manage-tasks/view-task/view-task.component';
import { CreateTaskComponent } from '../manage-tasks/create-task/create-task.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { UpdateInitiativesKanbanComponent } from './update-initiatives-kanban/update-initiatives-kanban.component';
import { DatePipe } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-management-initiatives',
  templateUrl: './management-initiatives.component.html',
  styleUrls: ['./management-initiatives.component.scss'],
})
export class ManagementInitiativesComponent implements OnInit, PipeTransform {
  selectedOption: string = ''; // Set default value here
  tabnumber!: number;
  showicon: boolean = false;
  activeIndex!:any;
  taskDataSource: any;
  targetDataSource: any;
  columns!: string[];
  KanbanView = false;
  userGroupTargetsColumns!: string[];
  listofFindPipelines:any;
  Initiativescardview:any;
  Initiativeslistview:any;
  Initiativeslistdata:any;
  PageNumber = 1;
  NumberOfRecord = 10;
  Search = '';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader = false;
  Initiativeslength = 0;
  taskData = [];
  userData = [
    {
      name: 'project1',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'Open',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'siva',
      Progress: '10',
      creatorProfile: '',
    },
    {
      name: 'project2',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'In Progress',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'arun',
      Progress: '20',
      creatorProfile: '',
    },
    {
      name: 'project3',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'Closed',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'kumar',
      Progress: '30',
      creatorProfile: '',
    },
    {
      name: 'project4',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'In Progress',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'ravi',
      Progress: '50',
      creatorProfile: '',
    },
    {
      name: 'project5',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'Open',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'MLA',
      Progress: '100',
      creatorProfile: '',
    },
    {
      name: 'project6',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'In Progress',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'Babu',
      Progress: '90',
      creatorProfile: '',
    },
    {
      name: 'project7',
      Description: 'Wellcome',
      Step: 'stepName',
      EndDate: new Date(),
      Status: 'Closed',
      Amount: 100,
      Keywords: 'test1,test2',
      creater: 'sarath',
      Progress: '10',
      creatorProfile: '',
    },
  ];

  targetData = [
    {
      name: 'project1',
      CreaterName: 'demo',
      year: '2018',
      target: '100232',
      percentage: '80',
    },
    {
      name: 'project2',
      CreaterName: 'dummy',
      year: '2019',
      target: '1045232',
      percentage: '67',
    },
    {
      name: 'project3',
      CreaterName: 'sample',
      year: '2020',
      target: '1045632',
      percentage: '45',
    },
    {
      name: 'project4',
      CreaterName: 'testing',
      year: '2021',
      target: '7684532',
      percentage: '100',
    },
  ];
  StepsList: any = [];
  TaskList: any = [];
  subtasklist: any = [];
  size: any;
  width!: number;
  isMobileView!: boolean;
  ListOftragetfiltervalues:any= [];
  displayedItems: any[] = [];
  startIndex: number = 0;
  totalValue: any;
  StepsByPipe!: any[];

  constructor(
    private translate: TranslateService,
    private findScreenpresentage: CheckScreenWidthPercentageService,
    private userService: ManageUsersService,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private resizeService: ResizeService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  ngOnInit(): void {
    this.tabnumber = 0;
    this.columns = [
      'options',
      'Name',
      'Description',
      'Step',
      'EndDate',
      'Status',
      'Progress',
      'Amount',
      'Keywords',
    ];
    this.userGroupTargetsColumns = [
      'options',
      'name',
      'CreaterName',
      'year',
      'target',
      'progress',
    ];
    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }
    this.getallFindPipelines();
    this.getallInitiativesforlistView();
  }

  tabChange(tabIndex: number): void {
    this.PageNumber = 1;
    this.showicon = false;
    this.tabnumber = tabIndex;
    if (tabIndex === 0) {
      this.getallInitiativesforlistView();
    } else if (tabIndex === 1) {
    } else if (tabIndex === 2) {
      this.loadTargets();
    }
  }

  opentaskDialog(id:number) {
    this.dialog.open(ViewTaskComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: id,
    });
  }
  createNewTask(data:any, type:any) {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      data: { data: data, type: type },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  getallFindPipelines() {
    this.userService.FindPipelines().subscribe(
      (result) => {
        if (result) {
          this.listofFindPipelines = result;
          this.selectedOption = result[0].id;
          this.getStepsByPipelineId(result[0].id);
        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  next(e:any) {
    this.PageNumber = e.pageIndex + 1;
    this.getallInitiativesforlistView();
  }

  togglePanel(panel:any, i:number): void {
    if (panel.hasStep == true) {
      console.log(panel);
      this.loader = true;
      this.userService.FindInitiativeStepsByInitiativeId(panel.id).subscribe(
        (result: any) => {
          if (result) {
            this.loader = false;
            result.forEach((element:any) => {
              (element.expanded = false), (element.Initiativeid = panel.id);
            });
            this.StepsList[i] = result;
            panel.expanded = !panel.expanded;
            this.Initiativeslistdata.forEach((p:any) => {
              if (p !== panel) {
                p.expanded = false; // Collapse other panels
              }
            });
          }
          console.log(result);
        },
        (error) => {
          this.loader = false;
        }
      );
    } else {
      this.loader = true;
      console.log(panel);
      this.userService.FindTasksUnderInitiative(panel.id).subscribe(
        (result: any) => {
          if (result) {
            console.log(result);
            this.loader = false;
            result.forEach((element:any) => {
              element.expanded = false;
            });
            this.TaskList[i] = result;
            panel.expanded = !panel.expanded;
            this.StepsList[i].forEach((p:any) => {
              if (p !== panel) {
                p.expanded = false; // Collapse other panels
              }
            });
          }
          console.log(result);
        },
        (error) => {
          this.loader = false;
        }
      );
    }
  }
  StepsPanel(panel:any, i:any): void {
    this.loader = true;
    console.log(panel);
    this.userService
      .FindInitiativeTasksUnderStepsByInitiativeIdAndStepId(
        panel.Initiativeid,
        panel.id
      )
      .subscribe(
        (result: any) => {
          if (result) {
            console.log(result);
            this.loader = false;
            result.forEach((element:any) => {
              element.expanded = false;
            });
            this.TaskList[i] = result;
            panel.expanded = !panel.expanded;
            this.StepsList[i].forEach((p:any) => {
              if (p !== panel) {
                p.expanded = false; // Collapse other panels
              }
            });
          }
          console.log(result);
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  TasksPanel(panel:any, i:any): void {
    this.loader = true;
    console.log(panel);
    this.userService.FindSubTaskbyID(panel.id).subscribe(
      (result: any) => {
        if (result) {
          console.log(result);
          this.loader = false;
          result.forEach((element:any) => {
            element.expanded = false;
          });
          this.subtasklist[i] = result;
          panel.expanded = !panel.expanded;
          this.TaskList[i].forEach((p:any) => {
            if (p !== panel) {
              p.expanded = false; // Collapse other panels
            }
          });
        }
        console.log(result);
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getstepscount(value:any) {
    const data = value.length;
    return data;
  }
  getallInitiativesforlistView() {
    this.loader = true;
    this.userService
      .FindInitiatives(this.NumberOfRecord, this.PageNumber, this.Search)
      .subscribe(
        (result: any) => {
          if (result) {
            this.loader = false;
            this.Initiativeslistview = new MatTableDataSource(result.data);
            this.Initiativeslistdata = result.data;
            this.Initiativeslistdata.forEach((element:any) => {
              element.expanded = false;
            });
            this.Initiativeslength = result.totalItems;
          }
        },
        (error) => {
          this.loader = false;
        }
      );
  }

  transform(value: any, ...args: any[]) {
    if (typeof value == 'number') {
      let ammount = value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      let ammount1 = ammount.replace(/,/g, ' ');
      let ammount2 = ammount1.replace('$', ' ');
      let ammount3 = ammount2.replace('.00', ' ');
      let ammount4 = ammount3 == '0' ? '' : ammount3 + ' ' + '€';
      return ammount4.toString();
    } else {
      return value == '0' ? '' : value;
    }
  }

  onSelectionChange(event: MatSelectChange) {
    this.getStepsByPipelineId(event.value);
  }

  getKeywords(row:any) {
    const data = row.split(',');
    console.log(data);
    return data;
  }

  get30TenCharacters(value:any) {
    if (value == null) {
      return '';
    } else if (value.length > 30) {
      let firstTenCharacters = value.slice(0, 30);
      return firstTenCharacters + '...';
    } else {
      return value;
    }
  }

  get20TenCharacters(value:any) {
    if (value.length > 10) {
      let firstTenCharacters = value.slice(0, 10);
      return firstTenCharacters + '...';
    } else {
      return value;
    }
  }

  get5TenCharacters(value:any) {
    if (value.length > 5) {
      let firstTenCharacters = value.slice(0, 5);
      return firstTenCharacters + '...';
    } else {
      return value;
    }
  }

  get50Characters(value:any) {
    if (value.length > 20) {
      let firstTenCharacters = value.slice(0, 20);
      return firstTenCharacters + '...';
    } else {
      return value;
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

  createInitiatives(data:any, type:any) {
    const creaInitiatives = this.dialog.open(CreateInitiativesComponent, {
      data: { data: data, type: type },
      disableClose: true,
      width: this.findScreenpresentage.screenpercentage(),
    });
    creaInitiatives.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.getallFindPipelines();
        this.getallInitiativesforlistView();
      }
    });
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteInitiative = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteInitiative.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getallFindPipelines();
        this.getallInitiativesforlistView();
      }
    });
  }

  updatepipe(id:any, type:any) {
    this.userService.FindStepsByPipelineId(id).subscribe((data) => {
      data.id = id;
      const deleteInitiative = this.dialog.open(
        UpdateInitiativesKanbanComponent,
        {
          data: { data, type: type },
          disableClose: true,
          width: '500px',
        }
      );
      deleteInitiative.afterClosed().subscribe((result: any) => {
        if (result) {
          this.getallFindPipelines();
          this.getallInitiativesforlistView();
        }
      });
    });
  }

  showinitiativesdetails(data:any) {
    const showInitiatives = this.dialog.open(ViewInitiativesComponent, {
      data: { data: data },
      disableClose: true,
      width: '500px',
    });
    showInitiatives.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  getStepsByPipelineId(id:any) {
    this.loader = true;
    this.userService.FindStepsByPipelineId(id).subscribe(
      (result: any) => {
        if (result) {
          this.loader = false;
          console.log(result);
          var columns :any= [];
          var columnids:any = [];
          result.forEach((element:any) => {
            columnids.push(element.step.toString());
          });
          result.forEach((element:any, index:any) => {
            columns.push({
              name: element.stepName,
              id: element.step.toString(),
              columnids: columnids,
              tasks: [],
            });
            if (element.initiatives != null) {
              element.initiatives.forEach((res:any) => {
                columns[index].tasks.push(res);
              });
            }
          });
          console.log('coloumnssss', columns);
          this.Initiativescardview = new Board('Test Board', columns);
          this.StepsByPipe = columns
        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  showGanttView(row:any) {
    console.log(row);
    this.userService.FindGanttViewTasks(row.id).subscribe((result) => {
      this.dialog.open(GanttChartComponent, {
        data: { data: result },
        disableClose: true,
        width: '100%',
        // position: { left: '280px' },
      });
    });
  }
  searchInitiativeKanban() {
    const SelectPipeline = this.dialog.open(SelectPipelineComponent, {
      disableClose: true,
      width: '500px',
      data: {selectedOption: this.selectedOption, stepsByPipe: this.StepsByPipe, type: 'initiativeKanbanscreen' },
    });
    SelectPipeline.afterClosed().subscribe((result) => {
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
        let filteredArray = ListOftragetfiltervalues.filter((element:any) => {
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
        const params = this.createparams();
        this.userService.FilterKanbanInitiatives(params).subscribe((result: any) => {
          if (result) {
            console.log(result);
            var columns :any= [];
            var columnids :any= [];
            result.forEach((element:any) => {
              columnids.push(element.step.toString());
            });
            result.forEach((element:any, index:any) => {
              columns.push({
                name: element.stepName,
                id: element.step.toString(),
                columnids: columnids,
                tasks: [],
              });
              if (element.initiatives != null) {
                element.initiatives.forEach((res:any) => {
                  columns[index].tasks.push(res);
                });
              }
            });
            console.log('coloumnssss', columns);
            this.Initiativescardview = new Board('Test Board', columns);
            this.showicon = true;
          }
        })

      }
    });
  }

  searchandfiltrer() {
    const SelectPipeline = this.dialog.open(SelectPipelineComponent, {
      disableClose: true,
      width: '500px',
      data: { type: 'initiativescreen' },
    });
    SelectPipeline.afterClosed().subscribe((result) => {
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
        let filteredArray = ListOftragetfiltervalues.filter((element:any) => {
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
        const params = this.createparams();
        this.userService.FilterInitiatives(10, 1, params).subscribe((result: any) => {
          if (result) {
            console.log(result);
            this.Initiativeslistview = new MatTableDataSource(result.data);
            this.Initiativeslistdata = result.data;
            this.Initiativeslistdata.forEach((element:any) => {
              element.expanded = false;
            });
            this.Initiativeslength = result.totalItems;
            this.showicon = true;
          }
          if(this.isMobileView == false) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
          } else if (this.isMobileView == true) {
            this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
          }
          this.calculateTotalTargetValue()
        });
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
      this.userService.FilterInitiatives(10, 1, params).subscribe((result: any) => {
        if (result) {
          console.log(result);
          this.Initiativeslistview = new MatTableDataSource(result.data);
          this.Initiativeslistdata = result.data;
          this.Initiativeslistdata.forEach((element:any) => {
            element.expanded = false;
          });
          this.Initiativeslength = result.totalItems;
          this.showicon = true;
        }
        if(this.isMobileView == false) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
        } else if (this.isMobileView == true) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
        }
        this.calculateTotalTargetValue()
      });
    }else{
      this.showicon = false;
      this.getallInitiativesforlistView();
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
    this.calculateTotalTargetValue()
  }

  calculateTotalTargetValue(): void {
    this.totalValue = this.Initiativeslistdata.reduce((acc:any, obj:any) => acc + obj.budget, 0);
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

  getDate(value:any) {
    if (value == null) {
      return '';
    } else {
      return this.datepipe.transform(value, 'yyyy/MM/dd');
    }
  }
  getstatus(value:any) {
    return value.replace('_', ' ');
  }

  getStatusColorClass(status:any) {
    let cssclass=''
    if (
      status == 'Not Started' ||
      status == 'NotAssigned' ||
      status == 'Not_Assigned'
    ) {
      cssclass= 'Assign-color';
    } else if (status == 'In Progress' || status == 'Assigned') {
      cssclass= 'InProgress-color';
    } else if (status == 'Completed') {
      cssclass= 'completed-color';
    } else if (status == 'Canceled') {
      cssclass= 'cancelled-color';
    } else if (status == 'Failed' || status == 'Late') {
      cssclass= 'Failed-color';
    }
    return cssclass
  }

  changeKanbanView(event:any) {
    this.KanbanView = !this.KanbanView;
  }

  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      if(this.KanbanView) {
        this.getStepsByPipelineId(this.selectedOption)
      } else {
        this.getallInitiativesforlistView();

      }
    } else if (value == 'multiple') {
      this.showicon = false;
    } else if (value == 'target') {
      this.showicon = false;
    }
  }

  loadTargets() {
    this.loader = true;
    this.targetDataSource = new MatTableDataSource(this.targetData);
    this.loader = false;
  }
}
