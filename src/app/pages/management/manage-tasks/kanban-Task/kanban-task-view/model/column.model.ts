import { KanbanCard } from "./kanban-card.model";

export class Column {
    constructor(public name: string, public id: string, public tasks?:any) {}
  }
  