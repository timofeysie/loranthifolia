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
    this.myDataService.getDetail(this.itemName.replace(' ','_').toLowerCase(),'en',false).subscribe(
      data => {
        this.description = data['description'].toString();
        this.description = this.description.split('href="/wiki/')
          .join('href="https://en.wikipedia.org/wiki/');
      });
  }

  ngOnInit() {
    
  }

}
