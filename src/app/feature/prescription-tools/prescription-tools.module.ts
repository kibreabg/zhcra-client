import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionToolsRoutingModule } from './prescription-tools-routing.module';
import { PrescriptionToolComponent } from './prescription-tool/prescription-tool.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    PrescriptionToolComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PrescriptionToolsRoutingModule
  ]
})
export class PrescriptionToolsModule { }
