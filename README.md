# A WikiData List app with Ionic 4 alpha 7 

Using the latest alpha for Ionic 4, this project is to create a simple demo app to compare with a React Native app.  The app will parse WikiData and Wikipedia for a list of content and provide a master detail view of the results.


## Table of Contents

### [To do](To-do)
### [Fixing the tests](fixing-the-tests)
### [Implementing Angular routing](Implementing-Angular-routing)
### [Starting the app and parsing WikiData and WikiMedia](Starting-the-app-and-parsing-WikiData-and-WikiMedia)


## Testing on Android

With problems on-going in the [React Native version of this app](), trying out Android here so that we can actually use the app on a device.  The React Native version has to have the server running on local wifi for it to work.  Once this connection is lost, the app stops working.  There may be a way around this, but haven't found it yet.

So, starting with ```$ ionic cordova platform add android``` at 10:35, it's not 10:50 and the terminal is still churning away:
```
Saving android@~6.2.3 into config.xml file ...
> ionic cordova resources android --force
✔ Collecting resource configuration and source images - done!
✔ Filtering out image resources that do not need regeneration - done!
✔ Uploading source images to prepare for transformations: 2 / 2 complete - done!
⠏ Generating platform resources: 14 / 18 complete 
```

That hasn't changed for five minutes.  This may not work with the current alpha version.  Considering updating to the latest alpha.  The project was started with apla 7, but as of four days ago we could use 8...

Then I remembered my nvm woes and used Node version 8.  The plaform was added quickly without issue after that.  

Upon testing the curator lib however, other issues emerged:
```
Failed to compile.
./node_modules/cheerio/node_modules/htmlparser2/lib/WritableStream.js
Module not found: Error: Can't resolve 'stream' in '/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/node_modules/cheerio/node_modules/htmlparser2/lib'
```

Googling ```cheerio Can't resolve 'stream' in htmlparser2/lib'```.
Adding ```stackoverflow``` at the start due to too many GitHub issues discussions in the results.

