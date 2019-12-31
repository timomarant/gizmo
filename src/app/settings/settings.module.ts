import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDetailComponent } from './settings-detail.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SettingsDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
