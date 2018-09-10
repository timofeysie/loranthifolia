# A WikiData List app with Ionic 4 alpha 7 

Using the latest alpha for Ionic 4, this project is to create a simple demo app to compare with a React Native app.  The app will parse WikiData and Wikipedia for a list of content and provide a master detail view of the results.

Hakea loranthifolia is of the genus Hakea native to an area in the Wheatbelt region of Western Australia.  It typically grows to a height of 2 to 3 metres (7 to 10 ft). It blooms from August to September and produces white flowers.


## Work flow

To run the app in development, use ```ionic serve```.

To test on a device, with [Capacitor](https://capacitor.ionicframework.com/), the workflow is:
```
ionic build
npx cap copy
npx cap open
```

This will ask you what kind of project you want to work with, for example, Android.  You could also choose iOS, Electron, or a PWA.  This will open the appropriate IDE such as Android Studio or Xcode after returning you to the prompt.  You can then build and deploy the project from there.

To add a plugin and update dependencies:
```
npm install totally-cool-plugin-baby
npx cap update
```

#

## Table of Contents

1. [The options page & i18n](#The options page & i18n)
1. [Short descriptions & incomplete API references](#Short descriptions & incomplete API references)
1. [Item state](#Item state)
1. [API service caching vs local storage](#API service caching)
1. [Scroll Position Restoration](#Scroll Position Restoration)
1. [Merging the WikiMedia lists](#Merging the WikiMedia lists)
1. [Ionic 4 Beta and using the Conchifolia server](#ionic-4-beta-and-using-the-conchifolia-server)
1. [Using Capacitor](#using-Capacitor) 
1. [Blocked Requests](#Blocked-Requests)
1. [Testing on Android](#Testing-on-Android)
1. [Fixing the tests](#fixing-the-tests)
1. [Implementing Angular routing](#Implementing-Angular-routing)
1. [Starting the app and parsing WikiData and WikiMedia](#Starting-the-app-and-parsing-WikiData-and-WikiMedia)

#

## The options page & i18n

Planned features for the options page are:

1. language change option
2. save named list changes in local storage
3. create a new category

Changing the category is unlikely at this point.  The conditions would be that there is a "list of x" on Wikipedia, and had sections that can be scraped the same as the list of cognitive biases.  We could offer a list of fallacies and see how that goes.  Then lay the rules out for the user to add new ones and see how they go.

But right now, changing the language should be doable.

At least it appears simple on the surface.  Maybe it is but it will need a little planning.  There are two aspects to i18n in this app that need to be considered.

The first is aspect A, is changing the static text content in the app via language bundles.  This is what most people think about when they do i18n.  Using [ngx translate](https://github.com/ngx-translate/core), it would work like this:
```
<h2>{{"home" | translate }}</h2>
```

We will have to manually translate all our system text to languages we want to support.  One way around this would be to programmatically use [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Main_Page) to translate the words, hoping that we get the right translations.

Aspect B is about our dynamic content, it is all coming from API calls, so translating those would be as simple as changing the language parameter in the service.  So we can add the option to our local storage and get that value before making the call.

However, our current local storage has one list.  What we will need to do is one of these:
1. replace that list (and lose all the state info attached to it)
2. replace that list (and copy all the state info hoping the lists match)
3. add the list (using some naming convention like list-en, list-kr)
4. anyone else have another idea?

It seems like we will have to say goodbye to our simple app.  The simplest way for now is to ignore the problem and go with option 1.  But I'm pretty attached to my item states, as it helps me see what I've looked at and what is remaining.

So then option 2 would be better.  At least we don't know yet if there will be a problem with option 2, so we should start with 1 and see what happens.

We could follow one of the [accepted ways of doing app properties](https://stackoverflow.com/questions/43193049/app-settings-the-angular-way), but since we want each user to be able to have their own settings which means using our local storage, we may as well re-use the data storage service to save an array of settings that can be retrieved from anywhere in the app.

First, convert the data storage class to use the name of the item being passed in and retrieved so that we can use the same functions we already have for both the list and the options.

Next, we will have to modify the [Conchifolia NodeJS server app](https://github.com/timofeysie/conchifolia) to accept a local for the API calls.

That was easy to type, but a few days later, the job is still not done.  In order to use language settings in the API calls, the lib that creates the URLs for the calls needs to also accept the language args.  So that was a major change for those API signatures, so it went to version 3.0.  

After adding the language, it was time to test it our in the Angular app served by the Conchifolia server.  This is when it seemed like we wouldn't be able to do this at all.  Using Korean, there were no WikiMedia sections, and the WikiData list was mainly just data pages and not available in Korean.  There ended up being only 28.

Then, the detail pages weren't working.  After working on the library and the server apps, as well as the [demo implementation website](https://github.com/timofeysie/conchifolia), it was almost three week before getting back to implementing the i18n list here.  Work was also done on the site for missing descriptions and URL redirects.  There may be some code there that can be shared, so we can look at that as we make the changes to bring this project up to the same feature level as the website.

The error on the detail page is:
```
ERROR Error: Uncaught (in promise): SyntaxError: Unexpected token < in JSON at position 0
SyntaxError: Unexpected token < in JSON at position 0
    at JSON.parse (<anonymous>)
```

We have an API change for our service:
```
get('/api/list/:lang')
get('/api/wiki-list/:id/:lang')
get('/api/detail/:id/:lang')
```

And the service in Conchifolia looks like this:
```
  private backendListUrl = '/api/list';
  private backendDetailUrl = '/api/detail';
  private backendWikiListUrl = '/api/wiki-list';
  // /api/list
  getList(lang) {
      return this.httpClient.get<ListModel>(this.backendListUrl+'/'+lang)
      .pipe(data => this.listData = data);
  }
  // /api/wiki-list
  getDetail(detailId: string, lang: string, leaveCaseAlone: boolean) {
    return this.httpClient.get<DetailModel>(encodeURI(this.backendDetailUrl
        +'/'+detailId+'/'+lang+'/'+leaveCaseAlone))
      .pipe(data => data);
  }
  loadWikiMedia(sectionNum, lang: string) {
    return this.httpClient.get(
      encodeURI(
        this.backendWikiListUrl + '/' + sectionNum + '/' + lang))
      .pipe(data => data)
  }
```

With a little bit of modification, we have this for details:
```
getDetail(pageName: string, lang: string, leaveCaseAlone: boolean) {
    const backendDetailUrl = encodeURI('https://radiant-springs-38893.herokuapp.com/api/detail/'
        +pageName+'/'+lang+'/'+leaveCaseAlone);
    return this.httpClient.get(encodeURI(backendDetailUrl))
      .pipe(data => data);
}
```  

That fixes that!

Next, use our language setting.  We will have to first load the preference, and then decide on a UX problem that the web app dealt with in a different way.  There, the language choice is on the list page itself.  No options page was created there to save time (ha!).  We also need a way to update the list.  Then we need to save the lists in local storage with the language as part of the list name.

Right now, there is no way to reload the list.  This is also something that was added to the web app to make development easier.  A refresh icon next to the name (where we have the version number here).  So whenever we updated the parse functionality, for example to solve some of the missing redirects, we could click that icon and the list would refresh with the new parse stuff called.

When creating the options page, it crossed someones mind at least that the user then would not see the list change, either until they went back to the list, or if we programmatically send them back to the list page to watch it repopulate.  That sounds like the best option.  We can predict that there will be more options, and don't want to have the situation where the user does several option changes at once and then goes back, which means we would need some kind of command pattern functionality, which is beyond the score of this app for now.  So the send the user back after a change (prompted? nah) and reload the list then.

After calling the ```this.router.navigateByUrl('/home');``` function when the language is changed, the app seems to work and returns to the home (list) page.  But if you do it two more times, the third time, the app will not return to the home page.  If you choose the back button, there appears to be multiple pages added.

Instead of a *naviagate* or *navigateToUrl* function, switching to this works:
```
this.location.back();
```

Next, on the main list home page, we need to listen to a returned navigation event and reload the list with the changed encoding.

After that,
1. loading spinners
2. short description layout


Listening on the list page, these events will get called after the language change has been confirmed on the details page:
```
ngDoCheck
ngAfterContentChecked
ngAfterViewChecked
... repeat 15 or so times ...
```

So if we get the language preference from storage, and it is different from the current list settings (how do we know what language is the current list is showing?) then we can reload the list (either from storage or http as usual).

The performance of this system could be noticeable unless we use an observable, or behaviour subject.  Even then, it's a waste to slow down the entire app for this check.  Let's look into hook into the navigation change event.  

This didn't work:
```
this.activatedRoute.url.subscribe(url =>{
    console.log('url',url);
});
```

This does:
```
this.router.events.forEach((event) => {
    if(event instanceof NavigationEnd && this.router.url === '/home') {
        // reload list
    }
});
```

After re-organizing the way the list is loaded, we get a list that will flow from the language settings.  But, the Korean version is a list of WikiMedia info page ids like this: Q18570.  What did we do in the web app version?  A good thing about having these notes is that the answer to this question and how to solve it is listed in the readme on the Conchifolia project.  The first problem is that the Korean encoding is ko not kr, which is the locale name.

Next, there is no Korean list of cognitive bias.  What we see is a list of pages that are all in multiple languages.  The WikiMedia page is there so after parsing that, an entry that starts with a Q and has 5 digits following can be excluded because there is no Korean page for that bias. 

The function to remove Q-codes looks like this:
```
  /*
   * If a page only has a Q-code, it does not have data for that item in the language requested.
   * Example:
   * "cognitive_biasLabel" : {
   *     "type" : "literal",
   *     "value" : "Q177603"
   * }
   * @param item WikiData item to check if a language page exists
   */
  languagePageDoesNotExist(item, index) {
    let label = item.cognitive_biasLabel;
    let first = label.substr(0,1);
    let second = label.substr(1,2);
    if (first === 'Q' && !isNaN(second) || typeof label === 'undefined') {
        // no page exists
        return false;
    } else {
      // page exists
      return true;
    }
  }
```

This will be the second time that we need this code but in two different projects.  We will also need to do this for the React app.  Since there will be more business logic shared across projects, it's not a bad idea to have another library that can contain this kind of function.

We can use the rule of three: if you have to cut and paste functions, on third it should be refactored out into shared code.  So when faced with implementing all this again the next time, we can look at what will work as a tool function.  Remember earlier on in this project, adding DOM parsing functionality in the curator lib ruined both Ionic and React Native app builds and took up loads of time until it was realized that some JavaScript from NodeJS land will not work in the browser.  So basically we need a backend lib, and a front end lib.
 



## Short descriptions & incomplete API references

The WikiData descriptions are few and far between.  But they are the most important going forward.  Second to those are the WikiMedia descriptions.  These will be used when there is no WikiData description available.  Third will be the user generated description.  This will be either one of the first two by default, but can be changed by the user.  I imagine people cutting and pasting from the long Wikipedia description to create this, so that's what we will start with here.

First off, we have a sliding item that reveals the description, which is cut off after two lines.  The first idea is to expand that section when opened.  This may not work but it's worth trying as the first effort here.

The [API for the sliding lists](https://beta.ionicframework.com/docs/api/item-sliding) has events and methods.


The ```ionDrag``` event is emitted when the sliding position changes.
The ```closeOpened()``` method closes all of the sliding items in the list. Items can also be closed from the List.

Components also have selectors and available properties.  However, for the sliding list, there is no indication of a class that can be injected into our page to call the method on.  I would be helpful to have full examples that show usage of the events, methods, selectors and available properties.

The attributes listed in the docs for button show:
```
<ion-button shape="round" color="primary" fill="outline">Hello World</ion-button>
```

The API page shows this in the properties section:
```
Shape
Attribute:  shape 
Type: string
The button shape. Possible values are: "round".
```

So that's the properties/attributes.  Since these are all web components now, they might all be properties/attributes.

As in Angular, we could try:
```
[ionDrag]="ourDragFunction()"
```

This causes the template error:
```
ERROR Error: Uncaught (in promise): Error: Template parse errors:
Can't bind to 'ionDrag' since it isn't a known property of 'ion-item'.
```

What about the closeOpened() function?  Do we just add that to our class?  We would need an injected object to call that on, no?

There must be somewhere in the docs the usage is detailed.

In the API reference for the action sheet component, we have the ActionSheetController controller injected into a class.  It is used to call this function: ```this.actionSheetController.create({...})```

There is no create() function in the methods section.  The next item in the API reference however is the [controller](https://beta.ionicframework.com/docs/api/action-sheet-controller) which has create(),
 dismiss() and getTop() functions.

 But the action sheet shows methods such as ionActionSheetDidDismiss and ionActionSheetWillPresent.  

 We could try this our on a list controller, but there is no list controller mentioned.  In the popover docs it says: *To present a popover, call the present method on a popover instance.*

That instance is returned by the create function:
```
const popover = await this.popoverController.create({...})
```

But since there is no controller for our list...  Going to ask on Slack.

Hi everyone.  How does one use the events, methods and selectors listed in the Ionic 4 beta docs without examples?  The [sliding item docs](https://beta.ionicframework.com/docs/api/item-sliding) show a ```ionDrag``` event and the ```closeOpened()``` method.  But there is no list controller to inject and call functions on.  Is there another place in the docs where the API event, method and selector features have example code? 

Looking at the rate of questions answered in the technical-questions chat, it's not going to get answered.

Someone else asked a [similar question](https://forum.ionicframework.com/t/ionic-4-beta2-correct-usage-of-ion-tabs-methodes/138225) on the forums with no answer in three days.  I'll keep you posted.

Using the old method to get the events does not work either.
We did change the import but still there was nothing (undefined):
```
import { Events } from 'ionic-angular' to '@ionic/angular';
...
events.subscribe('ionDrag', (what) => { ...
```

A common way to get a handle on an element/component is using the Angular @ViewChild annotation.  These references use a #marker syntax in the template, but the references aren't available until after the constructor has run, so we have to extend the after view init which will then call this function when the ui is ready.  But, which one is correct?  Just saw the second one below with async for the first time:
```
  ngAfterViewInit() {
  public async ngAfterViewInit(): Promise<void> {
```

Someone posted this solution to their problem;
```
@ViewChild('detailNav', { read: Nav }) detailNav: Nav;
```

[This post](https://github.com/ionic-team/ionic/issues/15046#issuecomment-412128537) shows that Ionic 4 is still a work in process.  Brandy Scarney on the Ionic team commented 6 days ago
*I believe this issue has two parts to it: the update is being called prior to the slides being loaded, and the slides component is being read in as an ElementRef instead of a Slides component.  We're going to see if we can find a way to get this working without passing to the read property.*

She has this example which implements something [discussed on this forum post](https://forum.ionicframework.com/t/slides-viewchild/137328/7):
```
import { Slides } from '@ionic/angular';

@Component({
  ...
})
export class TutorialPage {

  @ViewChild('slides', { read: Slides }) slides: Slides;

  ionViewDidEnter() {
    this.slides.update();
  }
}
```

This is critical info without which it seems much of the API reference is useless.

We might have to give up on this planned feature until this is either clarified in the docs or 'fixed'.

First, let's give it a try:
```
import { ItemSliding } from '@ionic/angular';
...
@ViewChild('itemSliding', { read: ItemSliding }) itemSliding: ItemSliding;
...
public async ngAfterViewInit(): Promise<void> {
    console.log('itemSliding',this.itemSliding);
}
```

In the template we have:
```
<ion-item-sliding #itemSliding *ngFor="let item of list; let i = index">
```

But the result is still undefined.  Also tried this based on [a similar issue](https://github.com/ionic-team/ionic/issues/15176): 
```
@ViewChild('itemSliding', { read: ItemSliding }) private itemSliding: ItemSliding;
```



We might want to try upgrading to the latest beta.  We are currently using:
```
"@ionic/angular": "4.0.0-alpha.7",
```

But, being offline right now, what can we actually work on?  Add padding to the description, limit the number of lines with an ellipsis pipe?

Using the ```padding-start``` [element padding](https://beta.ionicframework.com/docs/layout/css-utilities#content-space)a has no effect.

A long description can be seen with the default Actor-observer bias WikiMedia one:
"The tendency for explanations of other individuals' behaviors to overemphasize the influence of their personality and underemphasize ...".  Since these are supposed to be short reminder descriptions set by the user, it's probably a good idea to limit the length anyhow.  Make the user try harder to make a concise description that is meaningful to them.

That's 132 characters at the end of 'underemphasize'. This is the easiest way to accomplish this:
```
{{ item.wikiMedia_description | slice:0:132 }}
```

Done.  However, if we can get some margin in there, it should be a little shorter.  And we should append some ellipsis to show that it has actually be truncated.



## Item state

The planned features for state are as follows:
1. bookmark the last viewed item
1. let the user build a short description
1. swipe right to see short description
1. wipe up/down on the short description to send the item to the top/bottom of the list
1. swipe right to remove it from the list

Starting with the first item would be easy, but let's think about a state system to support all these features.  It looks like we have three separate states to keep:
```
detailState: un-viewed/viewed
descriptionState: un-viewed/viewed
itemState: show/removed
itemOrder: itemOrderNumber
```

If you read the [Scroll Position Restoration](#Scroll Position Restoration) section, you know that Angular will take care of this for us (once Ionic has released a version that has started using 6.1).  But we still have an issue with our sort and overriding that.  We will want to let the user choose the kind of sorting in the future, including grouping by category.  So starting off with a list sorting state is also a good idea:
```
listSortingProperty: property name (currently sortName)
```

The one we want first is detailState.  Using the styles for the states from the other project, added another ngClass to make viewed items 50% opaque.  Set the state in an onclick function, and save the list in the storage.


## API service caching vs local storage

By default an Ionic app comes without any specific HTTP caching.  Since this is a PWA thing usually done with a service worker.  On Ionic, we can use [this Ionic Cash plugin](https://github.com/Nodonisko/ionic-cache).  Under the hood it automatically uses whatever is available in the environment the app is running in, like many other storage libs.

[Here is another option](https://ionicacademy.com/ionic-caching-service/) for caching.  And a good [Stack Overflow answer](https://stackoverflow.com/questions/48419769/angular-service-worker-caching-api-calls-for-offline-app) to round things out.

The problem is, we want to append state to the list and items, so if we have to do that, we may as well use local storage and go all the way.  The simple choice for Ionic is, you guessed it, [Storage](https://beta.ionicframework.com/docs/building/storage/)

Install like this:
```
npm install --save @ionic/storage
```

Actually, this was already installed because an example using it was followed for the initial data service.  So it was already imported and in the imports array of the app.module file.

Then creating two simple get/set functions and using them in the error that would happen if for example we are offline like in a car, and the list still loads!

This works for ionic serve testing.  However, on the Android device at least, it does not.

Should we be using the [native storage plugin](https://beta.ionicframework.com/docs/native/native-storage) instead?

Or maybe we just need to use the Sqlite option with [the current storage](https://beta.ionicframework.com/docs/building/storage/).

```
$ ionic cordova plugin add cordova-sqlite-storage
```


But, that's using Cordova.  We are using Capacitor to build the naive apps now.  The [docs there](https://capacitor.ionicframework.com/docs/apis/storage) say this: *Mobile OS's may periodically clear data set in window.localStorage, so this API should be used instead of window.localStorage. This API will fall back to using localStorage when running as a Progressive Web App.*

And this: *Storage works on Strings only. However, storing JSON blobs is easy: just JSON.stringify the object before calling set, then JSON.parse the value returned from get.*

The docs referenced above do not cover how to install a plugin with Capacitor.  But there is a general part in the [Basics/Using Cordova Plugins](https://capacitor.ionicframework.com/docs/basics/cordova) section which as you recall shows how to do it.
```
npm install cordova-sqlite-storage
npx cap sync
```

Next, add the config recommended in the storage docs:
```
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
    }),
```

Thought about posting this question on the Capacitor Slack channel:

I want to use local storage in my Ionic app build with Capacitor.  I have installed Capacitor and used it to deploy to devices, but the storage only works with ionic serve.
There are three docs to go off:
```
[Storage](https://beta.ionicframework.com/docs/building/storage/)
[Native Storage](https://beta.ionicframework.com/docs/native/native-storage)
Capacitor [Storage](https://capacitor.ionicframework.com/docs/apis/storage)
```
I have used the first one, including installing cordova-sqlite-storage.
In the docs, the last one has no method for importing the Capacitor Storage which has the same name (Storage) of the Ionic version and different usage.  What is the proper way to import this, or should I be trying to use Ionic Native Storage?

But why ask when we can try it out for ourselves.  So, trying the Ionic Native option.
```
$ ionic cordova plugin add cordova-plugin-nativestorage
$ npm install --save @ionic-native/native-storage
```

Add the Capacitor touch:
```
$ npx cap sync
```

On to the import, TypeScript is not happy: *Cannot find module '@ionic-native/native-storage'.*

There is a small difference in the beta docs for configuring an Ionic Native plugin: *For Angular, the import path should end with /ngx.*

But this:
```
import { NativeStorage } from '@ionic-native/native-storage/ngx';
```

Causes the same error over the path string.  deleting the node_modules and doing another npm i for good measure.

That seemed to fix the problem for a moment, but then the same red squiggly came back with the mouse over message:

Noticed that the native-storage was not in the package json.  Forgot to use the save flag.  Running this again:
```
$ npm install --save @ionic-native/native-storage
```

Got rid of the /ngx extansion on the storage strings and the errors went away.  Now for an ionic serve test and then a device test.

Using ionic serve causes this browser error:
```
index.js:133 Uncaught TypeError: Object(...) is not a function
    at index.js:133
    at Object../node_modules/@ionic-native/native-storage/index.js (index.js:197)
```

Probably have to check the platform first.  It's worth trying this on the device before going thru that work to see will the plugin work for us if we do!

The app crashes before the splash screen finishes.  Did we need to do ```npx cap sync``` again?  Trying that now now to be sure.

After that, the splashcreen gets further, but then an error which looks a lot like the React Native error screen:
```
Object(...) is not a function
TypeError: Object(...) is not a function at https/eb...dfcapacitorapp.net/vendor.js:64149:79
at Object.../node_modules/@ionic-native/native-storage/index.js
...___webpack_require__
```

[This forum post](https://forum.ionicframework.com/t/typeerror-object-is-not-a-function/130589/6) has some interesting quotes:
*The spread operator does not apply to an object. This means you are most likely using a version of TypeScript before 2.1*

We have "typescript": "~2.7.2" in our package.json.

*This error started showing after upgrading the AngularFire2 to 5.0.0-rc.8 or higher and the reason is rxjs 5 is no longer supported in AngularFire2 5.0.0-rc.8 or higher, upgrade to 6 and include rxjs-compat*

We are not using AngularFire, but maybe there is another lib mismatch?

User reedrichards seems like is in the wrong industry with the [answer to this question](https://forum.ionicframework.com/t/ionic-4-beta-object-is-not-a-function/138152/2)
*I like to give the same answer over and over again…so*

*Use ionic-native beta.14.  Correct your import by adding /ngx like import {Camera} from '@ionic-native/camera/ngx';  Next time plz before asking search thru the forum first https://forum.ionicframework.com/t/camera-in-ionic-v4 or https://forum.ionicframework.com/t/ionic-4-native-plugin-problem*

Using computers requires patience.  Zing!

Anyhow, we had this:
```
"@ionic-native/core": "5.0.0-beta.11",
```

Change the 11 to 14, but the native storage plugin is fixed here:
```
"@ionic-native/native-storage": "^4.11.0",
```

Trying to set that value manually to 5.0.0-beta.14 with an npm i.  Then the errors in the editor are gone again.  Going for another deploy.  The app runs, but getting this message in the console via remote device debugging:
```
Error getting item NativeStorageError
capacitorConsole @ capacitor-runtime.js:70
```

Shortest error in history!  Actually, the plugin does work.  We are never calling the save function, so getting the value that doesn't exist causes that error.  We make that brief change and we can get the demo value we've saved.  Now, how do we tell if it's a browser?

Without the Platform plugin, we get this error:
```
data-storage.service.ts:29 Error getting item cordova_not_available
```

Put in a function to use native storage if it's available (on a device) and fall back to local storage if it isn't (browser testing).  The app now works for both, so it's time to move on to the short descriptions.







The usage is slightly closer to the Capacitor version:
```
this.nativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
  .then(
      ...
```

Capacitor version:
```
async setObject() {
  await Storage.set({
    key: 'user',
    value: JSON.stringify({
      id: 1,
      name: 'Max'
    })
  });
}
```







## Scroll Position Restoration

We were going to implement out own scroll to last viewed item feature, but since Angular 6.1 now has [Router Scroll Position Restoration](https://blog.angular.io/angular-v6-1-now-available-typescript-2-9-scroll-positioning-and-more-9f1c03007bb6), we will wait until Ionic starts using that version and then do this:
```
RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
```

What else is new in Angular 6.1?

1. ShadowDOM v1 has better cross-browser support
1. keyvalue Pipe to pipe an Object through the keyvalue pipe, which will give you an array suitable for use within an *ngFor.  Nice.  API to template just keeps getting simpler.
1. Schematics Chaining adding support for returning a Rule from an existing Rule. This allows developers to more dynamically determine the set of rules to follow when designing Schematics.
1. TypeScript 2.7, 2.8 and 2.9, errors such as “Exported variable ‘x’ has or is using name ‘y’ from external module ‘z’ but cannot be named”. TypeScript has relaxed these declaration emit visibility rules which means you no longer will see this error and you will no longer have to change your code for such export patterns.


## Merging the WikiMedia lists

Along with the 90 WikiData entries for cognitive biases, there is also the roughly 200 in three categories on the Wikipedia page.  If you merge the duplicates you would get 191 on the list.  In the Angular 6 project which is served by the NodeJS app in [Chonchifolia](https://github.com/timofeysie/conchifolia), we did a quick and dirty nested set of service calls to assemble the list.  Then, the sort.  Here, we hope to do something a bit more elegant.  I would like to try an async/await solution.  However, on second thought, this will merely chain promises.  We want all three lists to load at once, and then only merge and sort once they are all done.  So we used the Promise.all() function like this:

```
getWikiMediaLists() {
    let promises = [];
    for (let i = 0; i < this.mediaSections; i++) {
        promises.push(new Promise((resolve) => {
            this.myDataService.loadWikiMedia(i+1).then((data) => { resolve(data); });
        }));
    }
    Promise.all(promises)
        .then(data => {
            this.addItems(data[2]); // TODO: fix array of dupes
            this.list.sort(this.dynamicSort('sortName'));
    });
}
```

After sorting the service for the main WikiData list out a bit, the content is a little differently the was expected:
```
key:"Actor-observer bias↵"
value:"Social biases"
```

That's the bias name and the category.  What are they called in the Conchiflolia app?  Since we started using our NodeJS server, we are not getting raw WikiMedia data anymore.  And, we were using a RxJS behavior subject to monitor the API call.  Since we will be adding items and sorting the list, we can't do that anymore.

So using the same kind of service in Conchiflolia, and some of the functions to add and merge items as well as sort, we have our list.

There are still some unwelcome things going on with the list.  For starters, there are 238 items whereas in Conchifolia there are only 191.  And there is still the lower case entries that get tacked onto the list after the upper case Z items.

When deploying the app to a device, things changed.  We got the CORS error again.  This is because the CORS plugin was turned on in Chrome, and so the old calls directly to Wikipedia were going thru.  In the device, they failed.

So after converting the calls to use the radiant-springs server and changing things to use the right property names, we have 191 items now, same as Conchifolia.


## Ionic 4 Beta and using the Conchifolia server

Since the [Ionic 4 beta announcement](https://blog.ionicframework.com/announcing-ionic-4-beta/) we have wanted to get back to this project and bring it up to the same level that the Conchifolia NodeJS server/Angular 6 client is at.  Namely this is using the server to get the WikiMedia lists that are blocked by CORS restrictions on Android (the *No Access-Control-Allow-Origin header* problem), and merge them with the Wiki Data list.  Then we will be in a good spot to introduce local storage to then add item state and settings to the app.

Along with the [GitHub project board](https://github.com/ionic-team/ionic/projects/3),
the CLI has [new docs also](https://beta.ionicframework.com/docs/cli/overview/).

Following the [new installation docs](https://beta.ionicframework.com/docs/installation/cli)
```
$ sudo npm install -g ionic@latest
Password:
npm WARN deprecated socks@1.1.10: If using 2.x branch, please upgrade to at least 2.1.6 to avoid a serious bug with socket data flow and an import issue introduced in 2.1.0
/Users/tim/.nvm/versions/node/v9.11.2/bin/ionic -> /Users/tim/.nvm/versions/node/v9.11.2/lib/node_modules/ionic/bin/ionic
+ ionic@4.0.3
```

Then, running ```ionic serve```, we get this frequent error:
```
[ng] ERROR in ./src/app/pages/detail/detail.page.scss
[ng] Module build failed: Error: Missing binding /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/node_modules/node-sass/vendor/darwin-x64-59/binding.node
[ng] Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 9.x
[ng] Found bindings for the following environments:
[ng]   - OS X 64-bit with Node.js 6.x
[ng]   - OS X 64-bit with Node.js 8.x
[ng] This usually happens because your environment has changed since running `npm install`.
[ng] Run `npm rebuild node-sass --force` to build the binding for your current environment.
```

That's pretty normal.  So after running that command, we are all good and the app serves showing the state we left it before creating the pure Angular site.  It's a list of the WikiData API call results.  Going to a detail page causes a *No 'Access-Control-Allow-Origin' header* error.

This error seems like it might be able to be fixed in the client (using openSSL for example), but the usual way is to get the server to allow the host access.  Since we control the server now [with this project](https://github.com/timofeysie/conchifolia), we can allow any host doing something like this:
```
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin'
```

But, the error is just shorter now:
```
Failed to load http://radiant-springs-38893.herokuapp.com/api/detail/Social%20perception: Request header field Access-Control-Allow-Origin is not allowed by Access-Control-Allow-Headers in preflight response.
```

Oh, I think we need to put that in the response on the actual call, not in the ```use``` function.  We have done that before on the Serene Brushlands project, so we can just copy and paste it from there:
```
app.get('/get-artwork/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
```

But taking the CORS out of the use section and putting it in the API response header causes the longer error again:
```
Failed to load http://radiant-springs-38893.herokuapp.com/api/detail/Social%20perception: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8100' is therefore not allowed 
```

We can always turn on the CORS plugin in Chrome to avoid this, so it's time to see if this still happens on the device.

On the device the error is the same, except for localhost, it's:
```
Origin 'https://8db0f5df-b5ea-44b5-8cf6-a13d5af3ecc2capacitorapp.net' is therefore not allowed access.
```

That's Capacitor's deal, but the result is the same - no details.

Anyhow, after reading more questions and answers about CORS, it became clear that it's the preflight request that needs to be handled on the server, not the headers for the API request.  So doing something [like this](https://gist.github.com/nilcolor/816580) in the detail API call sounds like a good idea.  But both of these options:
```
headers["Access-Control-Allow-Origin"] = req.headers.origin;
headers["Access-Control-Allow-Origin"] = "*";
```

Produce the same error.  After making changes to the server to and removing the CORS header info here, the details page is working again.


## Using Capacitor

After the problems with the build from the blocked requests section, we are giving this a try:
```
npm install --save @capacitor/core @capacitor/cli
...
+ @capacitor/cli@1.0.0-beta.1
+ @capacitor/core@1.0.0-beta.1
```

So it is in beta after all.  This will install the default native platforms.
```
npx cap init
npx cap add android
ionic build
```

Next, running ```npx cap open```, we are given these options:
```
? Please choose a platform to open: (Use arrow keys)
❯ android 
  electron 
  ios 
  web 
```

Choosing android and all we get is this:
```
[info] Opening Android project at /Users/tim/angular/ionic/i4/myVanillaApp/android
$
```

Not the opening of the app in a similator as would be expected.  Just a ready prompt.  Then, suddenly, Android Studio pops up.  Trying to run the project there shows the familiar error in the wizard: ```Error: Gradle project sync failed.  Please fix your project and try again.```

The reason this is familiar is because I struggled with this at work with building the Android version of an Ionic 3 app.  It was some kind of Android platform/Gradle version mismatch.

If 'run anyway' is chosen, we get the 'Gradle project sync failed' message.  Actually, haven't used Android Studio on this laptop for quite a while.  And I'm in the car again so it's not going to get fixed now.

There is this message:
```
Error:Unknown host 'dl.google.com: nodename nor servname provided, or not known'. You may need to adjust the proxy settings in Gradle.
<a href="toggle.offline.mode">Enable Gradle 'offline mode' and sync project</a><br><a href="https://docs.gradle.org/current/userguide/userguide_single.html#sec:accessing_the_web_via_a_proxy">Learn about configuring HTTP proxies in Gradle</a>
```

Will have to look at [that link](https://docs.gradle.org/current/userguide/userguide_single.html#sec:accessing_the_web_via_a_proxy) later.  Time to catch up on reading the latest Web Design Weekly (on the phone that is)!

We should check the current installation.  Required is:
```
Android SDK Tools 26.0.1 or greater.
Android SDK Platforms for API 21.
```

This machine goes as high as marshmallow (Android 6.0) a.k.a. API level 23.  28 is available now.
As of 27, the name and the API level are the same.  The Android test device is a Galaxy S8 which is on Android 8.0.0.  So we should get up to 8 which is 26.

Installed is Android Studio 2.2.3.  A new Android Studio 3.1.3 is available.  Install and restart.
See how Gradle likes that.  The notes for Android say:
*Currently to use an Android Emulator you must use a system image of at least Android version 7.0 on API 24.*

We should be OK with that now.  I'm missing Ionic's ability to create the apk file for us already.  We will have to use Android Studio to build that now.


After the upgrade, the IDE reported an error:
```
/var/folders/jn/xzs5tlvd2wb3dccpknvkxczh0000gn/T/PackageOperation04/patch.jar (No such file or directory)
```

Another error that showed up:
*Unregistered VCS root detected.  THe directory /myVanillaApp is under Git, but is not registered in the Settings.*  How about a little [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) guys!

Another error hidden at the bottom of the screen says *Failed to find target with hash string 'android-27' in: /Users/tim/Library/Android/sdk*
*Install missing platform(s) and sync project*

Clicking on that installed the following:
```

To install:
- Android SDK Platform 27 (platforms;android-27)
Preparing "Install Android SDK Platform 27 (revision: 3)".
Downloading https://dl.google.com/android/repository/platform-27_r03.zip
"Install Android SDK Platform 27 (revision: 3)" ready.
Installing Android SDK Platform 27 in /Users/tim/Library/Android/sdk/platforms/android-27
"Install Android SDK Platform 27 (revision: 3)" complete.
"Install Android SDK Platform 27 (revision: 3)" finished.
```

After upgrading, checking for updates and installing everything that should have been needed, I'm thinking that Android Studio must have missed that stuff.

Still there is a tiny message at the bottom of the IDE that still says *Gradle sync failed: Failed to find Build Tools revision 27.03.*  That is on the list there of what was just installed.  Maybe a re-start is needed?

I remember the old days of using Eclipse to build Android projects.  Don't miss that at all.  One of the great thing about becoming a front end developer was the escape from bloated IDEs like that.  Here we are back in the bloat again.  It took over a minute for Android Studio to start.

The suspense is on.  *Gradle sync started*.  Holding the breath. *Gradle sync started (a minute ago)*.  Then the bad news: *Gradle sync failed: Failed to find Build Tools revision 27.03.*

Had to install that exact build tool.  Then run the build again.  Gradle build running... calculating task graph.  This took about a minute.  Finally the build finishes.  Choosing build/build apk(s) appears to do nothing.  Reading a StackOverflow question about this says *It will then create that folder and you will find your APK file there. When Gradle builds your project, it puts all APKs in build/apk directory.*

Another popup declares: *To take advantage of all the latest features (such as Instant Run), improvements and security fixes, we strongly recommend that you update the Android Gradle plugin to version 3.1.3 and Gradle to version 4.4.*.  Now that Gradle is actually syncing, would rather not mess with that now.

android/app/build/outputs/apk/debug directory.  No more platforms directory.  Anyhow, the good news is, the built apk runs on the device!  No more white screen of death!.  Time to go back to the Ionic 4 app and add capacitor to that and see if we can build it that way.

Had to give the app a better name when Capacitor creates the android project.  Chose loranthifolia and com.curchod.loranthifolia for the package name.

And the app runs!  No more white screen.  


## Blocked Requests

After getting Capacitor working, the app loads on the Android device, but there errors in the console when going to the details page:
```
polyfills.js:5291 Mixed Content: The page at 'https://4146a373-d535-43f0-a02b-c0c2044b9612capacitorapp.net/detail/magical%20thinking' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=magical_thinking'. This request has been blocked; the content must be served over HTTPS.
capacitor-runtime.js:70 ERROR Error: Uncaught (in promise): Response with status: 0  for URL: null
    at resolvePromise (polyfills.js:3136)
    at resolvePromise (polyfills.js:3093)
    at polyfills.js:3195
```

I thought that was a http call?  Http works in the browser.  Is that the only change needed for the details page to work?

Isn't this the same error we got when starting the app and figuring out now to make our WikiData API calls.  Here were our notes the: *you might get a message like this in the console*
```
my-data.service.ts:70 loadAllPackages: ERROR
(anonymous) @ my-data.service.ts:70
...
home:1 Cross-Origin Read Blocking (CORB) blocked cross-origin response https://en.wikipedia.org/w/api.php?action=parse&section=2&prop=text&format=json&page=List_of_cognitive_biases with MIME type application/json. See https://www.chromestatus.com/feature/5629709824032768 for more details.
```

We fixed that on our dev server with the Chrome CORS plugin.   That is not an option on a device.  We could ask Wikipedia to allow all hosts.  No, you're right, just kidding.  

Would a proxy work? We could set up a proxy in ionic.config.js.  We could also run a NodeJS server to handle the API calls, use the curator lib to parse the results and just return those to the app.  But it would be great not to have to maintain a server for this project, especially if it turns out to be useful and goes in the app stores.

What other options are there?  The mixed content error would happen if you go to an https link in a browser and the page you see contains an image invoked via <img src="http://external.com/resource.jpg"> in the HTML.  Since the error message also mentions Capacitor, [this GitHub issue](https://github.com/ionic-team/capacitor/issues/630) might be helpful:
*Capacitor uses https to serve the files and you are trying to get the data from a http url, that throws a mixed content error (to see it open this url in chrome and pick the Capacitor app chrome://inspect/#devices)  To enable mixed content you can add "allowMixedContent": true in your capacitor.config.json file.*

Since the WikiData calls are successful, this might be all we need.  However, it doesn't seem to work.  Even using ```ionic serve``` with the CORS plugin on, we are getting this message: ```Origin 'null' is therefore not allowed access.```.  Actually, the plugin looked like it was on, but when opening the plugin options, it showed off.  When on the details page content loads.  So now, what else can we try before busting out a NodeJS backend?

You can pass the "withcredentials"parameter as true in your request string.  Like this:
```
 var headers = new Headers();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');
    headers.append('content-type','application/json');
    let options = new RequestOptions({ headers:headers,withCredentials: true});
return this.http.get(this.url, postParams, options). etc...
}
```

When using those headers, the error message changes to:
```
magical%20thinking:1 Failed to load http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=magical_thinking: Response for preflight is invalid (redirect)
```

The url is correct if you paste that in a browser address.  Tried using content-type values of ```application/x-www-form-urlencoded```, ```multipart/form-data``` and ```text/plain``` to no avail.

The error indicates that the ssl preflight is getting a redirect response. 

Also at this point I discovered that I should have used ```npx cap copy``` as part of the build workforlow.  I had added a version number to the title bar to confirm changes.  With so many steps in the build and deploy process during development, it's a good idea to have a visible change each time so that when you try something and move on, you can say you have tried that with (more) confidence.  For some reason running cap copy opened the vanilla project that was used to test Capacitor out when run from the loranthifolia directory, so you can have to keep your eyes open all the time here.

With capacitor (using Ionic), the workflow again is:
```
ionic build
npx cap copy
npx cap open
```

It would be nice to have a script run all three of those.
To add a plugin and update dependencies:
```
npm install really-cool-plugin
npx cap update
```

Now that we have that down again, the error is still the same.  On the home page which shows the list, we get some info about the way Capacitor is working, then choosing an item we get the error: 
```
capacitor-runtime.js:340 native App.addListener (#517533)
capacitor-runtime.js:70 Angular is running in the development mode. Call enableProdMode() to enable the production mode.
capacitor-runtime.js:70 Ionic Native: deviceready event fired after 314 ms
capacitor-runtime.js:70 loadAllPackages: always
polyfills.js:5291 Mixed Content: The page at 'https://20055794-3ddc-4f5b-89df-c2dace9dd576capacitorapp.net/detail/magical%20thinking' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=magical_thinking'. This content should also be served over HTTPS.
scheduleTask @ polyfills.js:5291
push../node_modules/zone.js/dist/zone.js.ZoneDelegate.scheduleTask @ polyfills.js:2729
onScheduleTask @ polyfills.js:2619
...
(anonymous) @ polyfills.js:3046
webpackJsonpCallback @ runtime.js:24
(anonymous) @ 5.js:1
detail/magical%20thinking:1 Failed to load http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=magical_thinking: Response for preflight is invalid (redirect)
capacitor-runtime.js:70 ERROR Error: Uncaught (in promise): Response with status: 0  for URL: null
    at resolvePromise (polyfills.js:3136)
 ...
capacitorConsole @ capacitor-runtime.js:70
defaultErrorLogger @ vendor.js:30777
push../node_modules/@angular/core/fesm5/core.js.ErrorHandler.handleError @ vendor.js:30823
next @ vendor.js:33405
schedulerFn @ vendor.js:32641
push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.__tryOrUnsub @ vendor.js:72477
...
(anonymous) @ polyfills.js:3046
webpackJsonpCallback @ runtime.js:24
(anonymous) @ 5.js:1
```

The Google search page has these kind of errors on it also:
```
Failed to load https://ogs.google.com/u/0/_/notifications/count: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. Origin 'https://www.google.com.au' is therefore not allowed access.
```

The Capacitor error is:
```
Failed to load https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=law_of_the_instrument: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://1390c343-38d9-4943-88b9-3b925970d1b7capacitorapp.net' is therefore not allowed access.
```

What makes us think we can get around this is the fact that the React Native app details page was working (before the Cheerio/DOM parsing fiasco).  It might be worth getting that up on its feet since the vanilla project test was successful.

But first, let do some more stack overflowing:
*bermick commented on Jan 6 You have to set up the correct CORS options: https://www.npmjs.com/package/cors, mainly 'origin' and 'credentials'*

The docs there show these examples:
```
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
...
credentials: Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
```

Using ionic serve and turning off the CORS plugin in Chrome, and also changing http to https
Failed to load https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=magical_thinking: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8100' is therefore not allowed access.

We actually set the allow origin to * as shown above, so not sure why it's not mentioned there.

Also re-read a [GitHub answer also linked above](https://github.com/ionic-team/capacitor/issues/630) where someone says you have to run this command after adding the allowMixedContent setting in the capacitor.config.json file:
```
npx cap sync
```

Add that command to the workflow.  Apparently that problem only affects Android WebView.  Have to add React Native to that list.  As far as I know, the server has to send the header with the Access-Control-Allow-Origin option to allow an origin in its response to the client.  It must be that the React Native somehow doesn't apply this rule.  I think the user from the issue mentioned above was talking about the simulators, not devices.

So after getting the server going, and removing trying to set any CORS header stuff here, we have our working descriptions.


## Testing on Android

With problems on-going in the [React Native version of this app](https://github.com/timofeysie/teretifolia), trying out Android here so that we can actually use the app on a device.  The React Native version has to have the server running on local wifi for it to work.  Once this connection is lost, the app stops working.  There may be a way around this, but haven't found it yet.

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

Then I remembered my nvm woes and used Node version 8.  The platform was added quickly without issue after that.  

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

After borrowing the cable from the car a day later, these are the errors that show up in the remote debugging console:
```
runtime.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
styles.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
polyfills.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
cordova.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
main.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
vendor.js:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
/assets/icon/favicon.png:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
```

Starting off by getting the latest alpha release:
```
sudo npm i -g ionic@rc
```

```sudo``` is required on a mac when using the global flag.  And since hybrid development includes Apple distribution, a mac is required for full hybrid word, just fyi.  The result is:
```
+ ionic@4.0.0-rc.11
added 32 packages from 49 contributors and updated 9 packages in 24.417s
```

RC 11 now.  Let's see if that solves the issue on the device with ```ionic cordova build android``` and after a few minutes the it has built the following apk in ```loranthifolia/platforms/android/app/build/outputs/apk/debug/app-debug.apk```.

Transferring the file to the device with the usual Android File Transfer mac desktop app.  Have to allow this on the device before the file system will show up.  Throw the apk file into the downloads directory.  Open the directory with the Samsung MyFiles app.  Have to allow installation of unknown apps by checking the ```Allow from this source``` toggle.  Then install and see the new message: ```Blocked by Play Protect```.  Have to choose ```Install Anyway```.   Then open the app and we still have a blank screen.  Back to the Chrome remote device debugging console to re-check the errors (accessed via the 'more tools' menu.  Choose the device and the 'Ionic App
Inspect file:///android_asset/www/index.html` option.  Errors are the same.

There is [an issue](https://github.com/ionic-team/ionic-cli/issues/3019) on the Ionic GitHub which mentions the ```net::ERR_FILE_NOT_FOUND``` errors.

*make sure you have the latest Web View beta installed:*
```
ionic cordova plugin add cordova-plugin-ionic-webview@beta
```

The person opening the issue mentions that this *resolved for me the issue with the blank screen*.  I'm offline right now (in the car) so will have to try that at the next hot spot.

So, that didn't help.  We still got the white screen.  Since we never tested an Ionic 4 app on a device yet, it's time to create a vanilla project and try to deploy that.  We are also at the stage where we will do that with React, and import the curator lib to see if then the new version without Cheerio will work.

```
npm install -g ionic@rc
...
ionic@4.0.0-rc.11 
```

At release candidate 11 now.  We must be close to a beta release!

```
ionic start myVanillaApp blank --type=angular
```

On serve, the following happens:
```
[ng] This usually happens because your environment has changed since running `npm install`.
[ng] Run `npm rebuild node-sass` to download the binding for your current environment.
```

After that command, things work.  Next, add android:
```
ionic cordova platform add android
```

It seems to be stuck at ```Generating platform resources``` again. What did we do to resolve that last time?  Used nvm?

Probably we should be using [Capacitor](https://capacitor.ionicframework.com/) now, no?  Where is that project at?  Is it in beta yet?  If so, definitely.  But first, lets go with a good old Cordova build.
```
ionic cordova build android
```

Despite killing the platform add before, the build reports success.  So, on with the show.  Will we get the white screen of death?

Well, it didn't work.  White screen.  So, how about giving Capacitor a try now?  Oh no, the unfamiliar waters!  Actually I've used it before a while ago.

On the getting started page it says:
```
make sure you update CocoaPods using pod repo update before starting a new project, if you plan on building for iOS using a Mac.
```

Since we already created a project, do we need to create a project again with Capacitor this time?  Or do we listen to this: ```Capacitor was designed to drop-in to any existing modern JS web app.```?

Will give that a try next.



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

Using [this tut by Mike Hartington](https://mhartington.io/post/ionic-4-alpha-test/) as a starting point for an Ionic 4 alpha 7 app.
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

