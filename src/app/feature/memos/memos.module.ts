import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemosRoutingModule } from './memos-routing.module';
import { MemoComponent } from './memo/memo.component';


@NgModule({
  declarations: [
    MemoComponent
  ],
  imports: [
    CommonModule,
    MemosRoutingModule
  ]
})
export class MemosModule { }
