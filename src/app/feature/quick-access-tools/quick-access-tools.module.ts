import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickAccessToolsRoutingModule } from './quick-access-tools-routing.module';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    QuickAccessToolsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    QuickAccessToolsRoutingModule
  ]
})
export class QuickAccessToolsModule { }
