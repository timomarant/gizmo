import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactListComponent } from './contact-list.component';
import { ContactDetailComponent } from './contact-detail.component';
import { ContactComponent } from './contact.component';
import { ContactImportComponent } from './contact-import.component';

@NgModule({
  declarations:
  [
    ContactComponent, 
    ContactListComponent, 
    ContactDetailComponent, 
    ContactImportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
