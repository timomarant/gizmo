import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreayLoaded } from './guards/module-import-guard';

@NgModule({
    imports: [
        CommonModule
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreayLoaded(parentModule, 'CoreModule');
    }
}
