import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickAccessToolsRoutingModule } from './quick-access-tools-routing.module';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';


@NgModule({
  declarations: [
    QuickAccessToolsComponent
  ],
  imports: [
    CommonModule,
    QuickAccessToolsRoutingModule
  ]
})
export class QuickAccessToolsModule { }
