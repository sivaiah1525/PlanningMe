import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  value: number;
}

export const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Hydrogen', value: 1.0079 },
  {  name: 'Helium', value: 4.0026 },
  {  name: 'Lithium', value: 6.941 },
 
];

@Component({
  selector: 'pm-pivot-table',
  templateUrl: './pivot-table.component.html',
  styleUrls: ['./pivot-table.component.scss'],
})
export class PivotTableComponent implements OnInit {

  // Table filter
  dataSource: any;
  displayedColumns!: string[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private matPaginator: MatPaginatorIntl) { }

  ngOnInit() {
    this.displayedColumns = ['name', 'value'];
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.matPaginator.changes.subscribe(res => { console.log(res) });
    this.matPaginator.lastPageLabel = '';
    this.matPaginator.previousPageLabel = '';
    this.matPaginator.nextPageLabel = '';
    this.matPaginator.firstPageLabel = '';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
