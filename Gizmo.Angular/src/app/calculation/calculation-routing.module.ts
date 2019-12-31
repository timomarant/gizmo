import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CalculationListComponent } from './calculation-list.component';

const routes: Routes = [
  {
    path: 'calculation',
    component: CalculationListComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculationRoutingModule {}
