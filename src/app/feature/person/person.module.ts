import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PersonRoutingModule } from './person-routing.module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonNewComponent } from './person-new/person-new.component';
import { PersonComponent } from './person.component';
import { PersonImportComponent } from './person-import/person-import.component';

@NgModule({
  declarations:
  [
    PersonComponent, 
    PersonListComponent, 
    PersonDetailComponent, 
    PersonNewComponent,
    PersonImportComponent
  ],
  imports: [
    SharedModule,
    PersonRoutingModule
  ]
})
export class PersonModule { }
