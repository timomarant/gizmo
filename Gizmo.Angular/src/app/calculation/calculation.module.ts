import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculationListComponent } from './calculation-list.component';
import { CalculationRoutingModule } from './calculation-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CalculationListComponent],
  imports: [
    CommonModule,
    SharedModule,
    CalculationRoutingModule
  ]
})
export class CalculationModule { }
