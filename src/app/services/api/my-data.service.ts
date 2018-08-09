import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { Storage } from '@ionic/storage';
import { Category } from '../../interfaces/category';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import * as wdk from 'wikidata-sdk';
import 'rxjs/add/operator/map';
import { forEach } from '@angular/router/src/utils/collection';
import * as curator from 'art-curator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  public myData: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public mediaData: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  wikiMediaEntries: Map <string,string>;
  private backendListUrl = 'https://radiant-springs-38893.herokuapp.com/api/list';
  /**
   * private storage: Storage, 
   */
  constructor(private http: Http,private  httpClient:  HttpClient) {
    this.wikiMediaEntries = new Map();
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

  getWikiDataList() {
    return this.httpClient.get<Category>(this.backendListUrl)
      .pipe(data => data);
  }
  
  /** WIP
   * 
   * After the res.json() call, we get:
   {
    parse: {
      pageid:510791
      text: {
        *:"<div class="mw-parser-output">
          <h2>
            <span class="mw-headline" id="Social_biases">Social biases</span>
            <span class="mw-editsection">
              <span class="mw-editsection-bracket">[</span>
              <a href="/w/index.php?title=List_of_cognitive_biases&amp;action=edit&amp;section=1" 
                title="Edit section: Social biases">edit</a>
              <span class="mw-editsection-bracket">]</span>
            </span>
          </h2>↵
          <p>Most of these biases are labeled as 
            <a href="/wiki/Attribution_bias" title="Attribution bias">attributional biases</a>.↵
          </p>↵
          <table class="wikitable">↵↵
          <tbody>
            <tr>↵
              <th scope="col" style="width:25%;">Name↵</th>↵
              <th scope="col" style="width:75%;">Description↵</th>
            </tr>↵
            <tr>↵
              <td><a href="/wiki/Actor-observer_bias" class="mw-redirect" title="Actor-observer bias">Actor-observer bias</a>↵</td>↵
              <td>The tendency for explanations of other individuals' behaviors to overemphasize the influence of their personality and underemphasize the influence of their situation (see also <a href="/wiki/Fundamental_attribution_error" title="Fundamental attribution error">Fundamental attribution error</a>), and for explanations of one's own behaviors to do the opposite (that is, to overemphasize the influence of our situation and underemphasize the influence of our own personality).↵</td></tr>↵<tr>↵<td><a href="/wiki/Authority_bias" title="Authority bias">Authority bias</a>↵</td>↵<td>The tendency to attribute greater accuracy to the opinion of an authority figure (unrelated to its content) and be more influenced by that opinion.<sup id="cite_ref-1" class="reference"><a href="#cite_note-1">&#91;1&#93;</a></sup>↵</td></tr>↵<tr>↵<td><a href="/wiki/Defensive_attribution_hypothesis" title="Defensive attribution hypothesis">Defensive attribution hypothesis</a>↵</td>↵<td>Attributing more blame to a harm-doer as the outcome becomes more severe or as personal or situational <a href="/wiki/Similarity_(psychology)#Social_psychological_approaches" title="Similarity (psychology)">similarity</a> to the victim increases.↵</td></tr>↵<tr>↵<td><a href="/wiki/Egocentric_bias" title="Egocentric bias">Egocentric bias</a>↵</td>↵<td>Occurs when people claim more responsibility for themselves for the results of a joint action than an outside observer would credit them with.↵</td>
            </tr>↵
            <tr>↵
              <td><a href="/wiki/Extrinsic_incentives_bias" title="Extrinsic incentives bias">Extrinsic incentives bias</a>↵</td>↵
              <td>An exception to the <i>fundamental attribution error</i>, when people view others as having (situational) extrinsic motivations and (dispositional) intrinsic motivations for oneself↵</td>
            </tr>↵
        ↵</div>"
      }
      title:"List of cognitive biases"
    }
  }
   */
  loadWikiMedia(sectionNum) {
    return new Promise((resolve, reject) => {
      let action = 'action=parse';
      let section = 'section='+sectionNum;
      let prop = 'prop=text&format=json';
      let page = 'page=List_of_cognitive_biases';
      const baseUrl = 'http://en.wikipedia.org/w/api.php';
      let sectionUrl = baseUrl+'?'+action+'&'+section+'&'+prop+'&'+page;
      this.http.get( sectionUrl).map((res: any) => {
        const parse = res.json();
        const content = parse['parse']['text']['*'];
        let one = this.createElementFromHTML(content);
        let title = this.parseTitle(one);
        const rows = one.getElementsByClassName("wikitable")[0].getElementsByTagName('tr');
        for (let i = 1; i < rows.length;i++) {
          let name = rows[i].getElementsByTagName('td')[0].innerText;
          this.wikiMediaEntries.set(name,title);
        }
        return this.wikiMediaEntries
      }).subscribe (
        (data: any) => {
          resolve(this.wikiMediaEntries);
        },
        (err: any) => console.error("loadAllPackages: ERROR"),
        () => {
          console.log("loadAllPackages: always")
        }
      );
    });
  }

  /**
   * WIP.
   * TODO: Catch and reject errors here.  Not sure if we want to use a promise here however.
   * @param pageName 
   */
  loadSingleWikiMediaPage(pageName) {
    return new Promise((resolve, reject) => {
      const baseUrl = 'https://radiant-springs-38893.herokuapp.com/api/detail/'+pageName;
      let headers = new Headers();
      headers.append('content-type','application/json');
      let myParams = new URLSearchParams();
      myParams.set('credentials', 'true');
      myParams.set('withCredentials', 'true');
      let options = new RequestOptions({ headers:headers, params: myParams });
      this.http.get(baseUrl, options)
        .toPromise().then((res: any) => {
          const parse = res.json();
            let content = parse['description'];
            content = content.replace('</div>',''); // why is this even here?
            resolve(content);
        });
    });
  }

  updateData(data): void {
      //this.storage.set('myData', data);
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
    return title;
  }

  getWikiMediaDescription(name: string) {
    return this.wikiMediaEntries.get(name);
  }

}
