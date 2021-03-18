import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidelineTypesRoutingModule } from './guideline-types-routing.module';
import { GuidelineTypeComponent } from './guideline-type/guideline-type.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    GuidelineTypeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GuidelineTypesRoutingModule
  ]
})
export class GuidelineTypesModule { }
