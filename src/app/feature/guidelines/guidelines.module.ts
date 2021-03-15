import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidelinesRoutingModule } from './guidelines-routing.module';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { SharedModule } from '@shared/shared.module';
import { LayoutComponent } from '@shared/layout/layout.component';


@NgModule({
  declarations: [
    GuidelinesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GuidelinesRoutingModule
  ]
})
export class GuidelinesModule { }
