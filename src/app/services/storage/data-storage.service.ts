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

  /**
   * Try both local storage and native storage. 
   * @param itemName name of table to store
   * @param list array of objects to store
   */
  setItem(itemName: string, list:any) {
    // set a key/value
    this.storage.set(itemName, list);
    this.nativeStorage.setItem(itemName, list)
      .then(
        () => console.log('2.1: Stored '+itemName),
        error => { }
    );
  }

  /**
   * Try to get the data from the native storage and use the local storage 
   * if this fails.
   * @param itemName name of table to store
   * @returns Promise with contents of the table in storage
   */
  getItemViaNativeStorage(itemName: string) {
    console.log('itemName',itemName);
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(itemName)
      .then(
        data => {
          console.log('dot',data);
          resolve(data)},
        error => {
          console.log('nativeStorage.getItem',error);
          this.getItemViaStorage(itemName).then((result) => {
            resolve(result);
        })}
      );
    });
  }

  private getItemViaStorage(itemName: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(itemName).then((val) => {
        if (itemName === 'options') {
        }
        resolve(val);
      });
    });
  }

  getDefaultOptions() {
    let options = {
      language: 'en',
      languages: 
        [{lang: 'en', name: 'English'},
         {lang: 'ko', name: 'Korean'}]
    }
    this.setItem('options',options);
    console.log('options created');
    return options;
  }

}
