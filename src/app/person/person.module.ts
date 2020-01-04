import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PersonRoutingModule } from './person-routing.module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonComponent } from './person.component';
import { PersonImportComponent } from './person-import/person-import.component';

@NgModule({
  declarations:
  [
    PersonComponent, 
    PersonListComponent, 
    PersonDetailComponent, 
    PersonImportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PersonRoutingModule
  ]
})
export class PersonModule { }
