import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableComponent } from './data-table/data-table.component';
import { MaterialModule } from './material/material.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedRoutingModule } from './shared-routing.module';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [MatConfirmDialogComponent, DataTableComponent, LayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    SharedRoutingModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MatConfirmDialogComponent,
    DataTableComponent,
    LayoutComponent
  ]
})
export class SharedModule { }
