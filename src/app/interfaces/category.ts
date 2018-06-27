import { Injectable } from '@angular/core';

/**
* "bindings" : [ {
*       "cognitive_bias" : {
*         "type" : "uri",
*         "value" : "http://www.wikidata.org/entity/Q18570"
*       },
*       "cognitive_biasLabel" : {
*         "xml:lang" : "en",
*         "type" : "literal",
*         "value" : "Hawthorne effect"
*       }
* 
*/
export interface Category {
  cognitive_bias: any;
  cognitive_biasLabel: any;
  cognitive_biasDescription: any;
}

@Injectable()
export abstract class TodoListService {
  /**
   * Returns a list of all of the current user's todos.
   */
  abstract getCategories(): Category[];
}