import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { PurchaseInvoiceListComponent } from './purchase-invoice-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PurchaseInvoiceListComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
