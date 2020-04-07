import { Component, Version, VERSION, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './core/services';
import { NotificationService } from './core/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    successMessage: string;
    infoMessage: string;
    dangerMessage: string;

    constructor(
        public electronService: ElectronService,
        private translate: TranslateService,
        private notificionService: NotificationService,
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

    get marginTop(): number {
        if (this.successMessage || this.infoMessage || this.dangerMessage) {
            return 129;
        } else {
            return 79;
        }
    }

    ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        //success
        this.notificionService.successMessageChanges$.subscribe(msg => this.successMessage = msg);
        this.notificionService.successMessageChanges$.pipe(debounceTime(2000)).subscribe(() => this.successMessage = '');
        
        //info
        this.notificionService.infoMessageChanges$.subscribe(msg => this.infoMessage = msg);
        this.notificionService.infoMessageChanges$.pipe(debounceTime(5000)).subscribe(() => this.infoMessage = '');

        //error
        this.notificionService.dangerMessageChanges$.subscribe(msg => this.dangerMessage = msg);
    }
}
