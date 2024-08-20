import { Component, Input, Output, EventEmitter, OnInit, PipeTransform } from '@angular/core';
import { KanbanCard } from '../kanban-view/model/kanban-card.model';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
})
export class KanbanCardComponent implements OnInit,PipeTransform{
  @Input() card: any;
  @Output() edit = new EventEmitter<KanbanCard>();
  @Output() delete = new EventEmitter<string>();
  progressValue =60;
  customColor = 'purple';
   progress: number = 60;
   radius: number = 40;  
   StatusColorClass:any;
 ngOnInit() {
  console.log("carddddd",this.card);
 }
  onEditClick(): void {
    this.edit.emit(this.card);
  }

  onDeleteClick(): void {
    this.delete.emit(this.card.id);
  }
  getStatusColorClass(status: string) {
    if (status == 'Not Started'||status=='NotAssigned') {
      this.StatusColorClass= 'Assign-color';
    }  else if (status == 'In Progress'||status=='Assigned') {
      this.StatusColorClass= 'InProgress-color';
    }  else if (status == 'Completed') {
      this.StatusColorClass= 'completed-color';
    }  else if (status == 'Canceled') {
      this.StatusColorClass= 'cancelled-color';
    } else if (status == 'Failed'||status == 'Late') {
      this.StatusColorClass= 'Failed-color';
    } 

    return this.StatusColorClass
  
  }

  transform(value: any, ...args: any[]) {
    if (typeof (value) == 'number') {
      let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
      let ammount1 = ammount.replace(/,/g, ' ')
      let ammount2 = ammount1.replace('$', ' ')
      let ammount3 = ammount2.replace('.00', ' ')
      let ammount4 = ammount3 
      return ammount4
    } else {
      return value
    }
  } 
 

  getKeywords(row:any){
    const data=row.split(',')
    console.log(data)
    return data
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
  calculateDashoffset(progress:number) {
    const percent = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return this.circumference - (percent / 100) * this.circumference;
  }
}
