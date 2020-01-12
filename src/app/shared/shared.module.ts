import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
