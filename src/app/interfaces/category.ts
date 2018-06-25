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
*     This JSON can create this category:
* 
*     name: cognitive_bias;
*     name_type: uri
*     name_value: http://www.wikidata.org/entity/Q18570
*     xml_lang: en;
*     label_type: literal;
*     label_value: Hawthorne effect;
*/
export interface Category {
    name: string;
    name_type: string;
    name_value: string;
    xml_lang: string;
    label_type: string;
    label_value: string;
}

@Injectable()
export abstract class TodoListService {
  /**
   * Returns a list of all of the current user's todos.
   */
  abstract getCategories(): Category[];
}