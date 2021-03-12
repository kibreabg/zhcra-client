import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionToolsRoutingModule } from './prescription-tools-routing.module';
import { PrescriptionToolComponent } from './prescription-tool/prescription-tool.component';


@NgModule({
  declarations: [
    PrescriptionToolComponent
  ],
  imports: [
    CommonModule,
    PrescriptionToolsRoutingModule
  ]
})
export class PrescriptionToolsModule { }
