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
        () => console.log('Stored '+itemName),
        error => console.error('Error storing '+itemName, error)
    );
  }

  /**
   * Try to get the data from the native storage and use the local storage 
   * if this fails.
   * @param itemName name of table to store
   * @returns Promise with contents of the table in storage
   */
  getItemViaNativeStorage(itemName: string) {
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(itemName)
      .then(
        data => resolve(data),
        error => {
          console.log('Using local storage due to ',error);
          this.getItemViaStorage(itemName).then((result) => {
          resolve(result);
        })}
      );
    });
  }

  getItemViaStorage(itemName: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(itemName).then((val) => {
        resolve(val);
      });
    });
  }

}
