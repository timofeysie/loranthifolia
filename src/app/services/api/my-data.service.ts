import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Category } from '../../interfaces/category';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as wdk from 'wikidata-sdk';
import 'rxjs/add/operator/map';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  public myData: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
 
  constructor(private storage: Storage, private http: Http) {
    
  }

  load(): void {
    const authorQid = 'Q1127759'
    const sparql = `
        SELECT ?cognitive_bias ?cognitive_biasLabel ?cognitive_biasDescription WHERE {
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
            ?cognitive_bias wdt:P31 wd:Q1127759.
        }
        LIMIT 1000
      `
      const url = wdk.sparqlQuery(sparql);
      this.http.get(url).map((res: any) => {
          return res.json();
        }).subscribe (
          (data: any) => {
            this.myData.next(data.results.bindings);
          },
          (err: any) => console.error("loadAllPackages: ERROR"),
          () => {
            console.log("loadAllPackages: always")
          }
      );
  }  
  
  /** WIP */
  loadWikiMedia(sectionNum): void {
    let action = 'action=parse';
    let section = 'section='+sectionNum;
    let prop = 'prop=text&format=json';
    let page = 'page=List_of_cognitive_biases';
    const baseUrl = 'http://en.wikipedia.org/w/api.php';
    let sectionUrl = baseUrl+'?'+action+'&'+section+'&'+prop+'&'+page;
    this.http.get(sectionUrl).map((res: any) => {
      const parse = res.json();
      const content = parse['parse']['text']['*'];
      let one = this.createElementFromHTML(content);
      let title = this.parseTitle(one);
      const rows = one.getElementsByClassName("wikitable")[0].getElementsByTagName('tr');
      for (let i = 1; i < rows.length;i++) {
        console.log(i+' - '+rows[i].getElementsByTagName('td')[0].innerText);
        //console.log('rows',rows[i].getElementsByTagName('td')[1].innerText);
      }
      //return res.json();
      }).subscribe (
        (data: any) => {
          //console.log('DATA',data);
          //this.myData.next(data.results.bindings);
        },
        (err: any) => console.error("loadAllPackages: ERROR"),
        () => {
          console.log("loadAllPackages: always")
        }
    );
  }

  updateData(data): void {
      this.storage.set('myData', data);
      this.myData.next(data);
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
    console.log('title',title);
    return title;
  }

}
