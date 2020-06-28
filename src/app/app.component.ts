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
  public updateMessage: string;

  constructor(
    public electronService: ElectronService,
    public toastService: ToastService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private title: Title,
    private router: Router
  ) {
    translate.setDefaultLang('nl');
    this.updateMessage = 'test update';

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);

      // Set app version in title
      electronService.ipcRenderer.send('app_version');
      electronService.ipcRenderer.on('app_version', (event, arg) => {
        electronService.ipcRenderer.removeAllListeners('app_version');
        this.title.setTitle(`Verelst Software ${arg.version}`);
      });

      electronService.ipcRenderer.on('message', (event, arg) => {
        console.log('Message from updater:', arg);
        this.updateMessage = arg;
      });

      // Check for updates
      // electronService.ipcRenderer.on('update_available', () => {
      //   electronService.ipcRenderer.removeAllListeners('update_available');
      //   this.updateMessage = 'A new update is available. Downloading now...';
      //   //message.innerText = 'A new update is available. Downloading now...';
      //   //notification.classList.remove('hidden');
      // });
      // electronService.ipcRenderer.on('update_downloaded', () => {
      //   electronService.ipcRenderer.removeAllListeners('update_downloaded');
      //   this.updateMessage = 'Update Downloaded. It will be installed on restart. Restart now?';
      //   //message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
      //   //restartButton.classList.remove('hidden');
      //   //notification.classList.remove('hidden');
      // });

    } else {
      console.log('Mode web');
      this.title.setTitle(`Verelst Software ${VERSION.full}`);
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
    // this.notificationService.infoMessageChanges$.subscribe(msg => this.infoMessage = msg);
    // this.notificationService.infoMessageChanges$.pipe(debounceTime(5000)).subscribe(() => this.infoMessage = '');

    // error
    this.notificationService.dangerMessageChanges$.subscribe(msg => this.dangerMessage = msg);
  }
}
