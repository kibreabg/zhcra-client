import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemosRoutingModule } from './memos-routing.module';
import { MemoComponent } from './memo/memo.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    MemoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MemosRoutingModule
  ]
})
export class MemosModule { }
