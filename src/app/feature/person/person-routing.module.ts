import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PersonComponent } from './person.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonImportComponent } from './person-import/person-import.component';

const routes: Routes = [
  {
    path: 'person',
    component: PersonComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: PersonListComponent
      },
      {
        path: ':id/edit',
        component: PersonEditComponent
      },
      {
        path: ':id',
        component: PersonDetailComponent
      },
      {
        path: 'import',
        component: PersonImportComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
