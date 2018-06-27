import { Component } from '@angular/core';
import { MyDataService } from '../../services/api/my-data.service';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  list: any;
  constructor(private myDataService: MyDataService) {
    this.myDataService.load();
    this.myDataService.myData.subscribe((data) => {
      console.log('list',data);
      this.list = data;
    });
  }
}
