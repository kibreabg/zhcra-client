import { EventEmitter, Output } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableDataSource } from './data-table-datasource';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource: DataTableDataSource;
  @Output() rowId = new EventEmitter<number>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [];

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  onRowSelect(row) {
    this.rowId.emit(row.id);
  }

  onReloadGrid(datasource) {
    this.dataSource = new DataTableDataSource(datasource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    //Push the new datasource in the displayedColumns array, if they aren't found already
    for (let column in datasource[0]) {
      if (this.displayedColumns.indexOf(column) == -1)
        this.displayedColumns.push(column);
    }
    if (this.displayedColumns.indexOf("Action") == -1)
      this.displayedColumns.push("Action");
    const indexOfId = this.displayedColumns.indexOf("id");
    this.displayedColumns.splice(indexOfId, 1);

  }
}
