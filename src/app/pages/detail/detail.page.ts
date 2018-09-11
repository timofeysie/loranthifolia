import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../../constants';
import { MyDataService } from '../../services/api/my-data.service';
import { DataStorageService } from '../../services/storage/data-storage.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  itemName: string;
  description:any;
  wikiMediaCategory: string;
  langChoice: string = 'en';
  options: any;

  constructor(private route: ActivatedRoute,
    private myDataService: MyDataService,
    private dataStorageService: DataStorageService) { }

  ionViewWillEnter() {
    console.log('this.langChoice',this.langChoice);
    this.itemName = this.route.snapshot.paramMap.get('id');
    this.myDataService.getDetail(this.itemName.replace(' ','_').toLowerCase(),this.langChoice,false).subscribe(
      data => {
        this.description = data['description'].toString();
        this.description = this.description.split('href="/wiki/')
          .join('href="https://'+this.langChoice+'.wikipedia.org/wiki/');
      });
  }

  ngOnInit() {
    console.log('this.langChoice',this.langChoice);
    this.dataStorageService.getItemViaNativeStorage(CONSTANTS.OPTIONS_NAME).then((result) => {
      if (result) {
        this.options = result;
        if (this.langChoice !== this.options['language']) {
          console.log('lang change');   
          this.langChoice = this.options['language'];  
        }
      }
    });
  }

}
