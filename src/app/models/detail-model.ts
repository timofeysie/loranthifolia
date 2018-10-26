/**
 * This will be here temporarily until we decide on the model vs. interface debate
 * and then move the winner out into the Socius/Consort lib.
 */
export class DetailModel {
    cognitive_biasLabel: string;
    cognitive_biasDescription: string;
    wikiMedia_label: string;
    wikiMedia_description: string;
    wikiMedia_category: string;
    sortName: string;
    lang: string;
    // item state
    detailState:  string; // un-viewed/viewed
    descriptionState:  string; // un-viewed/viewed
    itemState:  string; // show/removed
    itemOrder:  string; // itemOrderNumber
    listSortingProperty:  string; // property name (default sortName)
    //
    backupTitle: string; // used when the link title is different from the item name
}