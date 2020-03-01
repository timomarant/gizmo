import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { throwIfAlreayLoaded } from './module-import-guard';
import { CustomerService } from './services/customer.service';
import { GizmoAppErrorHandlerService } from './services/gizmo-app-error-handler.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgbModule
    ],
    providers: [
        CustomerService,
        { provide: ErrorHandler, useClass: GizmoAppErrorHandlerService }
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreayLoaded(parentModule, 'CoreModule');
    }
}
