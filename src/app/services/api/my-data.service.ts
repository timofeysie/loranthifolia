import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Category } from '../../interfaces/category';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as wdk from 'wikidata-sdk';
import 'rxjs/add/operator/map';

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
          () => console.log("loadAllPackages: always")
      );
  }

  updateData(data): void {
      this.storage.set('myData', data);
      this.myData.next(data);
  }

}
