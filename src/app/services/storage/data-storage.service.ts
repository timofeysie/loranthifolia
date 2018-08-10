import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { setMaxListeners } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private storage: Storage) { }

    setList(list:any) {
      // set a key/value
      this.storage.set('list', list);
    }

    getList() {
      return new Promise((resolve, reject) => {
        this.storage.get('list').then((val) => {
          resolve(val);
        });
      });
    }

}
