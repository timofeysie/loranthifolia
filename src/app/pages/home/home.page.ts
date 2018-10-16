import { Component, ViewChild } from '@angular/core';
import { MyDataService } from '../../services/api/my-data.service';
import { CONSTANTS } from '../../constants';
import { DataStorageService } from '../../services/storage/data-storage.service';
import { Events } from '@ionic/angular';
import { ItemSliding } from '@ionic/angular';
import { Router, NavigationEnd} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  itemName: string = 'list';
  list: any;
  mediaSections = 3;
  version: string;
  langChoice: string = 'en';
  options: any;
  @ViewChild('itemSliding', { read: ItemSliding }) private itemSliding: ItemSliding;
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

  ionViewWillEnter() {
    //console.log('this.itemSliding',this.itemSliding);
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
        console.log('list',this.list);
        this.list.sort(this.dynamicSort('sortName'));
        this.dataStorageService.setItem(this.langChoice+'-'+this.itemName, this.list);
        // UI doesn't refresh here on a device so this will force the page to reload
        location.reload();
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
        let found = false;
        for(var j = 0; j < this.list.length; j++) {
          if ((typeof this.list[j].sortName !== 'undefined' && typeof itemName !== 'undefined') && this.list[j].sortName.toLocaleUpperCase() === itemName.toLocaleUpperCase()) {
            found = true;
            this.list[j].wikiMedia_label = itemName;
            this.list[j].wikiMedia_description = this.removeFootnotes(key.desc).substring(0,82)+'...';
            this.list[j].wikiMedia_category = key.category;
            this.list[j].sortName = itemName.toLowerCase();
            this.list[j].detailState = 'un-viewed';
            this.list[j].descriptionState = 'un-viewed';
            this.list[j].itemState = 'show';
            //console.log('this.list[j].sortName',this.list[j].sortName);
            break;
          }
        }
        if (!found) {
          let wikiMediaObj:any = this.createItemObject(itemName, key);
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
  createItemObject(itemName: string, key: any) {
    let itemObject:any = {};
    itemObject.wikiMedia_label = itemName;
    itemObject.wikiMedia_description = this.removeFootnotes(key.desc).substring(0,82)+'...';
    itemObject.wikiMedia_category = key.category;
    itemObject.sortName = itemName.toLowerCase();
    itemObject.detailState = 'un-viewed';
    itemObject.descriptionState = 'un-viewed';
    itemObject.itemState = 'show';
    //itemObject.itemOrder;
    //console.log('itemObject.sortName',itemObject.sortName );

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
        let newItem = {
          'name': itemName,
          'desc': itemDesc,
          'category': category,
          'sortName': itemName.charAt(0).toUpperCase()+itemName.slice(1)
        }
        descriptions.push(newItem);
      }
    }
    return descriptions;
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
