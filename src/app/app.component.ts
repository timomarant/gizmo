declare const jQuery: any;

import { Component, Version, VERSION, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        public electronService: ElectronService,
        private translate: TranslateService,
        private title: Title,
        private router: Router
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
    
    ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }
}
