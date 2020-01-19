import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../../shared/shared.module';
import { PersonRoutingModule } from './person-routing.module';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonComponent } from './person.component';
import { PersonImportComponent } from './person-import/person-import.component';

@NgModule({
  declarations:
  [
    PersonComponent, 
    PersonListComponent, 
    PersonDetailComponent, 
    PersonEditComponent,
    PersonImportComponent
  ],
  imports: [
    SharedModule,
    PersonRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmDecHs1UWI64oUe8kVIvnUYTwfrsFX0E'
    }),
  ]
})
export class PersonModule { }
