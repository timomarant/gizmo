import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { SearchComponent } from './components/search/search.component';

@NgModule({
    declarations: [
        WebviewDirective,
        PageNotFoundComponent,
        SearchComponent
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
        SearchComponent
    ]
})
export class SharedModule { }
