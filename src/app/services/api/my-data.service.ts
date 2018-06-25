import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Category } from '../../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  public myData: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
 
  constructor(private storage: Storage) {

  }

  load(): void {
      this.storage.get('myData').then((data) => {
          this.myData.next(data);
      });
  }

  updateData(data): void {
      this.storage.set('myData', data);
      this.myData.next(data);
  }
  
}
