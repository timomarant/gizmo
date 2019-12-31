import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactListComponent } from './contact-list.component';
import { ContactDetailComponent } from './contact-detail.component';
import { ContactImportComponent } from './contact-import.component';

const routes: Routes = [
  {
    path: 'contact',
    component: ContactComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ContactListComponent
      },
      {
        path: 'detail/:id',
        component: ContactDetailComponent
      },
      {
        path: 'import',
        component: ContactImportComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
