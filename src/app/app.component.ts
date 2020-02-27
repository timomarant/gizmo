declare const jQuery: any;

import { Component, Version, VERSION } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        public electronService: ElectronService,
        private translate: TranslateService,
        private title: Title
    ) {
        translate.setDefaultLang('en');
        console.log('AppConfig', AppConfig);

        if (electronService.isElectron) {
            console.log(process.env);
            console.log('Mode electron');
            console.log('Electron ipcRenderer', electronService.ipcRenderer);
            console.log('NodeJS childProcess', electronService.childProcess);
        } else {
            console.log('Mode web');
        }

        this.title.setTitle(`Verelst Software ${VERSION.full}`);
    }
}
