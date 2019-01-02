import { Component, ViewChild, ElementRef } from '@angular/core';
import { MyDataService } from '../../services/api/my-data.service';
import { CONSTANTS } from '../../constants';
import { DataStorageService } from '../../services/storage/data-storage.service';
import { Events } from '@ionic/angular';
//import { ItemSliding } from '@ionic/angular';
import { Router, NavigationEnd} from '@angular/router';
import { DetailModel } from '../../models/detail-model';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	// shared list/detail members
	backupTitle: string;

  view: string = 'list';
  itemName: string = 'list';
  list: any;
  mediaSections = 3;
  version: string;
  langChoice: string = 'en';
  options: any;
  @ViewChild('item') private item: ElementRef;	
  //@ViewChild('itemSliding', { read: ItemSliding }) private itemSliding: ItemSliding;

  // detail view members
  officialTitle: string;
  shortDescription: string;
  showPreambles: boolean = false;
  @ViewChild('descriptionhook') descriptionhook: ElementRef;
  //itemName: string;
  description:any;
  wikiMediaCategory: string;
  //langChoice: string;
  //options: any;
  wikipediaLink: string;
  yourBiasLink: string;
  preamblesBackup: any [];
  constructor(
    private myDataService: MyDataService, 
    private dataStorageService: DataStorageService,
    public events: Events,
    private router:Router) {
      this.router.events.forEach((event) => {
        if (event instanceof NavigationEnd && this.router.url === '/home') {
          // reload list with the new options if they have changed
          this.checkForUpdateOptions();
          /* Since a back(params) is not available, we need a way to tell the
          app to refresh the list when coming back from the options page.*/
          if (this.dataStorageService.sharedAction === 'reset-list') {
            this.dataStorageService.sharedAction = 'none';
            this.refreshList();
          }
        }
      });
      this.version = CONSTANTS.VERSION;
      events.subscribe('ionDrag', (what) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', what);
      });
    this.dataStorageService.getItemViaNativeStorage(CONSTANTS.OPTIONS_NAME).then((result) => {
      if (result) {
        this.options = result;
        this.langChoice = this.options['language'];
        // kick off the action
        this.getList();
      }
    });
  }

  // detail page functions ====================
  detailNgAfterViewChecked() {
    if (this.dataStorageService.sharedAction !== '') {
      this.shortDescription = this.dataStorageService.sharedAction;
      console.log('A.desc',this.shortDescription);
      this.dataStorageService.sharedAction = '';
    }
    if (typeof this.descriptionhook !== 'undefined' && !this.showPreambles) {
      console.log('B');
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
	console.log('C');
	this.detailNgOnInit();
  }

getDetails() {
  //this.itemName = this.route.snapshot.paramMap.get('id');
  //let backupTitle = this.route.snapshot.paramMap.get('backupTitle');
  //this.officialTitle = this.route.snapshot.paramMap.get('officialTitle');
  let linkTitle;
  if (this.backupTitle) {
	console.log('F3');
    linkTitle = this.backupTitle.replace(' ','_');
    console.log('using backup title',this.backupTitle);
  } else {
	linkTitle = this.itemName.replace(' ','_');
	console.log('G');	
  }
  this.wikipediaLink = 'https://en.wikipedia.org/wiki/'+linkTitle;
  const itemNameAgain = linkTitle.toLowerCase();
  this.myDataService.getDetail(itemNameAgain,this.langChoice,false).subscribe(
    data => {
		console.log('H');
      this.description = data['description'].toString();
      this.description = this.description.split('href="/wiki/')
        .join('href="https://'+this.langChoice+'.wikipedia.org/wiki/');
      
      // temporary fix for issue #6.  This should ideally be done with DOM manipulation
	  this.removeStyleTags();
	  console.log('I',this.description);   
      // Preamble toggle work
      //let newDOM = this.createElementFromHTML(this.description);
      //console.log('newDOM',newDOM);
      //let mboxText = newDOM.getElementsByClassName('mbox-text');
      //console.log('mboxText',mboxText.length);
      
      // the exclamation mark icon description, and sub icons and descriptions
      //let preambles = mboxText[0];
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
      if (typeof error.url !== 'undefined') {
        if (error.url === null) {
          alert('Your device appears to be offline');
        } else if (typeof error.message !== 'undefined') {
          alert('Network error: '+error.message);
        } else {
          alert('Error getting '+itemNameAgain+' details');
        }
      }
	})
    );
}