[This first answer](https://stackoverflow.com/questions/18119201/parse-broken-html-code-using-nodejs-cheerio) talks about the issue:
*cheerio is built around htmlparser2, which is supposed to be "forgiving". If it doesn't parse your page, and I know this is against conventional wisdom, I would parse using regular expressions. This is assuming the page structure won't change much, and it's only that one page you are trying to parse.*

Due to the number and variety of preambles and markup within the html response body, this is a more time consuming and brittle approach for us.  However, the answer is from 2013.  Sooo, have to keep looking here.  But that's the ONLY StackOverflow answer.  Things are not looking so good ofr Ionic now either.

Since it [could be an npm issue](https://github.com/ionic-team/ionic-cli/issues/813), trying ```npm i stream --save```

After that the error is:
```
inherits_browser.js:5 Uncaught TypeError: Cannot read property 'prototype' of undefined
    at inherits (inherits_browser.js:5)
    at Object../node_modules/cheerio/node_modules/parse5/lib/parser/parser_stream.js (parser_stream.js:27)
```

```npm i parse5 --save```:
```
Uncaught TypeError: Cannot read property 'prototype' of undefined
    at inherits (inherits_browser.js:5)
    at Object../node_modules/cheerio/node_modules/parse5/lib/parser/parser_stream.js (parser_stream.js:27)
```
In both cases, if you do not try and use the ```curator.parseSingleWikiMediaPage(result)``` function, the app works as normal.  To do a little more testing, weill build for an Android device now.  With hybrid apps, you never actually know that an app will work until it works on devices.  That's one point for React Native that forces you to use devices to develope apps.

Trying the build for android then causes the following error:
```
(node:15160) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

Install gradle via brew, then we get our next problem:
```
WARNING: The specified Android SDK Build Tools version (26.0.1) is ignored, as it is below the minimum supported version (26.0.2) for Android Gradle Plugin 3.0.0.
Android SDK Build Tools 26.0.2 will be used.
To suppress this warning, remove "buildToolsVersion '26.0.1'" from your build.gradle file, as each version of the Android Gradle Plugin now has a default version of the build tools.
Checking the license for package Android SDK Build-Tools 26.0.2 in /Users/tim/Library/Android/sdk/licenses
Warning: License for package Android SDK Build-Tools 26.0.2 not accepted.
FAILURE: Build failed with an exception.
* What went wrong:
A problem occurred configuring project ':CordovaLib'.
> You have not accepted the license agreements of the following SDK components:
  [Android SDK Build-Tools 26.0.2].
  Before building your project, you need to accept the license agreements and complete the installation of the missing components using the Android Studio SDK Manager.
  Alternatively, to learn how to transfer the license agreements from one workstation to another, go to http://d.android.com/r/studio-ui/export-licenses.html
* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.
* Get more help at https://help.gradle.org
BUILD FAILED in 4m 27s
```

Been here before.  What project was that solved for?  A quick Google might be faster that digging through old notes.  This [duplicate answer](https://stackoverflow.com/questions/39760172/you-have-not-accepted-the-license-agreements-of-the-following-sdk-components) recommends the following way to accept licenses:
```
~/Library/Android/sdk/tools/bin/sdkmanager --licenses
```

There were at least five that needed to be accepted.  Then running the build again: ```ionic cordova build android```.

However, after installing on a device, we get a white screen.  Not optimal.  The app works using ```ionic serve```.  There is this in the console:
```
ERROR TypeError: Cannot read property 'bindings' of undefined
    at SafeSubscriber._next (my-data.service.ts:119)
    at SafeSubscriber.push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.__tryOrUnsub (Subscriber.js:195)
    at SafeSubscriber.push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.next (Subscriber.js:133)
```

However, that's not a show stopper.  It's possible we need to white list https calls in the manifest.  Wont know until we get the device hooked up to remote debugging in Chrome.  Actually, the cable I have is bent.  It works for charging but the developer mode is certainly enabled and USB debugging is definitely turned on.

Have to buy a new one on th'morrow since it's Sunday night.


## To do

When the app is offline, errors should be handled.
This is what shows up currently in the console:
```
GET https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=psychological_pricing 0 ()
core.js:1521 ERROR Error: Uncaught (in promise): Response with status: 0  for URL: null
    at resolvePromise (zone.js:814)
    at resolvePromise (zone.js:771)
```

If the user refreshes the app somehow, they should be sent back to the list page.
Really we need to be saving the previous data in local storage for offline use.  Probably the easiest way to do this is to make this app a PWA and use a service worker to do that.  But this might complicate the basic nature of a demo of the same functionality in both Ionic and React Native.


## Fixing the tests

Having automatically generated tests in Ionic as been a long time coming.  I have had to do much reading along with trial and error to set up tests for Ionic projects only to have them all broken after each major release.  In the past, without an official set up method, it took the efforts of some brave individuals to publish their methods.

Anyhow, now, the CLI will generate tests for us.  I never ran the tests out of the box, but after one week of development, they are all broken.

```
$ npm test
App@0.0.1 test /Users/tim/ionic4/myApp
> ng test
10% building modules 1/1 modules 0 active(node:80786) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
01 07 2018 11:02:38.805:WARN [karma]: No captured browser, open http://localhost:9876
...
Chrome 67.0.3396 (Mac OS X 10.10.5): Executed 2 of 5 SUCCESS (0 secs / 0.28 secs)
Chrome 67.0.3396 (Mac OS X 10.10.5) DetailPage should create FAILED
	Error: StaticInjectorError(DynamicTestModule)[DetailPage -> ActivatedRoute]: 
	  StaticInjectorError(Platform: core)[DetailPage -> ActivatedRoute]: 
	    NullInjectorError: No provider for ActivatedRoute!
	    at NullInjector.get (webpack:///./node_modules/@angular/core/fesm5/core.js?:1208:19)
	    ...
	Expected undefined to be truthy.
	    at UserContext.eval (webpack:///./src/app/pages/detail/detail.page.spec.ts?:22:27)
	    ...
Chrome 67.0.3396 (Mac OS X 10.10.5) DetailPage should create FAILED
```

Time to fix this and maybe even get back to the old eXtreme programming which these days is called BDD.

StaticInjectorError has a lot of action on Google.  Hints for putting this in the app.module imports array ```RouterModule.forRoot([])``` don't help.
"You have to at least provide a base route for your application" says Narm on Feb 28.

We are also getting an error for http:
```
Chrome 67.0.3396 (Mac OS X 10.10.5) HomePage should create FAILED
	Error: StaticInjectorError(DynamicTestModule)[Http]: 
	  StaticInjectorError(Platform: core)[Http]: 
	    NullInjectorError: No provider for Http!
```

Adding imports for HttpModule and HttpClientModule in all the modules doesn't help either.

After running out of issues on a Google search, a reply to [this tut](https://www.joshmorony.com/converting-ionic-3-push-pop-navigation-to-angular-routing-in-ionic-4/) was made so that other things could be worked on besides hitting heads against a brick wall, or similar experiences after testing with Ionic in the past.

Time now for the React Native version of this app!


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

Installed the [WikiData SDK](https://github.com/maxlath/wikidata-sdk):
```
npm install wikidata-sdk --save
```

Created a url for a SPARQL query.  Here is the current query to get a list of cognitive bias.
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

