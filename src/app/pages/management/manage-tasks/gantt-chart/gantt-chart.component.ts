import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
declare var google: any;
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';


@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss']
})
export class GanttChartComponent implements OnInit {
  @ViewChild('editor') editor!: GanttEditorComponent;
  public editorOptions!: GanttEditorOptions;
  public data: any;
  constructor(
    private userService: ManageUsersService,
    @Inject(MAT_DIALOG_DATA) public row: any,
  ) { }
  ngOnInit(): void {
      this.data = this.initialData(this.row);
      this.editorOptions = {
        vTooltipTemplate:false,
        vTooltipDelay:false,
        vUseToolTip:false,
        vCaptionType: 'Complete', // Set the caption type for the Gantt chart
        vUseSingleCell: false, // Use single cell for displaying task information
        vFormat: 'week', // Set the format for displaying dates
        vEditable: false, // Allow editing of tasks in the Gantt chart
        vShowRes: true, // Hide resource column
        vShowCost: false, // Hide cost column
        vShowComp: true, // Hide completion column
        vShowDur: true, // Hide duration column
      };
      

  }
// paraent
  // <span style='font-size:25px;font-weight: 900;color:black;'>&#10835;</span>

  // successors
  // <span style='font-size:25px;font-weight: 900;color:#FFC107'>&#8811;</span>

  // predecessors
  // <span style='font-size:25px;font-weight: 900;color:#007BFF'>&#8810;</span>



  getdepen(value:any){
    let data:any
    if(value.predecessorTaskCount!=0&&value.successorTaskCount!=0&&value.subTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:#FFC107'>&#8811;</span>`+' '+' '+`<span style='font-size:25px;font-weight: 900;color:#007BFF'>&#8810;</span>`+' '+' '+`<span style='font-size:25px;font-weight: 900;color:black;'>&#10835;</span>`
    }else if(value.predecessorTaskCount!=0&&value.subTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:#FFC107'>&#8811;</span>`+' '+' '+`<span style='font-size:25px;font-weight: 900;color:black;'>&#10835;</span>`
    }else if(value.successorTaskCount!=0&&value.subTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:#007BFF'>&#8810;</span>`+' '+' '+`<span style='font-size:25px;font-weight: 900;color:black;'>&#10835;</span>`
    }else if(value.predecessorTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:#FFC107'>&#8811;</span>`
    }else if(value.successorTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:#007BFF'>&#8810;</span>`
    }else if(value.subTaskCount!=0){
      data= `<span style='font-size:25px;font-weight: 900;color:black;'>&#10835;</span>`
    }else{
      data= ''
    }
    return data

  }


