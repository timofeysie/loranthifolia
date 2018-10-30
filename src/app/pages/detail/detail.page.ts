import { Component, OnInit, ElementRef, Renderer2, ViewChild, AfterViewChecked, TemplateRef } from '@angular/core';
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
        
        // texts/outer innner
        let texts = this.descriptionhook.nativeElement.getElementsByClassName('mbox-text');
        this.preamblesBackup = texts.innerHTML;
        if (texts.length > 0) {
          let exclamationMarkDesc = texts[0].getElementsByClassName('mw-collapsible');
          if (exclamationMarkDesc.length > 0) {
            exclamationMarkDesc[0].innerHTML = '';
          }
        }
        for (let i = 1; i < texts.length; i++) {
          texts[i].innerHTML = '';
        };
        
        // (learn how and when ...)
        let smalls = this.descriptionhook.nativeElement.getElementsByClassName('hide-when-compact');
        for (let a = 0; a < smalls.length; a++) {
          smalls[a].innerHTML = '';
        }
        
        let images = this.descriptionhook.nativeElement.getElementsByClassName('ambox');
        if (images.length > 0) {
          images[0].innerHTML = '';
        }

        let preambleTable = this.descriptionhook.nativeElement.getElementsByClassName('nowraplinks');
        if (preambleTable.length > 0) {
          preambleTable[0].innerHTML = '';
        }
      } 
    }

  getDetails() {
    this.itemName = this.route.snapshot.paramMap.get('id');
    let backupTitle = this.route.snapshot.paramMap.get('backupTitle');
    console.log('backupTitle',backupTitle);
    let linkTitle;
    if (backupTitle) {
      linkTitle = this.itemName.replace(' ','_');
    } else {
      linkTitle = this.itemName.replace(' ','_');
    }
    this.wikipediaLink = 'https://en.wikipedia.org/wiki/'+linkTitle;
    const itemNameAgain = encodeURI(linkTitle).toLowerCase();
    this.myDataService.getDetail(itemNameAgain,this.langChoice,false).subscribe(
      data => {
        this.description = data['description'].toString();
        this.description = this.description.split('href="/wiki/')
          .join('href="https://'+this.langChoice+'.wikipedia.org/wiki/');
        let newDOM = this.createElementFromHTML(this.description);
        //console.log('newDOM',newDOM);
        let mboxText = newDOM.getElementsByClassName('mbox-text');
        //console.log('mboxText',mboxText.length);
        
        // the exclamation mark icon description, and sub icons and descriptions
        let preambles = mboxText[0];
        //this.description = mboxText[0].innerHTML;

        //let exclamationMarkDesc = preambles.getElementsByClassName('mw-collapsible');
        //this.description = exclamationMarkDesc[0].innerHTML;

        // this article includes a list of references but...
        //this.description = mboxText[1].innerHTML;

        // this article may have to be rewritten entirely to comply ...
        //this.description = mboxText[2].innerHTML;

        // the exclamation mark icon description, and sub icons and descriptions        
        // let exclamationMarkDesc = newDOM.getElementsByClassName('mw-collapsible');
        // console.log('exclamationMarkDesc',exclamationMarkDesc[0]);
        // this.description = exclamationMarkDesc[0].innerHTML;

        // Please help to improve this article ...
        //let smalls = preambles.getElementsByClassName('hide-when-compact');

        // this is an array of the specific preambles including icons and descriptions
        //let images = preambles.getElementsByClassName('ambox');
        //console.log('images',images.length);
        
        // EXAMPLES
        // This article includes a list of references ...
        //this.description = images[0].innerHTML;
        
        // this article may have to be rewritten entirely to comply ...
        //this.description = images[1].innerHTML;

      },((error: any) => {
        console.log('error from detail',error);
        this.description = error.message+' failed.';
      })
      );
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
