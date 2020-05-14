import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { SearchComponent } from './components/search/search.component';
import { StarComponent } from './components/star/star.component';

@NgModule({
    declarations: [
        WebviewDirective,
        PageNotFoundComponent,
        SearchComponent,
        StarComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        WebviewDirective,
        SearchComponent,
        StarComponent
    ]
})
export class SharedModule { }
