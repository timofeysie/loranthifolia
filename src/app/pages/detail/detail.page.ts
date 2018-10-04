import { Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../../constants';
import { MyDataService } from '../../services/api/my-data.service';
import { DataStorageService } from '../../services/storage/data-storage.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, AfterViewChecked {
  showPreambles: boolean = false;
  @ViewChild('descriptionhook') descriptionhook: ElementRef;
  itemName: string;
  description:any;
  wikiMediaCategory: string;
  langChoice: string;
  options: any;
  wikipediaLink: string;
  yourBiasLink: string;
  preamblesBackup: any [];

  constructor(private route: ActivatedRoute,
    private myDataService: MyDataService,
    private dataStorageService: DataStorageService,
    elem: ElementRef, 
    renderer: Renderer2) { }

    ngAfterViewChecked() {
      if (typeof this.descriptionhook !== 'undefined' && !this.showPreambles) {
        let texts = this.descriptionhook.nativeElement.getElementsByClassName('mbox-text');
        this.preamblesBackup = texts.innerHTML;
        let smalls = this.descriptionhook.nativeElement.getElementsByClassName('hide-when-compact');
        for (let a = 0; a < smalls.length; a++) {
          smalls[a].innerHTML = '';
        }
        console.log('removing',texts[0]);
        for (let i = 1; i < texts.length; i++) {
          texts[i].innerHTML = '';
        };
        let images = this.descriptionhook.nativeElement.getElementsByClassName('mbox-image');
        images[0].addEventListener('click', this.onImageClick.bind(this));
      } else if (typeof this.descriptionhook !== 'undefined' && this.showPreambles) {
        this.descriptionhook.nativeElement.getElementsByClassName('mbox-text').innerHTML = this.preamblesBackup;
        console.log('adding',this.descriptionhook.nativeElement.getElementsByClassName('mbox-text'))
      }
    }

    onImageClick(what) {
      console.log('what',what);
      this.showPreambles = true;;
    }

  getDetails() {
    this.itemName = this.route.snapshot.paramMap.get('id');
    this.wikipediaLink = 'https://en.wikipedia.org/wiki/'+this.itemName.replace(' ','_');
    this.yourBiasLink = 'https://www.yourbias.is/'+this.itemName.replace(' ','-');
    this.myDataService.getDetail(this.itemName.replace(' ','_').toLowerCase(),this.langChoice,false).subscribe(
      data => {
        this.description = data['description'].toString();
        this.description = this.description.split('href="/wiki/')
          .join('href="https://'+this.langChoice+'.wikipedia.org/wiki/');
      });
  }

  ngOnInit() {
    this.dataStorageService.getItemViaNativeStorage(CONSTANTS.OPTIONS_NAME).then((result) => {
      if (result) {
        this.options = result;
        if (this.langChoice !== this.options['language']) {
          this.langChoice = this.options['language'];  
          this.getDetails();
        }
      }
    });
  }

  createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    let page = '<div>'+htmlString+'</div>';
    div.innerHTML = page.trim();
    return div; 
  }

}
