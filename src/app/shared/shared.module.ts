import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';

@NgModule({
    declarations: [
        WebviewDirective,
        PageNotFoundComponent
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
        WebviewDirective,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ]
})
export class SharedModule { }
