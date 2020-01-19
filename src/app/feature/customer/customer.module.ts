import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { CustomerRoutingModule } from './cutomer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
// import { AgmCoreModule } from '@agm/core/core.module';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerEditComponent
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmDecHs1UWI64oUe8kVIvnUYTwfrsFX0E'
    }),
  ]
})
export class CustomerModule { }
