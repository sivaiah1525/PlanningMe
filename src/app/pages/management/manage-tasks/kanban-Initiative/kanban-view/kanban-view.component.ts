import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { KanbanCard } from '../kanban-view/model/kanban-card.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from '../kanban-view/model/board.model';
import { Column } from '../kanban-view/model/column.model';
import { KanbanService } from './service/kanban.service';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.scss']
})
export class KanbanViewComponent implements OnInit,PipeTransform {
  @Input() Initiativescardview: any;


  constructor(private kanbanDataService: KanbanService) {}

  ngOnInit() {
    console.log(this.Initiativescardview)
  }

  deleteCard(cardId: string) {}

  editCard(card: KanbanCard) {}
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
  public dropGrid(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.Initiativescardview.columns,
      event.previousIndex,
      event.currentIndex
    );
  }

  public drop(event: CdkDragDrop<[]>) {
    if (event.previousContainer == event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex 
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getTotalAMount(data:any) {
    console.log("cardddettaill", data)
    var totalAmount = 0;
    data.forEach((element:any) => {
      totalAmount = totalAmount + element.budget
    });
    return   this.transform(totalAmount);
  }


  getTotalInitiative(data:any) {
    return data.length
  }

  getfirstTenCharacters(value:any){
    if(value.length > 30) {
      let firstTenCharacters = value.slice(0, 30);
      return firstTenCharacters +'...'
    } else {
      return value
    }
    
  }
}

