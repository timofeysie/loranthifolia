import { Component, ViewChild, OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { MyDataService } from '../../services/api/my-data.service';
import { CONSTANTS } from '../../constants';
import { DataStorageService } from '../../services/storage/data-storage.service';
import { Events } from '@ionic/angular';
import { ItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  itemName = 'list';
  list: any;
  mediaSections = 3;
  version: string;
  optionsName = 'options';
  langChoice: string;
  options: any;
  @ViewChild('itemSliding', { read: ItemSliding }) private itemSliding: ItemSliding;
  constructor(
    private myDataService: MyDataService, 
    private dataStorageService: DataStorageService,
    public events: Events) {

      this.dataStorageService.getItemViaNativeStorage(this.itemName).then((result) => {
        if (result) {
          this.list = result;
        } else {
          console.log('getting list from storage or server');
          this.getListFromStorageOrServer();
        }
      });
    this.version = CONSTANTS.VERSION;
    events.subscribe('ionDrag', (what) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', what);
    });
    this.dataStorageService.getItemViaNativeStorage(this.optionsName).then((result) => {
      if (result) {
        this.options = result;
        this.langChoice = this.options['language'];
      }
    });
  }

  ngOnChanges()	{
    console.log('ngOnChanges');
    //console.log('Respond when Angular (re)sets data-bound input properties. The method receives a SimpleChanges object of current and previous property values.');
    //console.log('Called before ngOnInit() and whenever one or more data-bound input properties change.');
  }

ngOnInit()	{
  console.log('ngOnInit');
  //console.log('Initialize the directive/component after Angular first displays the data-bound properties and sets the directive/component\'s input properties.');
  //console.log('Called once, after the first ngOnChanges().');
}

ngDoCheck()	{
  console.log('ngDoCheck');
  //console.log('Detect and act upon changes that Angular can\'t or won\'t detect on its own.');
  //console.log('Called during every change detection run, immediately after ngOnChanges() and ngOnInit().');
}

ngAfterContentInit()	{
  console.log('ngAfterContentInit');
  //console.log('Respond after Angular projects external content into the component\'s view / the view that a directive is in.');
  //console.log('Called once after the first ngDoCheck().');
}

ngAfterContentChecked()	{
  console.log('ngAfterContentChecked');
  //console.log('Respond after Angular checks the content projected into the directive/component.');
  //console.log('Called after the ngAfterContentInit() and every subsequent ngDoCheck().');
}

ngAfterViewInit()	{
  console.log('ngAfterViewInit');
  //console.log('Respond after Angular initializes the component\'s views and child views / the view that a directive is in.');
  console.log('Called once after the first ngAfterContentChecked().');
}

ngAfterViewChecked()	{
  console.log('ngAfterViewChecked');
  //console.log('Respond after Angular checks the component\'s views and child views / the view that a directive is in.');
  //console.log('Called after the ngAfterViewInit and every subsequent ngAfterContentChecked().');
}

ngOnDestroy()	{
  console.log('ngOnDestroy');
  //console.log('Cleanup just before Angular destroys the directive/component. Unsubscribe Observables and detach event handlers to avoid memory leaks.');
  console.log('Called just before Angular destroys the directive/component.');
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
        this.list = data['list'];
        this.list.forEach((item) => {
          item.sortName = item.cognitive_biasLabel;
        });
        this.getWikiMediaLists();
      },
      error => {
        console.error('offline error',error);
        // assume we are offline here and load the previously saved list
        this.dataStorageService.getItemViaNativeStorage(this.itemName).then((result) => {
          console.log('result',result);
          this.list = result;
        });
      }
    );
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
          let parsedData = this.parseList(data);
          resolve(parsedData); });
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
        this.dataStorageService.setItem(this.itemName, this.list);
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
    this.dataStorageService.setItem(this.itemName, this.list);
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
            this.list[j].wikiMedia_description = key.desc;
            this.list[j].wikiMedia_category = key.category;
            this.list[j].sortName = itemName;
            this.list[j].detailState = 'un-viewed';
            this.list[j].descriptionState = 'un-viewed';
            this.list[j].itemState = 'show';
            break;
          }
        }
        if (!found) {
          let wikiMediaObj:any = this.createItemObject(itemName, key);
          this.list.push(wikiMediaObj);
        }
    });
  }

  /**
   * Create a new item from a WikiMedia list item.
   * @param itemName Name of the item
   * @param key key has desc, and category properties
   */
  createItemObject(itemName: string, key: any) {
    let itemObject:any = {};
    itemObject.wikiMedia_label = itemName;
    itemObject.wikiMedia_description = key.desc;
    itemObject.wikiMedia_category = key.category;
    itemObject.sortName = itemName.split('"').join('');
    itemObject.detailState = 'un-viewed';
    itemObject.descriptionState = 'un-viewed';
    itemObject.itemState = 'show';
    //itemObject.itemOrder;
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
          'category': category
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
