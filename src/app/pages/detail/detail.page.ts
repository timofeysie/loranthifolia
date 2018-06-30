import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  itemName: string;

  constructor(private route: ActivatedRoute) { }

  ionViewWillEnter(){
    this.itemName = this.route.snapshot.paramMap.get('id');
    console.log('itemName',this.itemName);
  }

  ngOnInit() {
    
  }

}