  initialData(data:any) {
    let customDurationInHours = 10.5; // For example, 10 hours and 30 minutes
    let x = []
    for (let [index, y] of data.data.entries()) {
      let z = {
        'pID': y.step,
        'pName': y.stepName,
        'pStart': '',
        'pEnd': '',
        'pClass': 'gtaskgreen',
        'pMile': 0,
        'pComp': y.progress+(index*2),
        'pDur': customDurationInHours,
        'pRes':'',
        'customFieldName1': 'Location',
        'customFieldValue1': 'Home',
        'customFieldName2': 'Priority',
        'customFieldValue2': 'High',
        'pGroup': 1,
        'pParent': 0,
        'pOpen': 1,
        'pDepend': '',
        'pHome': 'Your Home Value Here',
        content: 'This is Task 1',
        // Add image and icon properties here
        image: '../../../../../assets/avatar.svg',
        icon: 'fas fa-check'
      };
      x.push(z);
      for (let [index, s] of y.tasksDtos.entries()) {
        let w = {
          'pID': s.taskId,
          // 'pName': s.taskName,
          'pName':  `${this.getdepen(s)+' '+' '+s.taskName}`,
          'pStart': s.startDate, 
          'pEnd': s.endDate,
          'pClass': s.isMilesStone==true?'gtaskblue':'gtaskred',
          'pMile': 0,
          'pComp': s.progress+(index*2),
          'pDur':s.duration,
          'pRes':`${this.Res(s.assignees,0)}<br>${this.Res(s.assignees,1)}<br>${this.Res(s.assignees,2)}`,
          'customFieldName1': 'Location',
          'customFieldValue1': 'Home',
          'customFieldName2': 'Priority',
          'customFieldValue2': 'High',
          'pGroup': 1,
          'pParent': y.step,
          'pOpen': 1,
          // 'pDepend': y.step,
          content: 'This is Task 1',
          // Add image and icon properties here
          image: '../../../../../assets/avatar.svg',
          icon: 'fas fa-check'
        };
        x.push(w);
        if(s.subTaskDtos != null ) {
          for (let [index, v] of s.subTaskDtos.entries()) {
            let m = {
              'pID': v.taskId,
              'pName': `${this.getdepen(v)+' '+' '+v.taskName}`,
              'pStart': v.startDate,
              'pEnd': v.endDate,
              'pClass': 'gtaskyellow',
              'pMile': 0,
              'pComp': v.progress+(index*2),
              'pDur':v.duration,
              'pRes':`${this.Res(v.assignees,0)}<br>${this.Res(v.assignees,1)}<br>${this.Res(v.assignees,2)}`,
              'customFieldName1': 'Location',
              'customFieldValue1': 'Home',
              'customFieldName2': 'Priority',
              'customFieldValue2': 'High',
              'pGroup': 0,
              'pParent': s.taskId,
              'pOpen': 1,
              // 'pDepend': s.taskId,
              content: 'This is Task 1',
              // Add image and icon properties here
              image: '../../../../../assets/avatar.svg',
              icon: 'fas fa-check'
            };
            x.push(m)
            if(v.subTaskDtos != null ) {
              for (let [index, g] of v.subTaskDtos.entries()) {
                let n = {
                  'pID': g.taskId,
                  'pName': `${this.getdepen(g)+' '+' '+g.taskName}`,
                  'pStart': g.startDate,
                  'pEnd': g.endDate,
                  'pClass': 'gtaskyellow',
                  'pMile': 0,
                  'pComp': g.progress+(index*2),
                  'pDur':g.duration,
                  'pRes':`${this.Res(g.assignees,0)}<br>${this.Res(g.assignees,1)}<br>${this.Res(g.assignees,2)}`,
                  'customFieldName1': 'Location',
                  'customFieldValue1': 'Home',
                  'customFieldName2': 'Priority',
                  'customFieldValue2': 'High',
                  'pGroup': 0,
                  'pParent': v.taskId,
                  'pOpen': 1,
                  // 'pDepend': v.taskId,
                  content: 'This is Task 1',
                  // Add image and icon properties here
                  image: '../../../../../assets/avatar.svg',
                  icon: 'fas fa-check'
                };
                x.push(n)
              }
            }
          }
        } 
      }
    }
       return x
  }




   toTitleCase(str:any) {
    return str.toLowerCase().split(' ').map((word:any) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}
  Res(assignees: any,i:number) {
    let value=''
    assignees.forEach((element:any,index:number) => {
      if(index===i){value= element.firstName+' '+element.lastName}
    });
    let titleCaseString = this.toTitleCase(value);
    return titleCaseString
  }




  getclassNames(index:number) {
    let value
    if (index == 0) {
      value= 'gtaskblue'
    } else if (index == 1) {
      value= 'gtaskred'
    } else if (index == 2) {
      value= 'gtaskyellow'
    } else if (index == 3) {
      value= 'gtaskred'
    } else if (index == 4) {
      value= 'gtaskblue'
    } else if (index == 5) {
      value= 'gtaskyellow'
    } else if (index == 6) {
      value= 'gtaskblue'
    } else if (index == 7) {
      value= 'gtaskred'
    } else if (index == 8) {
      value= 'gtaskyellow'
    } else if (index == 9) {
      value= 'gtaskred'
    } else {
      value= 'ggroupblack'
    }
    return value
  }

  

}
