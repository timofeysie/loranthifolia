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
  wikiMedia_description: string;
  wikiMedia_category: string;
  sortName: string;
  lang: string;
  detailState:  string; // un-viewed/viewed
  descriptionState:  string; // un-viewed/viewed
  itemState:  string; // show/removed
  itemOrder:  string; // itemOrderNumber
  listSortingProperty:  string; // property name (default sortName)
}