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
  public successMessage: string;
  public infoMessage: string;
  public dangerMessage: string;
  public autoUpdateMessageOne: string;
  public autoUpdateMessageTwo: string;
  public updateDownloaded: boolean;

  constructor(
    public electronService: ElectronService,
    public toastService: ToastService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private title: Title,
    private router: Router
  ) {
    translate.setDefaultLang('en');
    this.updateDownloaded = false;

    // this.autoUpdateMessageOne = 'Update gedownload.  De update wordt geïnstalleerd na herstart.'
    // this.autoUpdateMessageTwo = 'Opnieuw opstarten?'

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

      // Check for new version
      electronService.ipcRenderer.on('message', (event, message) => {
        console.log('Message from updater:', message);
        this.updateDownloaded = false;
        if (message === 'update-available') {
          this.autoUpdateMessageOne = 'Er is een nieuwe versie beschikbaar!'
          this.autoUpdateMessageTwo = 'Bezig met downloaden...'
        } else if (message === 'update-downloaded') {
          this.autoUpdateMessageOne = 'Update gedownload.  De update wordt geïnstalleerd na herstart.'
          this.autoUpdateMessageTwo = 'Opnieuw opstarten?'
          this.updateDownloaded = true;
        }
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

    //  this.toastService.show
    //  success
    //  this.notificionService.successMessageChanges$.subscribe(msg => this.successMessage = msg);
    //  this.notificionService.successMessageChanges$.pipe(debounceTime(2000)).subscribe(() => this.successMessage = '');

    // info
    this.notificationService.infoMessageChanges$.subscribe(msg => this.infoMessage = msg);
    this.notificationService.infoMessageChanges$.pipe(debounceTime(5000)).subscribe(() => this.infoMessage = '');

    // error
    this.notificationService.dangerMessageChanges$.subscribe(msg => this.dangerMessage = msg);
  }

  public closeNotification(): void {
    this.autoUpdateMessageOne = '';
  }

  public restartApp(): void {
    this.electronService.ipcRenderer.send('restart_app');
  }

}
