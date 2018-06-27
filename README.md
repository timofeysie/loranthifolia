# WikiData List with Ionic 4 alpha 7 

## So far

Using [this tut](https://mhartington.io/post/ionic-4-alpha-test/) as a starting point for an Ionic 4 alpha 7 app.
```
npm install -g ionic@rc
ionic start myApp blank --type=angular
```

Adding a service to use the rxjx bahaviour subject like in [this tut](https://www.joshmorony.com/using-behaviorsubject-to-handle-asynchronous-loading-in-ionic/)
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
WikiData is preferred, but since it is imcomplete, we will also have to use Wikipdedias MediaWiki API.

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

This will return the description.  What about the actual list?

What will section 1 look like?
```
<div class=\"mw-parser-output\">
   <h2><span id=\"Decision-making.2C_belief.2C_and_behavioral_biases\"></span><span class=\"mw-headline\" id=\"Decision-making,_belief,_and_behavioral_biases\">Decision-making, belief, and behavioral biases</span><span class=\"mw-editsection\"><span class=\"mw-editsection-bracket\">[</span><a href=\"/w/index.php?title=List_of_cognitive_biases&amp;action=edit&amp;section=1\" title=\"Edit section: Decision-making, belief, and behavioral biases\">edit</a><span class=\"mw-editsection-bracket\">]</span></span></h2>
   \n
   <p>Many of these biases affect belief formation, business and economic decisions, and human behavior in general.</p>
   \n
   <table class=\"wikitable\">
      \n
      <tr>
         \n
         <th scope=\"col\" style=\"width:25%;\">Name</th>
         \n
         <th scope=\"col\" style=\"width:75%;\">Description</th>
         \n
      </tr>
      \n
      <tr>
         \n
         <td><a href=\"/wiki/Ambiguity_effect\" title=\"Ambiguity effect\">Ambiguity effect</a></td>
         \n
         <td>The tendency to avoid options for which missing information makes the probability seem \"unknown\".<sup id=\"cite_ref-1\" class=\"reference\"><a href=\"#cite_note-1\">[1]</a></sup></td>
         \n
      </tr>
      ...
       <tr>
            \n
            <td>Unit bias</td>
            \n
            <td>The tendency to want to finish a given unit of a task or an item. Strong effects on the consumption of food in particular.<sup id=\"cite_ref-72\" class=\"reference\"><a href=\"#cite_note-72\">[72]</a></sup></td>
            \n
        </tr>
```

So now we are back in the 2000s parsing html for content.  Maybe it would be a better idea just to update WikiData with the content from Wikipedia?  Otherwise we will have to merge two lists, as well as filling in missing descriptions.
