import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';

const material = [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule]

@NgModule({
  imports: [material],
  exports: [material],
  declarations: []
})
export class MaterialModule { }
