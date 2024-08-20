import { Component } from '@angular/core';
import { Node, Path, Position, Size } from './models/model';
import { IOUtils } from './utils/io.utils';
import { MatDialog } from '@angular/material/dialog';
import { AutomationActionsListComponent } from './components/automation-actions-list/automation-actions-list.component';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { AutomationService } from 'src/app/core/services/automation.service';

@Component({
  selector: 'app-lead-automation',
  templateUrl: './lead-automation.component.html',
  styleUrls: ['./lead-automation.component.scss'],
})
export class LeadAutomationComponent {
  nodes: Node[];
  paths: Path[];
  zoomFactor: number = 1.0; // Initial zoom factor

  private nodeSize: Size = { width: 50, height: 50 };
  private nodePositions: { [id: number]: Position } = {};
  private newNode: any;

  constructor(
    private dialog: MatDialog,
    public Automation: AutomationService
  ) {
    this.nodePositions = { 1: { x: 600, y: -500 } };
    this.nodes = [];
    this.paths = [];
  }

  handleDragMoved(event: CdkDragMove, node:any) {
    const newPosition = IOUtils.getElementPosition(
      event.source.element.nativeElement
    );
    console.log(newPosition)
    console.log(node)
    // this.nodes.forEach(element=>{
    //   if(Number(element.id)===Number(node.id)){
    //     element.initialPosition=newPosition
    //   }
    // })
  }

  openPopup(node: any, type:any) {
    this.ActionsList(node, type);
  }

  handleChangeNodePosition(event: { id: number; position: Position }) {
    this.nodePositions[event.id] = event.position;
    this.nodes.forEach((element) => {
      if (Number(element.id) === Number(event.id)) {
        element.initialPosition = event.position;
      }
    });
  }

  getD(path: Path) {
    console.log(path)
    const startPosition = this.getNodePosition(path.from, 'OUTPUT');
    const endPosition = this.getNodePosition(path.to, 'INPUT');
    return (
      startPosition && endPosition && IOUtils.getD(startPosition, endPosition)
    );
  }

  private getNodePosition(
    nodeId: number,
    socketType: 'INPUT' | 'OUTPUT'
  ): Position | undefined {
    const position = this.nodePositions[nodeId];
    if (!position) {
      return undefined;
    }
    if (socketType === 'INPUT') {
      return IOUtils.setOffset(position, { x: 0, y: this.nodeSize.height / 2 });
    }
    return IOUtils.setOffset(position, {
      x: this.nodeSize.width,
      y: this.nodeSize.height / 2,
    });
  }

  Deletenodepotiont(event: any) {
    console.log(event);
  }
  Updatenodepotiont(event: any) {
    console.log(event);
  }

  ActionsList(event:any, type:any) {
    console.log(event);
    const ActionsList = this.dialog.open(AutomationActionsListComponent, {
      disableClose: true,
      width: '500px',
      data: { type: type, data: event.data },
    });
    ActionsList.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        console.log(event);
        this.paths.push({ from: event.id, to: this.nodes.length + 1 });
        const index = this.nodes.length + 1;
        //  this.nodePositions[index]={ x:event.node.initialPosition.x+60, y:event.node.initialPosition.y+150 }
        this.nodePositions[index] = { x: 600, y: -500 };
        this.nodes.push({
          id: this.nodes.length + 1,
          color: result?.color,
          data: result?.data,
          type: result?.type,
          outputSocket: {},
          initialPosition: this.nodePositions[this.nodes.length + 1],
        });
        this.nodePositions[event.id] = event.position;
      }
      console.log(this.nodes);
    });
  }

  startworkflow() {
    const ActionsList = this.dialog.open(AutomationActionsListComponent, {
      disableClose: true,
      width: '500px',
      data: { type: 'CreatePlan' },
    });
    ActionsList.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.paths.push({ from: 0, to: 1 });
        this.nodes.push({
          id: 1,
          color: result?.color,
          data: result?.data,
          type: result?.type,
          outputSocket: {},
          initialPosition: this.nodePositions[1],
        });
      }
    });
  }

  getFinalflowchart() {
    this.nodes.forEach((element, index) => {
      element.initialPosition = this.nodePositions[index + 1];
    });

    let privisestepid = 0;
    if (this.nodes[0].type == 'CreatePlan') {
      this.Automation.CreateScenario(this.CreateScenariodata(this.nodes[0])).subscribe((result)=>{
        if(result){
          this.nodes.forEach((element) => {
            privisestepid = element.id;
            if (element.type == 'CreateContiction') {
              this.Automation.CreateScenarioConditions(this.CreateScenarioConditions((element:any)=>{
                if(result){

                }
              }))
            }
            if (element.type == 'CreateAction') {
              this.Automation.CreateScenarioActions(this.CreateScenarioActions((element:any)=>{
                if(result){
                  
                }
              }))
            }
          });
        }
      })

    }
    console.log(this.nodes);
    console.log(this.nodePositions);
  }

  CreateScenariodata(data:any) {
    const fomatdata = {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'string',
      description: 'string',
      scenarioEventId: 0,
      keyword: 'string',
      isActive: true,
      created: '2024-07-16T07:33:24.668Z',
      conditions: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          previousStep: 0,
          step: 0,
          x: 'string',
          y: 'string',
          scheduledDateAndTime: '2024-07-16T07:33:24.668Z',
          excludeDates: ['2024-07-16T07:33:24.668Z'],
          excludeDays: ['string'],
          duration: 0,
          period: 0,
          scenarioId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          conditionDropDownList: 'string',
          conditionParameter: 'string',
          conditionComparison: 'string',
          dataType: 'string',
          value: 'string',
          isTag: true,
          isActive: true,
          status: 0,
          created: '2024-07-16T07:33:24.668Z',
        },
      ],
      actions: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'string',
          description: 'string',
          scenarioId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          previousStep: 0,
          step: 0,
          x: 'string',
          y: 'string',
          isActive: true,
          eventName: 'string',
          api: 'string',
          status: 0,
          created: '2024-07-16T07:33:24.668Z',
        },
      ],
    };
    return fomatdata;
  }

   CreateScenarioActions(data:any){
    const formatdata=[
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "description": "string",
        "scenarioId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "previousStep": 0,
        "step": 0,
        "x": "string",
        "y": "string",
        "isActive": true,
        "eventName": "string",
        "api": "string",
        "status": 0,
        "created": "2024-07-16T07:34:44.502Z"
      }
    ]
    return formatdata
  }

  CreateScenarioConditions(data:any){
    const formatdata=[
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "previousStep": 0,
        "step": 0,
        "x": "string",
        "y": "string",
        "scheduledDateAndTime": "2024-07-16T07:36:39.178Z",
        "excludeDates": [
          "2024-07-16T07:36:39.178Z"
        ],
        "excludeDays": [
          "string"
        ],
        "duration": 0,
        "period": 0,
        "scenarioId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "conditionDropDownList": "string",
        "conditionParameter": "string",
        "conditionComparison": "string",
        "dataType": "string",
        "value": "string",
        "isTag": true,
        "isActive": true,
        "status": 0,
        "created": "2024-07-16T07:36:39.178Z"
      }
    ]
    return formatdata
  }
}
