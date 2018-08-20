import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataStorageService } from './services/storage/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  optionsName = 'options';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataStorageService: DataStorageService
  ) {
    this.initializeApp();
  }

  /**
   * Boiler plate Ionic platform ready stuff and
   * get the options or create default options if they don't exist yet.
   */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.dataStorageService.getItemViaNativeStorage(this.optionsName).then((result) => {
      if (result) {
        return result;
      } else {
        return this.dataStorageService.getDefaultOptions();
      }
    });
  }
}
