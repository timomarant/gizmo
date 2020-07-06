import { Component, VERSION, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { ElectronService, NotificationService, ToastService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  successMessage: string;
  infoMessage: string;
  dangerMessage: string;
  updateMessageOne: string;
  updateMessageTwo: string;
  updateDownloaded: boolean;

  constructor(
    public electronService: ElectronService,
    public toastService: ToastService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private title: Title,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    translateService.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);

      // Set app version in title
      electronService.ipcRenderer.send('app_version');
      electronService.ipcRenderer.on('app_version', (event, arg) => {
        electronService.ipcRenderer.removeAllListeners('app_version');
        this.title.setTitle(`Gizmo ${arg.version}`);
      });

      // Auto update
      this.electronService.ipcRenderer.on('update_available', () => {
        this.electronService.ipcRenderer.removeAllListeners('update_available');
        this.updateMessageOne = 'Er is een nieuwe versie beschikbaar.';
        this.updateMessageTwo = 'Bezig met downloaden...';
        this.cd.detectChanges();
      });
      this.electronService.ipcRenderer.on('update_downloaded', () => {
        this.electronService.ipcRenderer.removeAllListeners('update_downloaded');
        this.updateMessageOne = 'Update gedownload.  De update wordt geïnstalleerd na herstart.';
        this.updateMessageTwo = 'Opnieuw opstarten?';
        this.updateDownloaded = true;
        this.cd.detectChanges();
      });

    } else {
      console.log('Mode web');
      this.title.setTitle(`Gizmo ${VERSION.full}`);
    }
  }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    //  success
    //  this.notificionService.successMessageChanges$.subscribe(msg => this.successMessage = msg);
    //  this.notificionService.successMessageChanges$.pipe(debounceTime(2000)).subscribe(() => this.successMessage = '');

    // info
    this.notificationService.infoMessageChanges$.subscribe(msg => this.infoMessage = msg);
    // this.notificationService.infoMessageChanges$.pipe(debounceTime(5000)).subscribe(() => this.infoMessage = '');

    // error
    this.notificationService.dangerMessageChanges$.subscribe(msg => this.dangerMessage = msg);
  }

  closeUpdateNotification() {
    this.updateMessageOne = '';
    this.cd.detectChanges();
  }

  appRestart() {
    this.electronService.ipcRenderer.send('restart_app');
  }
}
