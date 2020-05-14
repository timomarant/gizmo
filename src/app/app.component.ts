import { Component, Version, VERSION, OnInit, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { AppConfig } from '../environments/environment';
import { ElectronService, NotificationService, ToastService } from './core/services';

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
        public toastService: ToastService,
        private translate: TranslateService,
        private notificationService: NotificationService,
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

    isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

    ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        //this.toastService.show
        //success
        //this.notificionService.successMessageChanges$.subscribe(msg => this.successMessage = msg);
        //this.notificionService.successMessageChanges$.pipe(debounceTime(2000)).subscribe(() => this.successMessage = '');
        
        //info
        // this.notificationService.infoMessageChanges$.subscribe(msg => this.infoMessage = msg);
        // this.notificationService.infoMessageChanges$.pipe(debounceTime(5000)).subscribe(() => this.infoMessage = '');

        //error
        this.notificationService.dangerMessageChanges$.subscribe(msg => this.dangerMessage = msg);
    }
}
