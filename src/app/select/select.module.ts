import {OverlayModule} from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { OptionComponent } from './option/option.component';



@NgModule({
  declarations: [
    SelectComponent,
    OptionComponent
  ],
  exports: [
    SelectComponent,
    OptionComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class SelectModule { }
