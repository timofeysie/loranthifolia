import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private storage: Storage,
    private nativeStorage: NativeStorage) { }

    setList(list:any) {
      // set a key/value
      this.storage.set('list', list);

      this.nativeStorage.setItem('list', list)
        .then(
          () => console.log('Stored list'),
          error => console.error('Error storing list', error)
      );
    }

    getListViaNativeStorage() {
      return new Promise((resolve, reject) => {
        this.nativeStorage.getItem('list')
        .then(
          data => resolve(data),
          error => {
            console.log('Using local storage due to ',error);
            this.getListViaStorage().then((result) => {
            resolve(result);
          })}
        );
      });
    }

    getListViaStorage() {
      return new Promise((resolve, reject) => {
        this.storage.get('list').then((val) => {
          resolve(val);
        });
      });
    }

}
