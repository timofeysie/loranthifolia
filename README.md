# A WikiData List app with Ionic 4 alpha 7 

Using the latest alpha for Ionic 4, this project is to create a simple demo app to compare with a React Native app.  The app will parse WikiData and Wikipedia for a list of content and provide a master detail view of the results.

## Implementing Angular routing

To go from a list of items to a detail page about the item we will use the standard master/detail pattern supported by the Angular router.

We already have Routes and the RouterModule imported in our app.module.ts file.  I would imagine a blank starter would not have this included, but whatever.  We can now set up our paths in that file as shown in the [Josh Morony](https://www.joshmorony.com/implementing-a-master-detail-pattern-in-ionic-4-with-angular-routing/).

In the past for previous version of Ionic, we used the simple push/pop style of routing.
At that time, the Angular team was finding agreement on a router difficult, and they went through about three routers early on in the Angular 2 development phase.  Now that things have settled down, Ionic has finally made the right choice and supported the Angular router.  I wish they had done this years ago, but Ionic is a company with their own timeline.

To start we will need a detail page to route to.  Using the [Ionic CLI generate command](https://ionicframework.com/docs/cli/generate/):
```
$ ionic generate page pages/detail
> ng generate page pages/detail
CREATE src/app/pages/detail/detail.module.ts (543 bytes)
CREATE src/app/pages/detail/detail.page.scss (0 bytes)
CREATE src/app/pages/detail/detail.page.html (133 bytes)
CREATE src/app/pages/detail/detail.page.spec.ts (691 bytes)
CREATE src/app/pages/detail/detail.page.ts (261 bytes)
UPDATE src/app/app-routing.module.ts (541 bytes)
[OK] Generated page!
```

The routing module will now contain this code:
```
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'detail', loadChildren: './pages/detail/detail.module#DetailPageModule' },
];
```

We just have to add the /:id part to the detail path in order to send thru the item needed to show the details for.  This would then make the Routes detail entry look like this:
```
{ path: 'detail/:id, loadChildren ... etc }
```

Next, we can change the item to a link with the following code:
```
routerLink="/detail/{{ item.cognitive_biasLabel.value }}" 
```

Now the items will link to an about page.  To get the id from the url, we do something like this:
```
  constructor(private route: ActivatedRoute) { }
  ionViewWillEnter(){
    let itemId = this.route.snapshot.paramMap.get('id');
  }
```

Since this is the name of the bias, we can use that for the heading of page.
Next, we need a service to get single item, and a back button.


## Starting the app and parsing WikiData and WikiMedia

Using [this tut](https://mhartington.io/post/ionic-4-alpha-test/) as a starting point for an Ionic 4 alpha 7 app.
```
npm install -g ionic@rc
ionic start myApp blank --type=angular
```

Added a service to use the rxjx behavior subject like in [this tut](https://www.joshmorony.com/using-behaviorsubject-to-handle-asynchronous-loading-in-ionic/)
```
ionic generate service services/api/data_service
```

Filled in the interface like [this](https://hackernoon.com/creating-interfaces-for-angular-services-1bb41fbbe47c) with the properties we want from an expected result.

In stalled the [WikiData SDK](https://github.com/maxlath/wikidata-sdk) to create the url for a SPARQL query.

Here is the current query to get a list of cognitive bias.
```
SELECT ?item ?itemLabel 
WHERE 
{
  ?item wdt:P31 wd:Q18570.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
```

However, this is always limited to 90.  There must be over 200 on the Wikipedia page.
WikiData is preferred, but since it is incomplete, we will also have to use Wikipdedia's MediaWiki API.

If we wanted to get the missing descriptions for our incomplete list of bias, we could do WikiMedia query like this:
```http://en.wikipedia.org/w/api.php?action=query&rvprop=content&prop=text&format=json&titles=magical%20thinking```

That returns JSON like this:
```
{
   "batchcomplete": "",
   "query": {
        "normalized": [
            {
                "from": "magical thinking",
                "to": "Magical thinking"
            }
        ],
        "pages": {
            "185307": {
                "pageid": 185307,
                "ns": 0,
                "title": "Magical thinking",
                "revisions": [
                    {
                        "contentformat": "text/x-wiki",
                        "contentmodel": "wikitext",
                        "*": "{{other uses}}\n'''Magical thinking''' is a term used in [[anthropology]] and [[psychology]], denoting the [[non causa pro causa|fallacious attribution]] of [[causality|causal relationships]] between actions and events, with subtle differences in meaning between ...
                    }
                ]
            }
        }
    }
}
```

The reason WikiData is good as it is more machine readable.  Wikipedia is human readable which means we will have all sorts of formatting issues that must be dealt with.

For example, the * property starts with escaped content (other uses) and bold text signified by quotes.
Rather than parse all this stuff, it would be nice to use a mark down renderer.  However, this is not markdown.  Maybe we should look at the other formats available for the queries.


'''Magical thinking''' is a term used in [[anthropology]] and [[psychology]], denoting the [[non causa pro causa|fallacious attribution]] of [[causality|causal relationships]] between actions and events, with subtle differences in meaning between ...

This version will return html which might be better for our purposes:
```http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page=magical%20thinking```

```
{
    "parse": {
        "title": "Magical thinking",
        "pageid": 185307,
        "text": {
            "*": "<div class=\"mw-parser-output\"><div role=\"note\" class=\"hatnote navigation-not-searchable\">For other uses, see <a href=\"/wiki/Magical_thinking_(disambiguation)\" class=\"mw-disambig\" title=\"Magical thinking (disambiguation)\">Magical thinking (disambiguation)</a> ...
```

Removing the html tags would produce something like this:
```
For other uses, see Magical thinking (disambiguation).\nMagical thinking is a term used in anthropology and psychology, denoting the fallacious attribution of causal relationships between actions and events, with subtle differences in meaning between the two fields. In anthropology, it denotes the attribution of causality between entities grouped with one another (coincidence) or similar to one another.\nIn psychology, the entities between which a causal relation has to be posited are more strictly delineated; here it denotes the belief that one's thoughts by themselves can bring about effects in the world or that thinking something corresponds with doing it.[1] In both cases, the belief can cause a person to experience fear, seemingly not rationally justifiable to an observer outside the belief system, of performing certain acts or having certain thoughts because of an assumed correlation between doing so and threatening calamities.\n\n\n^ Colman, Andrew M. (2012). A Dictionary of Psychology (3rd ed.). Oxford University Press.\n\n\n\n\n\n\n
```

We can also remove references ([1]) and newlines but I'm thinking newlines would be helpful.  If the first sentence is a disambiguation link, then we could also remove that.

The above will still not give us a complete list.  What is the WikiMedia query to get the full list as shown on Wikipedia?

```http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page=List%20of%20cognitive%20bias```

This returns a redirect message which asks that the caller use the page link redirected to.  The page value actually needs to have underscores now apparently.  This link:
```http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page=List_of_cognitive_biases```

This will return the description.  

A note on WikiMedia calls made from the Ionic app, you might get a message like this in the console:
```
my-data.service.ts:70 loadAllPackages: ERROR
(anonymous) @ my-data.service.ts:70
...
home:1 Cross-Origin Read Blocking (CORB) blocked cross-origin response https://en.wikipedia.org/w/api.php?action=parse&section=2&prop=text&format=json&page=List_of_cognitive_biases with MIME type application/json. See https://www.chromestatus.com/feature/5629709824032768 for more details.
```

I have the Chrome CORS plugin installed that will allow me to get around this for development purposes.  It should run OK on a device because there is no origin for device apps.  We may have a problem with the https calls later, especially when we want to publish to the app stores, but not to worry about that now.  Turning on the CORS plugin makes the calls work.  On a side note, I had to turn this off to create the repo on GitHub, which would not allow me to choose a name for this repo while the plugin was on!

NOW What about the actual list?

What will section 1 look like?
```
<div class=\"mw-parser-output\">
   <h2><span id=\"Decision-making.2C_belief.2C_and_behavioral_biases\"></span><span class=\"mw-headline\" id=\"Decision-making,_belief,_and_behavioral_biases\">Decision-making, belief, and behavioral biases</span><span class=\"mw-editsection\"><span class=\"mw-editsection-bracket\">[</span><a href=\"/w/index.php?title=List_of_cognitive_biases&amp;action=edit&amp;section=1\" title=\"Edit section: Decision-making, belief, and behavioral biases\">edit</a><span class=\"mw-editsection-bracket\">]</span></span></h2>\n
   <p>Many of these biases affect belief formation, business and economic decisions, and human behavior in general.</p>   \n
   <table class=\"wikitable\">\n
      <tr> \n
         <th scope=\"col\" style=\"width:25%;\">Name</th>\n
         <th scope=\"col\" style=\"width:75%;\">Description</th>         \n
      </tr>      \n
      <tr>         \n
         <td><a href=\"/wiki/Ambiguity_effect\" title=\"Ambiguity effect\">Ambiguity effect</a></td> \n
         <td>The tendency to avoid options for which missing information makes the probability seem \"unknown\".<sup id=\"cite_ref-1\" class=\"reference\"><a href=\"#cite_note-1\">[1]</a></sup></td>    \n
      </tr>
      ...
       <tr>            \n
            <td>Unit bias</td>            \n
            <td>The tendency to want to finish a given unit of a task or an item. Strong effects on the consumption of food in particular.<sup id=\"cite_ref-72\" class=\"reference\"><a href=\"#cite_note-72\">[72]</a></sup></td>            \n
        </tr>
```

So now we are back in the 2000s parsing html for content.  Maybe it would be a better idea just to update WikiData with the content from Wikipedia?  Otherwise we will have to merge two lists, as well as filling in missing descriptions.  The other categories are:

Section 2: Social biases
Section 3: Memory errors and biases
Section 4: Common theoretical causes of some cognitive biases

How do we know programmatically the fact that the list is from section 1-3, and does not include section 4 (that category is not part of the list any more)?  There must be a way to query the page to get the sections for the list itself.  We will have to go with the hard coded category for now until more is understood about WikiData and Wikipedia APIs.

Now, there is only one wikitable class per section.  So we only need to create a DOM node out of that <table class=\"wikitable\"> tag, and then get the text of all it's children.  Each row contains a name and a description it two <td> tags.  We can then create objects that collect the category and merge all three lists. 

While trying to do this the html result was actually recommending format=json for application use.  That will return the html content segment as the * content like this:
```
{
  "parse": {
    "title": "List of cognitive biases",
    "pageid": 510791,
    "text": {
      "*": "<div class=\"mw-parser-output\"><h2><span id=\"Decision-making.2C_belief.2C_and_behavioral_biases\">
```

To get the list, we create an element object out of the string kind of like this if it were all on one line:
```
document.createElement('div').innerHTML = res.json().parse['parse']['text']['*'];
```

Then get the table rows like this:
```
const rows = html.getElementsByClassName("wikitable")[0].getElementsByTagName('tr');
```

Next we will have to merge all three lists, merge that with the WikiData list, and create some navigation to go to a detail page to show everything about each item.  We can also create the slide actions to implement the spaced repetition learning features.  But one thing at a time.  It might also be time to create the React Native version of the app and think about extracting out the parsing utilities so they can be used in both projects.

