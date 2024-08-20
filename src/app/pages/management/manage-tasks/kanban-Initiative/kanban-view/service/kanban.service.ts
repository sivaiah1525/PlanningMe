import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KanbanCard } from '../model/kanban-card.model';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private kanbanDataSubject = new BehaviorSubject<{
    columns: string[];
    data: KanbanCard[][];
  }>({
    columns: ['To Do', 'In Progress', 'Done'],
    data: [
      [
        { id: '1', title: 'Task 1', content: 'Description for Task 1',progress:20,Profile:'' }
      ,
        { id: '2', title: 'Task 2', content: 'Description for Task 2',progress:40,Profile:''},
      ],
      [
        { id: '3', title: 'Task 3', content: 'Description for Task 3', progress:50,Profile:''},
        { id: '4', title: 'Task 4', content: 'Description for Task 4',progress:70,Profile:'' },
      ],
      [
        { id: '5', title: 'Task 5', content: 'Description for Task 5',progress:90,Profile:'' },
        { id: '6', title: 'Task 6', content: 'Description for Task 6',progress:50,Profile:'' },
      ],
    ],
  });

  kanbanData$ = this.kanbanDataSubject.asObservable();

  setKanbanData(data: { columns: string[]; data: KanbanCard[][] }): void {
    this.kanbanDataSubject.next(data);
  }
}
