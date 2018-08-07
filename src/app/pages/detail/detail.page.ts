import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyDataService } from '../../services/api/my-data.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  itemName: string;
  description:any;
  wikiMediaCategory: string;

  constructor(private route: ActivatedRoute,
    private myDataService: MyDataService) { }

  ionViewWillEnter(){
    this.itemName = this.route.snapshot.paramMap.get('id');
    this.wikiMediaCategory = this.myDataService.getWikiMediaDescription(this.itemName);
    this.myDataService.loadSingleWikiMediaPage(this.itemName).then((result) => {
      this.description = result;
    }).catch((err) => {
      console.log('will we get an error if the promise is not rejected or resolved');
     });
  }

  ngOnInit() {
    
  }

}
