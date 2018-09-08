import { Injectable } from '@angular/core';
import { Category } from '../../interfaces/category';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {
  private backendListUrl = 'https://radiant-springs-38893.herokuapp.com/api/list';
  private backendWikiListUrl = 'https://radiant-springs-38893.herokuapp.com/api/wiki-list';
  /**
   * private storage: Storage, 
   */
  constructor(private http: Http,private  httpClient:  HttpClient) {
  }

  /**
   * /api/list
   * @param lang 
   */
  getWikiDataList(lang: string) {
    return this.httpClient.get<Category>(this.backendListUrl+'/'+lang)
      .pipe(data => data);
  }
  
  /**
   * /api/wiki-list
   * @param sectionNum 
   * @param lang 
   * @param leaveCaseAlone 
   */
  loadWikiMedia(sectionNum, lang: string) {
    return this.httpClient.get(this.backendWikiListUrl+'/'+sectionNum+'/'+lang)
      .pipe(data => data)
  }

  /**
   * WIP.
   * TODO: Catch and reject errors here.  Not sure if we want to use a promise here however.
   * @param pageName 
   */
  getDetail(pageName: string, lang: string, leaveCaseAlone: boolean) {
    const backendDetailUrl = encodeURI('https://radiant-springs-38893.herokuapp.com/api/detail/'+pageName+'/'+lang+'/'+leaveCaseAlone);
    return this.httpClient.get(encodeURI(backendDetailUrl))
      .pipe(data => data);
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
