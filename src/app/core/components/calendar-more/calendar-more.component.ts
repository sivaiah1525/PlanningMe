import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ExportPlanningModalComponent } from '../export-planning-modal/export-planning-modal.component';
import { RoadmapProposalModalComponent } from '../roadmap-proposal-modal/roadmap-proposal-modal.component';
import { CategoriesModalComponent } from './../categories-modal/categories-modal.component';
import { FilterModalComponent } from './../filter-modal/filter-modal.component';
import { GroupPlanningModalComponent } from './../group-planning-modal/group-planning-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProspectsearchComponent } from '../prospectsearch/prospectsearch.component';
import { CreateEventComponent } from 'src/app/pages/calendar/create-event/create-event.component';
import { OtherPepoleComponent } from '../other-pepole/other-pepole.component';
import { PlanningSynchronisationComponent } from 'src/app/pages/calendar/planning-synchronisation/planning-synchronisation.component';
import { TranslateService } from '@ngx-translate/core';
import { MapfilterService } from '../mapfilter.service';
@Component({
  selector: 'pm-calendar-more',
  templateUrl: './calendar-more.component.html',
  styleUrls: ['./calendar-more.component.scss'],
})
export class CalendarMoreComponent implements OnInit {

  @Input()
  dateformat: any;
  @Input()
  lastdateformat: any;
  @Input()
  carte!: boolean
  @Input()
  OtherpeplePlanning: boolean = false
  @Input()
  Otherpeplemap: boolean = false
  filterDialog!: MatDialogRef<FilterModalComponent>;
  confvalue: any;
  configuresubscription: any;
  AdminStatis: any;
  isManager:any;

  constructor(
    private dialog: MatDialog,
    public MapfilterService: MapfilterService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
   this.AdminStatis = localStorage.getItem("isAdmin"); 
    this.isManager=localStorage.getItem("isManager"); 


  }

  ngOnInit() {
    console.log(this.OtherpeplePlanning)
    this.confvalue = 1;
    this.configuresubscription = this.MapfilterService.configvalue.subscribe((data) => {
      console.log(data);
      this.confvalue = data;
    });
    console.log(this.carte);

  }


  OtherPepole(name:any) {
    this.dialog.open(OtherPepoleComponent, {
      width: '600px',
      data: { screenType: name }
    })
  }
  SynchronisationComponent() {
    this.dialog.open(PlanningSynchronisationComponent, {
      width: '500px',
      data: { screenType: 'Moreoption' }
    })
  }



  exportPlanning() {
    const exportPlanningDialog = this.dialog.open(ExportPlanningModalComponent, {
      width: '500px'
    });

    exportPlanningDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  simulationEvent() {
    const simulationEventDialog = this.dialog.open(CreateEventComponent, {
      data: { screenType: 'CreateSimulationEvent' },
      width: '500px',
      disableClose: true
    });

    simulationEventDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  groupPlanning() {
    const groupPlanningDialog = this.dialog.open(GroupPlanningModalComponent, {
      width: '500px'
    });

    groupPlanningDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  filter() {
    console.log(this.dateformat, 'first');
    this.filterDialog = this.dialog.open(FilterModalComponent, {
      width: '500px',
      data: { startdate: this.dateformat, enddate: this.lastdateformat }
    });

    this.filterDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  categoryFilter() {
    const categoryFilterDialog = this.dialog.open(CategoriesModalComponent, {
      width: '500px'
    });

    categoryFilterDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  roadMapProposal() {
    const roadMapProposalDialog = this.dialog.open(RoadmapProposalModalComponent, {
      width: '500px'
    });

    roadMapProposalDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }




  mapConfiguration(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '500px',
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }


  openconfiguration() {
    const filterDialog = this.dialog.open(ProspectsearchComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
  }


  onDataChange(data:any) {
    console.log(data);
    this.confvalue = data.value;
  }

  configuration() {
    console.log(this.confvalue)
    this.MapfilterService.mapconfigureDetails$.next(this.confvalue);
    this.dialog.closeAll();
  }
}
