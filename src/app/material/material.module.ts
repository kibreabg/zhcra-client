import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatToolbarModule } from '@angular/material';

const material = [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatToolbarModule]

@NgModule({
  imports: [material],
  exports: [material],
  declarations: []
})
export class MaterialModule { }