removeStyleTags() {
  const style1 = this.description.indexOf('<style');
  const style2 = this.description.indexOf('</style>');
  const part1 = this.description.substring(0, style1);
  const part2 = this.description.substring(style2, this.description.length);
  this.description = part1+part2;
}

detailNgOnInit() {
  this.dataStorageService.getItemViaNativeStorage(CONSTANTS.OPTIONS_NAME).then((result) => {
	console.log('D');
    if (result) {
	  this.options = result;
      console.log('E');	  
      if (this.langChoice !== this.options['language']) {
		this.langChoice = this.options['language'];  
		console.log('F1');		
        this.getDetails();
      } else {
		console.log('langChoice',this.langChoice)
		console.log('options lang',this.options['language']);
		this.getDetails();
		console.log('F2');	
	  }
    }
  });
}

createElementFromHTML2(htmlString) {
  var div = document.createElement('div');
  let page = '<div>'+htmlString+'</div>';
  div.innerHTML = page.trim();
  return div; 
}

  // list page functions ========================

  ionViewWillEnter() {
    //console.log('this.itemSliding',this.itemSliding);
  }
  
  viewShortDescription(item) {
    console.log('swipe');
  }
  /**
   * Go to the detail page.  If an item has a backup title, add that to the route.
   * @param item Set state as viewed, get language setting, create list name, and/or title
   * And pass on to the detail page.
   * @param i item index
   */
  navigateAction(item: string, i: number) {
    this.dataStorageService.sharedAction = this.list[i].wikiMedia_description;
    let qCode = this.findQCode(this.list[i]);
    this.list[i].detailState = 'viewed';
    let itemRoute = item.replace(/\s+/g, '_').toLowerCase();
    this.backupTitle = this.list[i]['backupTitle'] ;
    let officialTitle;
    if ( this.list[i].cognitive_biasLabel) {
      officialTitle =  this.list[i].cognitive_biasLabel;
    } else {
      officialTitle =  this.list[i].wikiMedia_label;
    }
    if (typeof this.backupTitle!== 'undefined' && this.backupTitle !== null) {
      console.log('1.this.list[i][backupTitle]',this.backupTitle);
      //this.router.navigate(['detail/'+this.backupTitle+'/'+qCode+'/'+officialTitle]);
    } else if (typeof this.list[i]['cognitive_bias'] !== 'undefined') {
      console.log('2.this.list[i][cognitive_bias] !== undefined.');
      const url = 'detail/'+itemRoute+'/'+qCode+'/'+officialTitle;
      //this.router.navigate([url]);
    } else {
      console.log('3.else sortName',this.list[i].sortName);
      //this.router.navigate(['detail/'+this.list[i].sortName+'/'+qCode+'/'+officialTitle]);
	}
	this.view = 'detail';
	console.log('start ======');
	this.description = null;
	this.detailNgAfterViewChecked();
  }

  /**
   * 
   * @param item @returns the q-code which is the last item in a URI http://www.wikidata.org/entity/Q4533272
   */
  findQCode(item) {
    let qCode;
    if (typeof item['cognitive_bias'] !== 'undefined') {
      // item has a q-code
      let lastSlash = item['cognitive_bias'].lastIndexOf('/');
      qCode = item.cognitive_bias.substr(lastSlash,item.cognitive_bias.length);
      // after upgrading to Ionic 4 rc 0, this started returning a slash at
      // the start of the code
      let slash = qCode.indexOf('/');
      if (slash !== -1) {
        qCode = qCode.substr(slash+1,qCode.length);
      } 
    } else {
      // no q-code
      qCode = null;
    }
    return qCode;
  }

  getList() {
    if (typeof this.list !== 'undefined' && !this.list) {
      this.getFromLocalStorage();
    } else {
      this.getListFromStorage();
    }
  }

  refreshList() {
    this.list = null;
    this.getListFromStorageOrServer();
  }

  /**
   * First try the local native storage to set the list.
   * If that fails, try http.
   */
  getListFromStorage() {
    this.dataStorageService.getItemViaNativeStorage(this.langChoice+'-'+this.itemName).then((result) => {
      if (result) {
        this.list = result;
      } else {
        // if the app checks for an existing local list first and uses http after that,
        // then this block will never happen.
        console.log('then this block will never happen');
        this.getListFromStorageOrServer();
      }
    });
  }

  /**
   * If a page only has a Q-code, it does not have data for that item in the language requested.
   * Example:
   * "cognitive_biasLabel" : {
   *     "type" : "literal",
   *     "value" : "Q177603"
   * }
   * @param item WikiData item to check if a language page exists
   */
  languagePageDoesNotExist(item, index) {
    let label = item.cognitive_biasLabel;
    let first = label.substr(0,1);
    let second = label.substr(1,2);
    if (first === 'Q' && !isNaN(second)) {
        // no page exists
        return false; // if this returns true, then why aren't these items being removed from the list?
    } else {
      // page exists
      return true;
    }
  }

  /**
   * If the options have changed, then reload and parse the list.
   */
  checkForUpdateOptions() {
    this.dataStorageService.getItemViaNativeStorage(CONSTANTS.OPTIONS_NAME).then((result) => {
      if (result) {
        this.options = result;
        if (this.langChoice !== this.options['language']) {
          this.langChoice = this.options['language'];  
          this.list = null;
          this.getListFromStorage();     
        }
      }
    });
  }

  // ngAfterViewInit() {
  //   console.log('itemSliding',this.itemSliding);
  // }

  // public async ngAfterViewInit(): Promise<void> {
  //   console.log('itemSliding',this.itemSliding);
  // }

  /**
   * Get the list either from storage or API if it's not there.
   * Set the sort name to the label, then on to getting the WikiMedia
   * category lists which will eventually merge those lists with
   * the WikiData list.
   */
  getListFromStorageOrServer() {
    this.myDataService.getWikiDataList(this.langChoice).subscribe(
      data => {
        if (!this.list) {
          this.list = data['list'];
          this.list.slice().reverse().forEach((item, index, object) => {
            if (!this.languagePageDoesNotExist(item, index)) {
              // remove the item from the list
              item.sortName = item.cognitive_biasLabel.toLowerCase();
              this.list.splice(object.length - 1 - index, 1);
            } else {
              item.sortName = item.cognitive_biasLabel.toLowerCase();
            }
          });
          this.getWikiMediaLists();
        }
      },
      error => {
        console.error('offline error',error);
        // assume we are offline here and load the previously saved list
        this.getFromLocalStorage();
      }
    );
  }

  /**
   * Get the list from local storage.
   */
  getFromLocalStorage() {
    this.dataStorageService.getItemViaNativeStorage(this.langChoice+'-'+this.itemName).then((result) => {
      console.log('result',result);
      this.list = result;
    });
  }

  /** Use a promise chain to get the WikiMedia section lists.
   * Sort the list after all calls have completed.
   * Save the sorted list in the local data storage.
   */
  getWikiMediaLists() {
    let promises = [];
    for (let i = 0; i < this.mediaSections; i++) {
      promises.push(new Promise((resolve) => {
        this.myDataService.loadWikiMedia(i+1,this.langChoice).subscribe((data) => { 
          if (data['parse']) {
            let parsedData = this.parseList(data);
            resolve(parsedData); 
          }
        });
      }));
    }
    Promise.all(promises)
      .then(data => { return data })
      .then(data => { return data })
      .then(data => {
        // after all the WikiMedia lists have been merged into one,
        // include those into the list and sort it
        this.addItems(data[0]); // TODO: fix array of dupes
        this.addItems(data[1]); // TODO: fix array of dupes
        this.list.sort(this.dynamicSort('sortName'));
        this.dataStorageService.setItem(this.langChoice+'-'+this.itemName, this.list);
        // UI doesn't refresh here on a device so this will force the page to reload
        console.log('list',this.list);
        //location.reload();
    });
  }

  /**
   * The Ege Özcan solution from [the answer to this question](https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript) 
   * back in 2011.
   * @param property to sort by
   */
  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  setStateViewed(i) {
    this.list[i].detailState = 'viewed';
    this.dataStorageService.setItem(this.langChoice+'-'+this.itemName, this.list);
  }

  /**
   * Take a complete section of names and descriptions and either add the content
   * to a pre-existing item or create a new item if it is not already on the list.
   * 
   * @param section WIkiMedia section
   */
  addItems(section: any) {
      section.forEach((key) => {
        let itemName = key.name;
        let backupTitle;
        if (typeof key.backupTitle !== 'undefined') {
          backupTitle = key.backupTitle;
          console.log(itemName+' -> '+backupTitle);
        }
        let found = false;
        for(var j = 0; j < this.list.length; j++) {
          if ((typeof this.list[j].sortName !== 'undefined' && typeof itemName !== 'undefined') && this.list[j].sortName.toLocaleUpperCase() === itemName.toLocaleUpperCase()) {
            found = true;
            this.list[j].wikiMedia_label = itemName;
            this.list[j].wikiMedia_description = this.removeFootnotes(key.desc);
            this.list[j].wikiMedia_category = key.category;
            this.list[j].sortName = itemName.toLowerCase();
            this.list[j].detailState = 'un-viewed';
            this.list[j].descriptionState = 'un-viewed';
            this.list[j].itemState = 'show';
            this.list[j].backupTitle = backupTitle;
            break;
          }
        }
        if (!found) {
          let wikiMediaObj:any = this.createItemObject(itemName, key, backupTitle);
          this.list.push(wikiMediaObj);
        }
    });
  }

  removeFootnotes(description: string) {
    if (description) {
        const indexOfBracket = description.indexOf('[');
        if (indexOfBracket !== -1) {
            return description.substring(0, indexOfBracket);
          } else {
              return description;
          }
      }
  }

  /**
   * Create a new item from a WikiMedia list item.
   * @param itemName Name of the item
   * @param key key has desc, and category properties
   */
  createItemObject(itemName: string, key: any, backupTitle: string) {
    let itemObject:any = {};
    itemObject.wikiMedia_label = itemName;
    itemObject.wikiMedia_description = this.removeFootnotes(key.desc);
    itemObject.wikiMedia_category = key.category;
    itemObject.sortName = itemName.toLowerCase();
    itemObject.detailState = 'un-viewed';
    itemObject.descriptionState = 'un-viewed';
    itemObject.itemState = 'show';
    itemObject.backupTitle = backupTitle;
    return itemObject;
  }

  /**
   * Usually the name of item can be gotten from the inner text of an <a> tag inside the table cell.
   * A few however, like 'frequency illusion' are not links, so are just the contents of the <td> tag.
   * Some, such as 'regression bias' have a <span> inside the tag.
   * @param data result of a WikiMedia section API call
   * @returns Array of name/desc objects
   */
  parseList(data: any) {
    const content = data['parse']['text']['*'];
    let one = this.createElementFromHTML(content);
    const desc:any = one.getElementsByClassName('mw-parser-output')[0].children;
    let descriptions: any [] = [];
    let category = desc[0].getElementsByClassName('mw-headline')[0].innerText;
    // might use category descriptions later
    // if (typeof desc[1].getElementsByTagName('a')[0] !== 'undefined') {
    //   console.log('desc1',desc[1].getElementsByTagName('a')[0].innerText);
    // } else {
    //   console.log(desc[1]);
    // }
    const allDesc = desc[2];
    const tableRows = allDesc.getElementsByTagName('tr');
    for (let i = 0; i < tableRows.length;i++) {
      let tableDiv = tableRows[i].getElementsByTagName('td');
      if (typeof tableDiv[0] !== 'undefined') {
        let itemDesc;
        if (typeof tableDiv[1] !== 'undefined') {
          itemDesc = tableDiv[1].innerText;
        }
        let itemName;
        if (typeof tableDiv[0].getElementsByTagName('a')[0] !== 'undefined') {
          itemName = tableDiv[0].getElementsByTagName('a')[0].innerText;
        } else if (typeof tableDiv[0].getElementsByTagName('span')[0] !== 'undefined') {
          itemName = tableDiv[0].getElementsByTagName('span')[0].innerText;
        } else if (typeof tableDiv[0].innerText !== 'undefined') {
          itemName = tableDiv[0].innerText;
        } else {
          console.log('failed to get',tableDiv[0]);
        }
        let backupTitle = this.getAnchorTitleForBackupTitle(tableDiv[0],itemName);
        // if (itemName === 'Experimenter\'s') {
        //   console.log('tableRows',tableRows);
        // }
        let newItem = {
          'name': itemName,
          'desc': itemDesc,
          'category': category,
          'sortName': itemName.charAt(0).toUpperCase()+itemName.slice(1),
          'backupTitle': backupTitle
        }
        descriptions.push(newItem);
      }
    }
    return descriptions;
  }

  /**
   * Parse the anchor tag for the title of the item used in the tag,
   * which can be different from the name of the item.
   * @param tableDiv the DOM element
   * @param itemName the item name
   */
  getAnchorTitleForBackupTitle(tableDiv: any, itemName: string) {
    if (typeof tableDiv.getElementsByTagName('a')[0] !== 'undefined') {
      let titleProp = tableDiv.getElementsByTagName('a')[0].title;
      let backupLink;
      let backupTitle;
      let href:string = tableDiv.getElementsByTagName('a')[0].href;
      if (href) {
        let slash = href.lastIndexOf('/');
        backupLink = href.substr(slash+1,href.length);
      }
      if (href.indexOf('index.php') !== -1) {
        backupTitle = -1; // we have a missing detail page
      }
      if (itemName !== titleProp && backupTitle !== -1) {
        backupTitle = titleProp;
      }
      if ((backupTitle !== null) 
        && (typeof backupTitle !== 'undefined')
        && (backupTitle !== -1) 
        && (backupTitle.indexOf('(psychology)') !== -1)) {
        backupTitle = backupTitle.substr(0,backupTitle.indexOf('('));
        //compare the names again without the
        if (backupTitle !== itemName) {
          backupTitle = null;
        }
      }
      if (typeof backupTitle !== 'undefined') {
        console.log('1.found',backupTitle);
        console.log('tableDiv',tableDiv,'itemName',itemName);
      }
      return backupTitle;
    } else {
      if (typeof tableDiv.getElementsByTagName('td')[0] !== 'undefined') {
        console.log('2.found',tableDiv.getElementsByTagName('td')[0].innerText());
        return tableDiv.getElementsByTagName('td')[0].innerText();
      }
    }
  }

  /**
   * Convert the result content to an html node for easy access to the content.
   * Change this to div.childNodes to support multiple top-level nodes
   * @param htmlString 
   */
  createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    let page = '<div>'+htmlString+'</div>';
    div.innerHTML = page.trim();
    return div; 
  }

  /**
   * Remove the [edit] portion of the title.
   * @param HTMLDivElement 
   */
  parseTitle(html: HTMLDivElement) {
    let title =  html.getElementsByTagName('h2')[0].innerText;
    let bracket = title.indexOf('[');
    if (bracket > 0) {
      title = title.substr(0,bracket);
    }
    return title;
  }

}
