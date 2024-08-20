import { KanbanCard } from "./kanban-card.model";

export class Column {
    constructor(public name: string, public id: string, public columnids: string, public initiativesCount:number ,public tasks:[]) {}
  }
  