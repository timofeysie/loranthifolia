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
    this.myDataService.loadWikiMedia('1');
    this.myDataService.loadWikiMedia('2');
    this.myDataService.loadWikiMedia('3');
    this.myDataService.myData.subscribe((data) => {
      this.list = data;
    });
  }
}
