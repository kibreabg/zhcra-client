import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidelineTypesRoutingModule } from './guideline-types-routing.module';
import { GuidelineTypeComponent } from './guideline-type/guideline-type.component';


@NgModule({
  declarations: [
    GuidelineTypeComponent
  ],
  imports: [
    CommonModule,
    GuidelineTypesRoutingModule
  ]
})
export class GuidelineTypesModule { }
