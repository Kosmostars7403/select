import {OverlayModule} from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';



@NgModule({
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class SelectModule { }
