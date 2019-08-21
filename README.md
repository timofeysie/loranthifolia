# A WikiData List app with Ionic 4

An Ionic app with a list of Wikidata items and Wikipedia details.

Currently using Ionic 5 & Angular 7.
```
@angular: ~7.1.4
@ionic/angular: ^5.0.0-beta.22,
```

It's time for
```
Angular 8
@ionic/angular	4.7.4
```

We could also start a project for these two:
```
Vue	@ionic/vue	version	README.md
React	@ionic/react	version
```


This project began to create a simple demo app to compare with a React Native app.  The app parses WikiData and Wikipedia for a list of content and provide a master detail view of the results.

*Hakea loranthifolia is of the genus Hakea native to an area in the Wheatbelt region of Western Australia.  It typically grows to a height of 2 to 3 metres (7 to 10 ft). It blooms from August to September and produces white flowers.*

A note about this readme, the oldest items are at the end and most recent at the beginning after the table of contents if you want to go from the beginning of the project to the current work.


## Work flow

To run the app in development, use ```ionic serve```.

To test on a device, with [Capacitor](https://capacitor.ionicframework.com/), the workflow is:
```
ionic build
npx cap copy
npx cap open (android/ios)
```

If you don't choose a platform it will ask you what kind of project you want to work with, for example, Android.  You could also choose iOS, Electron, or a PWA.  This will open the appropriate IDE such as Android Studio or Xcode after returning you to the prompt.  You can then build and deploy the project from there using the native platform tools.

To add a plugin and update dependencies:
```
npm install totally-cool-plugin-baby
npx cap update
```


#

## Table of Contents

1. [Planned features](#planned-features)
1. [Apple App Store Release](#apple-App-Store-Release)
1. [AWS Amplify](#aws-amplify)
1. [Google Playstore Release](#google-Playstore-Release)
1. [Fixing the GitHub issues](#fixing-the-GitHub-issues)
1. [Fixing the citations](#fixing-the-citations)
1. [Alpha release](#alpha-release)
1. [The backup title for Loranthifolia](#the-backup-title-for-Loranthifolia)
1. [Manipulating the preamble DOM](#manipulating-the-preamble-DOM)
1. [Adding links](#a-dding-links)
1. [The options page & i18n](#the-options-page-&-i18n)
1. [Short descriptions & incomplete API references](#Short-descriptions-&-incomplete-API-references)
1. [Item state](#Item-state)
1. [API service caching vs local storage](#API-service-caching)
1. [Scroll Position Restoration](#Scroll-Position-Restoration)
1. [Merging the WikiMedia lists](#Merging-the-WikiMedia-lists)
1. [Ionic 4 Beta and using the Conchifolia server](#ionic-4-beta-and-using-the-conchifolia-server)
1. [Using Capacitor](#using-Capacitor)
1. [Blocked Requests](#Blocked-Requests)
1. [Testing on Android](#Testing-on-Android)
1. [Fixing the tests](#fixing-the-tests)
1. [Implementing Angular routing](#Implementing-Angular-routing)
1. [Starting the app and parsing Wikipedia](#Starting-the-app-and-parsing-Wikipedia)

#


# Upgrade to Ionic 4.7

Had to install ionic again.  Then this:
```
ERROR in node_modules/@ionic-native/splash-screen/ngx/index.d.ts(1,35): error TS2307: Cannot find module '@ionic-native/core'.
```
Tried this:
```
npm i @ionic-native/core
npm i @ionic-native/native-storage
npm i @ionic-native/splash-screen
npm i @ionic-native/status-bar
```

Got this:
```
$ npm i @ionic-native/core
npm WARN @ionic-native/native-storage@5.12.0 requires a peer of rxjs@^5.5.0 || ^6.5.0 but none is installed. You must install peer dependencies yourself.
npm WARN @ionic-native/splash-screen@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none is installed. You must install peer dependencies yourself.
npm WARN @ionic-native/status-bar@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none is installed. You must install peer dependencies yourself.
npm WARN @ionic/pro@2.0.4 requires a peer of cordova-plugin-ionic@^5.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN @ionic-native/core@5.12.0 requires a peer of rxjs@^5.5.0 || ^6.5.0 but none is installed. You must install peer dependencies yourself.
```

```
npm i rxjs --save
...
```




## Planned features

Planned features include:

1. Language change for app labels
1. Bookmark the last viewed item
1. Let the user build a short description
1. Swipe up/down on the short description to send the item to the top/bottom of the list
1. Swipe right to remove it from the list
1. Metrics for the list (number of removed items out of total items, descriptions viewed, etc)
1. Detail page metrics (number of preambles, expand/contract preambles, footnotes)
1. Create a new category (list of fallacies)
1. Component style library shared by all the apps
1. Capture link title and create an 'also known as' section from other sources.
1. Export xAPI actions.
1. Add options for the list colors.
1. Compare lists when refreshed and alert user of deletions/additions.
1. Free version bundled with a static list and detail content (what are the legal issues?).
1. Breadcrumbs for navigation history.
1. Item state should not change if the detail view fails.



## The word wrap pipe

The only thing remaining before the first deployment to TestFligh is the short description text.
We wanted to try a different approach as a solution to the multi-line ellipsis problem which we have struggled with before.
```
$ ng generate pipe word-wrap
Could not find module "@ionic/schematics-angular" from "/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia".
Error: Could not find module "@ionic/schematics-angular" from "/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia".
...    
```



## Refactoring

One thing I miss about the Eclipse IDE is the brief of functions on the right hand side of the Java classes.  Previously VSCode didn't have this feature, except via plugin, so I made this API list to help plan the refactor of the code.  Now I find VSCode comes with it out of the box.  It's and *outline* view under the file explorer.  That will help going forward.

The list of functions in the list page grew out of control as it took on the responsibility of both the detail and the options page.  Since we will be moving to stencil for the layout components, we need to separate business logic from framework logic (routing, etc) from layout functions.  Which ones belong to the container, whatever it may be, and which ones belong to the parsing of Wikipedia.  Instead of MVP we have BFL (Business logic, framework, layout).  Is that a thing?
```
    // option page functions ====================
    /**  Get options from the native storage or create them if they don't exist. */
    ngOnInit()
    changeLang(event: any)
    gotoOptions()
    goBack()    

    // detail page functions ====================
    backToList()
    detailNgAfterViewChecked()
            // (learn how and when ...)
            let images = ('ambox');
    getDetails()
            // Preamble toggle work in progress       
            // the exclamation mark icon description, and sub icons and descriptions
            // this article includes a list of references but...
            // this article may have to be rewritten entirely to comply ...
            // the exclamation mark icon description, and sub icons and descriptions
            // Please help to improve this article ...
            // this is an array of the specific preambles including icons and descriptions
            // EXAMPLES
            // This article includes a list of references ...
            // this article may have to be rewritten entirely to comply ...
    removeStyleTags()
    detailNgOnInit()
    createElementFromHTML2(htmlString)

    // list page functions ================================
    ionViewWillEnter()
    /** Go to the detail view.  If an item has a backup title, add that to the route.
     * @param item Set state as viewed, get language setting, create list name, and/or title
     * And pass on to the detail page.
     * @param i item index */

    navigateAction(item: string, i: number)
    /**  This will be used among other things to find the list of available languages
     * for a detail page.
     * @param item @returns the q-code which is the last item in a URI http://www.wikidata.org/entity/Q4533272*/
    findQCode(item)

    getList()

    refreshList()
    /** First try the local native storage to set the list.
     * If that fails, try http. */
    getListFromStorage()

    /** If a page only has a Q-code, it does not have data for that item in the language requested.
     * Example:
     * "cognitive_biasLabel" : {
     *     "type" : "literal",
     *     "value" : "Q177603"
     * }
     * @param item WikiData item to check if a language page exists*/
    languagePageDoesNotExist(item, index)

    /** If the options have changed, then reload and parse the list.*/
    checkForUpdateOptions()

    /** Get the list either from storage or API if it's not there.
     * Set the sort name to the label, then on to getting the WikiMedia
     * category lists which will eventually merge those lists with
     * the WikiData list. */
    getListFromStorageOrServer()

    /** Get the list from local storage. */
    getFromLocalStorage()

    /** Use a promise chain to get the WikiMedia section lists.
     * Sort the list after all calls have completed.
     * Save the sorted list in the local data storage.
     */
    getWikiMediaLists()

    /** The Ege Özcan solution from [the answer to this question](https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript)
     * back in 2011.
     * @param property to sort by */
    dynamicSort(property)

    setStateViewed(i)

    /** Take a complete section of names and descriptions and either add the content
     * to a pre-existing item or create a new item if it is not already on the list.
     * @param section WIkiMedia section */
    addItems(section: any)

    removeFootnotes(description: string)

    /** Create a new item from a WikiMedia list item.
     * @param itemName Name of the item
     * @param key key has desc, and category properties */
    createItemObject(itemName: string, key: any, backupTitle: string)

    /** Usually the name of item can be gotten from the inner text of an <a> tag inside the table cell.
     * A few however, like 'frequency illusion' are not links, so are just the contents of the <td> tag.
     * Some, such as 'regression bias' have a <span> inside the tag.
     * @param data result of a WikiMedia section API call
     * @returns Array of name/desc objects */
    parseList(data: any)

    /** Parse the anchor tag for the title of the item used in the tag,
     * which can be different from the name of the item.
     * @param tableDiv the DOM element
     * @param itemName the item name */
    getAnchorTitleForBackupTitle(tableDiv: any, itemName: string) {

    /** Convert the result content to an html node for easy access to the content.
     * Change this to div.childNodes to support multiple top-level nodes
     * @param htmlString  */
    createElementFromHTML(htmlString)

    /** Remove the [edit] portion of the title.
     * @param HTMLDivElement */
    parseTitle(html: HTMLDivElement)
```

We can label and sort the functions and group the functions and then move them into their logical parts.  The entry points for functions called by the UI, or public methods should be separated from the utility functions which should be private.

The public functions are:
```
gotoOptions()
backToList()
goBack()
setStateViewed(i)   
navigateAction(item.sortName, i)
viewShortDescription(item)
descriptionOnClick()
refreshList()
changeLang($event)
```

Everything else should be private.



## A free version of the app

Because the server is involved in getting content from Wikipedia, using it in a free app has financial consequences.  Saving all the detail pages and bundling them with the distribution has legal consequences, because there are multiple authors of the content, and the material is protected by licenses.

Luckily, [Wikipedia has reuse info](https://en.wikipedia.org/wiki/Wikipedia:FAQ/Copyright#Can_I_reuse_Wikipedia's_content_somewhere_else?) which is pretty straight forward to read.  It looks like the free app would also have to be released  under the Creative Commons Attribution/Share-Alike License or the GFDL.  This states that we have to attribute the authors and allow others to freely copy the app.  Since it's already an open source project on GitHub, we have that going for it.

It might actually be a lot of work however to attribute authors.  As the linked document above states:
*Some text has been imported only under CC-BY-SA and CC-BY-SA-compatible licenses and cannot be reused under GFDL; such text will be identified either on the page footer, in the page history or the discussion page of the article that utilizes the text. All text published before June 15th, 2009 on Wikipedia was released under the GFDL, and you may also use the page history to retrieve content published before that date to ensure GFDL compatibility.*

So looks like we would have to do some more parsing of the detail pages to capture this info.  So, for now, that is not going to happen.  It's worth keeping in mind as we continue development hoping that the app doesn't get too much exposure and start costing us money for hosting the server.

Originally we intended the app to be self reliant but if you read older entries, you would find out that getting around the CORS issues failed.  Recently, I learned that [it might be due to](https://www.joshmorony.com/dealing-with-cors-cross-origin-resource-sharing-in-ionic-applications/) upgrading from UIWebView to WKWebView.

It seems we should be able to proxy requests through native code using the HTTP Ionic Native plugin.  However, this may not work with Ionic4/Capacitor.  At least someone pointed this out two months ago in the comments of the blog above and has not been answered.  Not sure what Josh is doing, but it might be worth asking him this directly, as I have talked with him by email before.

Anyhow, the verdict is still out on this method, but it's worth trying again.  Keep in mind that the proxy server we are currently using and hosted on Heroku does quite a bit of work which would all need to then be done on the client, so this method also is not a quick fix to this problem.


## Apple App Store Release

The first issue with Apple is this:
```
Your Developer Program Membership has expired.
Renew your membership to keep your access to Apple Developer Program benefits and services. Once renewed, be sure to agree to your Paid App Agreement in the Agreements, Tax and Banking section of App Store Connect.
```

This will set us back Australian $149.00.  You might be able to understand why it was allowed to expire.

Another issue of the many to come is this:
```
$ npx cap open ios
[error] ios" platform has not been created. Use "capacitor add ios" to add the platform project.
QuinquenniumF:loranthifolia tim$ capacitor add ios
-bash: capacitor: command not found
QuinquenniumF:loranthifolia tim$ npx capacitor add ios
[error] cocoapods is not installed. For information: https://guides.cocoapods.org/using/getting-started.html#installation
```

Another (big) problem is that this mac seems to be orphaned from the App Store.  It wont update due to what it says is a problem with the developer account.
The Mac OS is stuck on Yosemite 10.10.5 (14F2511).
Xcode is stuck on 6.1.1.

Trying to fix the problem seems impossible because it wants a 6 digit verification code from a trusted device we don't have.  Logging on to the developer portal is OK.  It send the code to the Android device.  But the system preferences doesn't.  

If you say you don't have access to a trusted device, you have to basically say you forgot your password and even wait a week for them to unlock the account again.

After two calls and an hour an a half later, I was able to login by getting a code from the developer website but not using it there and using it instead on the iCloud login.  Then for the app store I had to create a new admin user to then update to Mohave and then throw away and download a new version of Xcode because the old one wouldn't update.

*Then* this problem shows up:
```
QuinquenniumF:loranthifolia tim$ npx capacitor add ios
[error] cocoapods is not installed. For information: https://guides.cocoapods.org/using/getting-started.html#installation
QuinquenniumF:loranthifolia tim$ shttps://guides.cocoapods.org/using/getting-started.html#installation
```

Cocoa pods usesd to exists.  Maybe with the OS upgrade... anyhow:
```
QuinquenniumF:loranthifolia tim$ sudo gem install cocoapods
Password:
Fetching: concurrent-ruby-1.1.4.gem (100%)
...
✖ Updating iOS native dependencies:
✖ update ios:
[error] Analyzing dependencies
Fetching podspec for `Capacitor` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CapacitorCordova` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CordovaPlugins` from `../../node_modules/@capacitor/cli/assets/capacitor-cordova-ios-plugins`
Setting up CocoaPods master repo
  $ /usr/local/bin/git clone https://github.com/CocoaPods/Specs.git master --progress
[!] Unable to add a source with url `https://github.com/CocoaPods/Specs.git` named `master`.
You can try adding it manually in `~/.cocoapods/repos` or via `pod repo add`.
  Cloning into 'master'...
  remote: Enumerating objects: 386, done.        
  remote: Counting objects: 100% (386/386), done.        
  remote: Compressing objects: 100% (291/291), done.        
  error: RPC failed; curl 56 LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
  fatal: The remote end hung up unexpectedly
  fatal: early EOF
  fatal: index-pack failed
```

Despite the error, was able to run ```npx cap add ios & npx cap open ios```.

The system is lagging badly now.  Lots os spinning rainbows of death, taking hours to empty the trash, Xcode busy installing dependcenies... seems like we might need a new system.  Bummer.  Xcode had been indexing for the past 40 minutes.  Everything sees OK in the system monitor.  This

More errors with Xcode:
```
diff: /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios/App/./Podfile.lock: No such file or directory
error: The sandbox is not in sync with the Podfile.lock. Run 'pod install' or update your CocoaPods installation.
```


```
$ pod install
Showing Recent Messages
:-1: /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios/App/Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig: unable to open file (in target "App" in project "App") (in target 'App')
```

Made the change from this:
```
diff "${PODS_PODFILE_DIR_PATH}/Podfile.lock" "${PODS_ROOT}/Manifest.lock" > /dev/null
```
To this:
```
diff "${SRCROOT}/Podfile.lock" "${SRCROOT}/Pods/Manifest.lock" > /dev/null
```
in the build phases/[CP]Embed Pods Frameworks

The solution apparently however is to just update pods:
```
$ sudo gem install cocoapods
```

This didn't help.  The style WIP changes were reverted so that we could do another deployment build.  Have to make a release branch out of it before moving on.  Anyhow, there error is still:
```

Showing Recent Messages
:-1: /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios/App/Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig: unable to open file (in target "App" in project "App") (in target 'App')
```

Tried going into the ios directory to run the install command out of desperation:
```
$ pod install
[!] No `Podfile' found in the project directory.
QuinquenniumF:loranthifolia tim$ cd ios/App/
QuinquenniumF:App tim$ ls
App		App.xcodeproj	App.xcworkspace	Podfile		public
QuinquenniumF:App tim$ pod install
Analyzing dependencies
...
```

drwxr-xr-x  8 tim  staff  256 19 Dec 07:56 App

```
CocoaPods 1.6.0.beta.2 is available.
To update use: `sudo gem install cocoapods --pre`
[!] This is a test version we'd love you to try.

For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.6.0.beta.2

Setup completed
[!] CocoaPods could not find compatible versions for pod "Capacitor":
  In Podfile:
    Capacitor (from `../../node_modules/@capacitor/ios`)

Specs satisfying the `Capacitor (from `../../node_modules/@capacitor/ios`)` dependency were found, but they required a higher minimum deployment target.
```

After this the same error with the build:
```

Showing Recent Messages
:-1: /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios/App/Pods/Target Support Files/Pods-App/Pods-App.debug.xcconfig: unable to open file (in target "App" in project "App") (in target 'App')
```

Following some mis-spelled advice [here](https://stackoverflow.com/questions/53117077/unable-to-open-file-in-target-xcode-10), using the legacy build system setting.  With Ionic Cordova, it can be done with a flag in the build command, but with Capacitor, this is a way to get around the Xcode 10 block.  However, that error and others still show up:
```
diff: /Podfile.lock: No such file or directory
diff: /Manifest.lock: No such file or directory
error: The sandbox is not in sync with the Podfile.lock. Run 'pod install' or update your CocoaPods installation.
```

Trying out a comment from the above answer.  Change to the ios/App directory again and run:
```
1) pod repo remove master
2) pod setup
3) pod install
```

The second command took about 20 minutes to complete.  Still waiting now.

Then, much later, running:
```
$ pod install
Analyzing dependencies
Fetching podspec for `Capacitor` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CapacitorCordova` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CordovaPlugins` from `../../node_modules/@capacitor/cli/assets/capacitor-cordova-ios-plugins`
[!] CocoaPods could not find compatible versions for pod "Capacitor":
  In Podfile:
    Capacitor (from `../../node_modules/@capacitor/ios`)

Specs satisfying the `Capacitor (from `../../node_modules/@capacitor/ios`)` dependency were found, but they required a higher minimum deployment target.
```

Next, start over:
```
rm -r iOS
npx cap add ios
npx cap sync
```

During the add command, saw this:
```
  Found 4 Cordova plugins for ios
    CordovaPluginDevice (2.0.2)
    CordovaPluginIonicKeyboard (2.1.2)
    CordovaPluginNativestorage (2.3.2)
    CordovaSqliteStorage (2.4.0)
✖ Updating iOS native dependencies:
✖ update ios:
[error] Analyzing dependencies
Fetching podspec for `Capacitor` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CapacitorCordova` from `../../node_modules/@capacitor/ios`
Fetching podspec for `CordovaPlugins` from `../../node_modules/@capacitor/cli/assets/capacitor-cordova-ios-plugins`
[!] CocoaPods could not find compatible versions for pod "Capacitor":
  In Podfile:
    Capacitor (from `../../node_modules/@capacitor/ios`)

Specs satisfying the `Capacitor (from `../../node_modules/@capacitor/ios`)` dependency were found, but they required a higher minimum deployment target.
```

Skipping that, the build still gives this error:
```
diff: /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios/App/./Podfile.lock: No such file or directory
error: The sandbox is not in sync with the Podfile.lock. Run 'pod install' or update your CocoaPods installation.
```
But as you know, the pod install shows the error above.

[This](https://forum.ionicframework.com/t/ionic-4-capacitor-cocoapods-not-working/148553) being the only discussion found regarding this relatively new subject of errors with Capacitor recommends at some point version incompatibilities with version of Capacitor.  Time to try some versions!
```
npm install --save @capacitor/android@latest
+ @capacitor/android@1.0.0-beta.13
```
Also did ```$ sudo npm install -g npm``` to get the latest just for good measure.  Then start over again.   

The result is the same: *The sandbox is not in sync with the Podfile.lock. Run 'pod install' or update your CocoaPods installation.*

So it's back to [the only StackOverflow question](https://stackoverflow.com/questions/21366549/errorthe-sandbox-is-not-in-sync-with-the-podfile-lock-after-installing-res) that deals with this.  The accepted question deals with doing this in Xcode: *Build Phases > Link Binary With Libraries*.

However, in that section there is only one item: Pods_App.framework.  The answer states that you need to *Remove all libPods*.a* there.  Should I remove the .framework file?  Why not.  But the going to the iOS/App directory and running *pod install* turns up the same error:
```
[!] CocoaPods could not find compatible versions for pod "Capacitor":
  In Podfile:
    Capacitor (from `../../node_modules/@capacitor/ios`)
Specs satisfying the `Capacitor (from `../../node_modules/@capacitor/ios`)` dependency were found, but they required a higher minimum deployment target.
```

Feels like we are going around in circles here.  As another test, try adding the platform using Cordova, the old un-faithful build system.

```
$ ionic cordova platform add ios
> cordova platform add ios --save
Using cordova-fetch for ios
Adding ios project...
Unable to load PlatformApi from platform. Error [ERR_UNHANDLED_ERROR]: Unhandled error. (Does not appear to implement platform Api.)
(node:16169) UnhandledPromiseRejectionWarning: Error [ERR_UNHANDLED_ERROR]: Unhandled error. (The platform "ios" does not appear to be a valid cordova platform. It is missing API.js. ios not supported.)
    at EventEmitter.emit (events.js:169:17)
    ...
    at process._tickCallback (internal/process/next_tick.js:176:11)
(node:16169) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:16169) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

[This question](https://stackoverflow.com/questions/44042641/cordova-error-your-ios-platform-does-not-have-api-js) had an accepted answer where the the person just upgraded their node.  So did ```nvm install 10``` and ```nvm use 10``` and then adding the platform worked.

But then this:
```
$ ionic cordova platform add ios
-bash: ionic: command not found
QuinquenniumF:App tim$ npm i ionic
+ ionic@4.6.0
updated 1 package and audited 33224 packages in 184.097s
found 20 vulnerabilities (1 low, 14 moderate, 5 high)
  run `npm audit fix` to fix them, or `npm audit` for details
QuinquenniumF:App tim$ ionic cordova build ios
-bash: ionic: command not found
```

Did this:
```
$ npm i -g cordova
/Users/tim/.nvm/versions/node/v10.14.2/bin/cordova -> /Users/tim/.nvm/versions/node/v10.14.2/lib/node_modules/cordova/bin/cordova
+ cordova@8.1.2
added 594 packages from 523 contributors in 376.416s
```

That's a lot of dependencies!  But after all that, still getting the error  ***Unable to load PlatformApi from platform. Error [ERR_UNHANDLED_ERROR]: Unhandled error. (Does not appear to implement platform Api.)  Unhandled error. (The platform "ios" does not appear to be a valid cordova platform. It is missing API.js. ios not supported.)***

Do the platform shuffle again.  But with the add, we get this error:
```
> cordova platform add ios --save
Error: npm: Command failed with exit code 235 Error output:
npm ERR! addLocal Could not install /Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios
npm ERR! Darwin 18.2.0
npm ERR! argv "/Users/tim/.nvm/versions/node/v6.9.2/bin/node" "/Users/tim/.nvm/versions/node/v6.9.2/bin/npm" "install" "/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/ios" "--save"
npm ERR! node v6.9.2
npm ERR! npm  v3.10.9
npm ERR! code EISDIR
npm ERR! errno -21
npm ERR! syscall read
npm ERR! eisdir EISDIR: illegal operation on a directory, read
```

So, looks like we are in for the long haul on the ios side of the bed.  I would recommend creating a vanilla project from the current rc1 beta release and trying to deploy it to a device.  *If* that works, migrate the entire project to that so that we can start with something that actually works.  Bummer.

But following the Capacitor instructions from this project, the vanilla app can be built and deployed to the app store.  These are the steps starting from scratch:
```
ionic start loranthifolia blank --type=angular
cd loranthifolia
ionic build
npm install --save @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
ionic build
npx cap copy
npx cap open ios
```

Now it's time to replace the current project with the new project files and copy over the classes, assets and files needed for our project and do a proper deployment.  As it's Christmas tomorrow, not sure how much of that is going to get done.  

Merry Christmas.  The vanilla project on server has the following console log error after running ```ionic serve```:
```
Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH
```

Saved the module file again and reloaded the page and it ran.  Thanks.
Next, we will need to install some dependencies such as this:
```
ionic cordova plugin add cordova-plugin-nativestorage
npm i --save art-curator
```

Got this:
```
Cannot find module '@ionic/storage'
```

Tried this:
```
npm install @ionic/storage
```

After that we are getting this:
```
[ng] ERROR in src/app/app.module.ts(14,31): error TS2307: Cannot find module '@ionic-native/native-storage/ngx'.
[ng] src/app/pages/home/home.page.ts(6,10): error TS2305: Module '"/Users/tim/ionic4/loranthifolia/node_modules/@ionic/angular/dist/index"' has no exported member 'ItemSliding'.
[ng] src/app/services/storage/data-storage.service.ts(3,31): error TS2307: Cannot find module '@ionic-native/native-storage/ngx'.
```

Following some advice from [this post](https://forum.ionicframework.com/t/v4-and-native-storage-error/139609/10), tried these:
```
npm install @ionic-native/native-storage@beta --save
npm install @ionic-native/core@beta --save
```


```
$ npm install @ionic/storage
loranthifolia@0.0.1 /Users/tim/ionic4/loranthifolia
├── UNMET PEER DEPENDENCY @ionic-native/core@5.0.0-beta.21
├─┬ @ionic/storage@2.2.0
│ ├── localforage@1.7.1
│ └── localforage-cordovasqlitedriver@1.7.0
├── UNMET PEER DEPENDENCY cordova-plugin-ionic@^5.0.0
└── UNMET PEER DEPENDENCY rxjs@6.3.3

npm WARN @ionic-native/native-storage@4.18.0 requires a peer of @ionic-native/core@^4.11.0 but none was installed.
npm WARN @ionic-native/native-storage@4.18.0 requires a peer of rxjs@^5.5.11 but none was installed.
npm WARN @ionic/pro@2.0.4 requires a peer of cordova-plugin-ionic@^5.0.0 but none was installed.
QuinquenniumF:loranthifolia tim$ npm install @ionic-native/core@beta --save
loranthifolia@0.0.1 /Users/tim/ionic4/loranthifolia
├── UNMET PEER DEPENDENCY @ionic-native/core@5.0.0-beta.22
├── UNMET PEER DEPENDENCY cordova-plugin-ionic@^5.0.0
└── UNMET PEER DEPENDENCY rxjs@6.3.3

npm WARN @ionic-native/native-storage@4.18.0 requires a peer of @ionic-native/core@^4.11.0 but none was installed.
npm WARN @ionic-native/native-storage@4.18.0 requires a peer of rxjs@^5.5.11 but none was installed.
npm WARN @ionic-native/splash-screen@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none was installed.
npm WARN @ionic-native/status-bar@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none was installed.
npm WARN @ionic/pro@2.0.4 requires a peer of cordova-plugin-ionic@^5.0.0 but none was installed.
npm ERR! code 1
$ npm install @ionic-native/native-storage@beta --save
loranthifolia@0.0.1 /Users/tim/ionic4/loranthifolia
├── UNMET PEER DEPENDENCY @ionic-native/core@5.0.0-beta.22
├── @ionic-native/native-storage@5.0.0-beta.22
└── UNMET PEER DEPENDENCY cordova-plugin-ionic@^5.0.0

npm WARN @ionic-native/splash-screen@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none was installed.
npm WARN @ionic-native/status-bar@5.0.0-beta.21 requires a peer of @ionic-native/core@5.0.0-beta.21 but none was installed.
npm WARN @ionic/pro@2.0.4 requires a peer of cordova-plugin-ionic@^5.0.0 but none was installed.
```

Despite all the warnings and errors, after refreshing, the app is working, somewhat.
The font is different, and the detail pages don't route.  But we have a list.  There does appear to be a problem with the sliding component:
```
[ng] ERROR in src/app/pages/home/home.page.ts(6,10): error TS2305: Module '"/Users/tim/ionic4/loranthifolia/node_modules/@ionic/angular/dist/index"' has no exported member 'ItemSliding'.
[ng] ℹ ｢wdm｣: Failed to compile.
```

In the browser we see:
```
Cannot GET /
```

IN the console, we see:
```
localhost/:1 Failed to load resource: the server responded with a status of 404 (Not Found)
```

To be safe, deleted thoe old www directory and restarted the server to get those messages.  Was it a dream or was there a list in the browser just a minute ago?  A good guess is that there have been some breaking changes from when we started with Ionic 4 alpha 7.

Saving a file and forcing a compile and reloading the page after shows our list with a different font and broken links again.  This shows up in the console:
```
(anonymous) @ pages-detail-detail-module.js:1
detail.page.ts:35 desc undefined
```

It's worth noting the method used for this change.  First, after getting the vanilla project to run with a fresh Ionic 4 rc 0 app and adding Capacitor to build a working iOS project, the src directory from the working Ionic project with Capacitory and a working Android distribution was pasted into the vanilla app, replacing the directory.  Then the above npm installs and issues until at least the list is showing.  Git looks like this:
```
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

  modified:   ionic.config.json
  modified:   package-lock.json
  modified:   package.json
  modified:   src/app/app-routing.module.ts
  modified:   src/app/app.component.spec.ts
  modified:   src/app/app.component.ts
  modified:   src/app/app.module.ts
  deleted:    src/app/home/home.module.ts
  deleted:    src/app/home/home.page.html
  deleted:    src/app/home/home.page.scss
  deleted:    src/app/home/home.page.spec.ts
  deleted:    src/app/home/home.page.ts
  deleted:    src/assets/shapes.svg
  modified:   src/environments/environment.ts
  modified:   src/global.scss
  modified:   src/index.html
  modified:   src/karma.conf.js
  modified:   src/polyfills.ts
  modified:   src/theme/variables.scss
  modified:   src/tsconfig.app.json
  modified:   src/tsconfig.spec.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)

  LICENSE
  PRIVACY_POLICY.md
  README.md
  config.xml
  privacy_policy.html
  resources/
  src/app/components/
  src/app/constants.ts
  src/app/interfaces/
  src/app/models/
  src/app/pages/
  src/app/services/
  ```

It's interesting to note that the pages directory is abscent from the vanilla project.  This was something weired we noticed when trying out the AWS Amplify samples.  Anyhow, with a somewhat working app now I'm still not sure it's time to move this somewhat working app back into the old project and try to fix it there.  I just noticed also that the list has dividing lines bewteen the items, which the original app didn't have.  What's going on with these differences?

Let's look at the font first of all:
```
:host {
...
    font-size: 16px;
    font-weight: 400;
...

    font-family: var(--ion-font-family,inherit);
```

Inhereted stuff, so makes sense if we never set it ourselves.  We liked the old sans serif font better so what was that?

The font from the original was inherited from the .item-md lcass:
```
    font-family: Roboto,"Helvetica Neue",sans-serif;
    font-size: 16px;
    font-weight: 400;
    ...
    -webkit-font-smoothing: antialiased;
```

So if that's what we like we should make it official.

I would also like to characterize the changes that happened from the alpha release to the RC0.
In the capacitor.config.json file, ```"allowMixedContent": true``` was added.

An ionic.starter.json file was added that looks like this:
```
  "name": "Blank Starter",
  "baseref": "master",
  "tarignore": [
    "node_modules",
    "package-lock.json",
    "www"
  ],
  "scripts": {
    "test": "npm run lint && npm run ng -- build --configuration=ci && npm run ng -- build --prod --progress=false && npm run ng -- test --configuration=ci && npm run ng -- e2e --configuration=ci && npm run ng -- g pg my-page --dry-run && npm run ng -- g c my-component --dry-run"
  }
```

ionic serve/build are replaced by ng serve/build in the package.json
We went from "@angular/core": "6.0.6", to "~7.1.4".
The @ionic/angular packages of course went from alpha.7 to rc.0.

We only have the "cordova-plugin-nativestorage": "2.3.2", plugin now.  The original package.json had had in addition these:
```
    "cordova-plugin-device": "^2.0.2",
    "cordova-plugin-ionic-keyboard": "^2.0.5",
    "cordova-plugin-ionic-webview": "^1.1.19",
    "cordova-plugin-splashscreen": "^5.0.2",
    "cordova-plugin-whitelist": "^1.3.3",
    "cordova-sqlite-storage": "^2.4.0",
```

Wasn't there a security alert for sqlite-storage last week?
```
    "ionic": "^4.6.0",
    "ionic-native": "^2.9.0",
    "ios": "0.0.1",
    "parse5": "^5.0.0",
    ...
    "rxjs-compat": "^6.2.1",
    "stream": "0.0.2",
    "wikidata-sdk": "^5.11.2",
```

In the   "devDependencies" section these were added:
```
    "@angular-devkit/architect": "~0.11.4",
    "@angular-devkit/build-angular": "~0.11.4",
    "@angular-devkit/core": "~7.1.4",
    "@angular-devkit/schematics": "~7.1.4",
```

We're now using these version:
```
"@types/node": "~10.12.0",
"typescript": "~3.1.6"
```

The tsconfig.json file has some changes:
```
   "baseUrl": "./",
    ...
    "module": "es2015",
    ...
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
```

The app.po.ts (page object) file used for the tests, we see this:
```
  getParagraphText() {
    return element(by.css('app-root ion-content')).getText();
  }
```
replaced by this:
```
return element(by.deepCss('app-root ion-content')).getText();
```

Deep css, fantastic!

capacitor-cordova-ios-plugins was added to the git ignore file.

In the Podfile, this was added:
```
pod 'CordovaPlugins', :path => '../../node_modules/@capacitor/cli/assets/capacitor-cordova-ios-plugins'
```

I wonder if that would have fixed our pod issues in the old project?  Anyhow, an update was required.


After merging the new project with the old src files, on first re-build we get the usual:
```
[ng] ERROR in ./src/global.scss (./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./node_modules/sass-loader/lib/loader.js??ref--14-3!./src/global.scss)
[ng] Module build failed (from ./node_modules/sass-loader/lib/loader.js):
...
[ng] Run `npm rebuild node-sass` to download the binding for your current environment.
```

So as the message says, running ```npm rebuild node-sass``` will fix that.

Then, we still get a failed build:
```
[ng] ERROR in src/app/pages/home/home.page.ts(6,10): error TS2305: Module '"/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/node_modules/@ionic/angular/dist/index"' has no exported member 'ItemSliding'.
```


Then, after saving a file to force a re-build, and refreshing the browser, we have our list with the serif font.  But there are only 190 biases now.  Since the beginning there have been 191.  Which one has been lost?  Doing a quick comparison of the list on our test device and the currently running local app, it appears the the Bystander effect has gone missing.  It is an orange item.  That means it's a WikiMedia (Wikipedia) item.  We can look at the change log for that page and find the discussion as to while it was removed.

Isn't there a to do item to compare lists and look for changes?  It has been thought about but it's not there I think.  What it should be is, when the user chooses to refresh the list and there is an existing list, a copy is made of the old list and compared with the new list.  An alert can then be shown that indicates additions or deletions to the list.  That sounds like value for the user, right?


The build warnings we see are:
```
[ng] WARNING in ./src/app/pages/home/home.page.ts 474:41-52
[ng] "export 'ItemSliding' was not found in '@ionic/angular'
[ng] WARNING in ./src/app/pages/home/home.page.ts 475:54-65
[ng] "export 'ItemSliding' was not found in '@ionic/angular'
[ng] WARNING in ./src/app/pages/home/home.page.ts 475:85-96
[ng] "export 'ItemSliding' was not found in '@ionic/angular'
```

That feature was not working anyhow.  Remember we were trying to programmatically listen for the item sliding event, but failing.  We will need to solve that problem at some point.  We also plan to use our component library for the items in the list, so that functionality will actually be moved there.  For now, all we want is our MVP iOS release.  So just comment out that import as a reminder for later and move on.  

When we are offline, we get this message:
```
HttpErrorResponse {headers: HttpHeaders, status: 0, statusText: "Unknown Error", url: null, ok: false, …}
error: ProgressEvent {isTrusted: true, lengthComputable: false, loaded: 0, total: 0, type: "error", …}
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, headers: Map(0)}
message: "Http failure response for (unknown url): 0 Unknown Error"
name: "HttpErrorResponse"
ok: false
status: 0
statusText: "Unknown Error"
url: null
```

The app should show an alert saying the app is offline.

Next routing.  Why is it not working?  Also noticed that the refresh list button is blank.  What's up with that?


Changed this:
```
this.router.navigate(['detail/'+itemRoute+'/'+qCode+'/'+officialTitle]);
```

to this:
```
const url = 'detail/'+itemRoute+'/'+qCode+'/'+officialTitle;
this.router.navigateByUrl(url);
```

And got this error:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'detail/acquiescence_bias'
Error: Cannot match any routes. URL Segment: 'detail/acquiescence_bias'
```

Not sure why there aren't more parts to the route there.

The url in the browser does change, but the list is still there staring at us.  Created a new route for just two items like this:
```
{ path: 'detail/:id', loadChildren: './pages/detail/detail.module#DetailPageModule' },
```

Add this to the two previously working routes:
```
{ path: 'detail/:id/:officialTitle', loadChildren: './pages/detail/detail.module#DetailPageModule' },
{ path: 'detail/:id/:qCode/:officialTitle', loadChildren: './pages/detail/detail.module#DetailPageModule' },
```

Still, the page does not change.  The network tab shows that the call has returned.

queryParams was replaced by queryParamMap.

Should I try this instead of loadChildren in the routing module?
```
    { path: 'options', component: OptionsPageModule },
```

Trying that out on the options page causes this error:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: No component factory found for OptionsPageModule. Did you add it to @NgModule.entryComponents?
Error: No component factory found for OptionsPageModule. Did you add it to @NgModule.entryComponents?
    at noComponentFactoryError (core.js:9659)
```

What about using the OptionsPage instead of the module?  Trying that will cause this error:
```
compiler.js:25807 Uncaught Error: Component OptionsPage is not part of any NgModule or the module has not been imported into your module.
    at JitCompiler.push../node_modules/@angular/compiler/fesm5/compiler.js.JitCompiler._createCompiledHostTemplate (compiler.js:25807)
```

But including the module in the app module will defeat the lazy module loading feature, wont it?  And why did this used to work, and now doesn't?  This iOS hole is going deeper than anyone thought possible.  We are working on including tabs in our component library which would make routing obsolete, but that's a long way off from being ready to deploy.

Just as an experiment, adding the options module to the app.modules to see what happens.

It compiles, but then trying to navigate to the details page causes this error:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: No component factory found for OptionsPageModule. Did you add it to @NgModule.entryComponents?
Error: No component factory found for OptionsPageModule. Did you add it to @NgModule.entryComponents?
    at noComponentFactoryError (core.js:9659)
```

Adding the options module to the entry components array (which is empty) will cause this compile time error:
```
[ng] ERROR in OptionsPageModule cannot be used as an entry component.
```

So the wrong direction is definitely the wrong direction.

But what is the right direction?  Google didn't turn up much on router.navigate not working search.  The only idea right now is to go back to a vanilla app and implement routing to see what will work out fo the box, then add that solution here.  There must be some breaking change with the router between the alpha and rc releases.  It might also be worth going thru all the change logs to see what breaking changes are listed.

That will have to wait as were in the car on the road to Canberra right now, so it's a good time to switch back to the component library which won't require any network activity to work on.

At the hotel started an app the same as we started this project:
```
ionic start myVanillaApp blank --type=angular
```

Following the [tut here](https://shermandigital.com/blog/configure-routing-in-an-angular-cli-project/) to quickly setup some test routes.
```
ng g module app-routing
```

Using three variations to the routes:
```
const routes: Routes = [
  { path: 'home', component: HomePage},
  { path: 'dashboard', component: DashboardComponent },
];
```
```
const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'home', component: HomePage },
  { path: 'dashboard', component: DashboardComponent },
];
```
```
const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'home', component: HomePage, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
];
```

Also trying the lazy loading modules approach:
```
const routes: Routes = [
  { path: '', loadChildren: '../home/home.page', pathMatch: 'full' },
  { path: 'home', loadChildren: '../home/home.page', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: '../dashboard/dashboard.component', pathMatch: 'full' },
];
```

All these give this error:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'dashboard'
Error: Cannot match any routes. URL Segment: 'dashboard'
    at
```

How do you turn on enableTracing on the route?  In the app-routing.module, after defining the routes, add this:
```
RouterModule.forRoot(routes, {
    enableTracing: /localhost/.test(document.location.host)
});
```

But the error is still the same.  Shouldn't there be extra information available now?

Also tried putting a relative path on both the path: './dashboard' and this.router.navigate(['./dashboard'])

And using ```this.router.navigateByUrl('dashboard')``` and ```this.router.navigateByUrl('./dashboard')```.

Also tried links in the template liek this:
```
  <a routerLink="/dashboard">Heroes</a>
```

This is the same usage from the [Tour of Heroes Angular docs](https://angular.io/tutorial/toh-pt5).  In the section on implementing routing, it shows this configuration:
```
const routes: Routes = [
  { path: 'heroes', component: HeroesComponent }
];
```

So no slash in the class config, and a slash in the template router link.  Still, this doesn't work for us.  Triggering the template router link will also trigger the class router.navigate function for some reason.  Interestingly, the error messages are slightly different:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'home/dashboard'
Error: Cannot match any routes. URL Segment: 'home/dashboard'
    at
```

The second error is like this:
```
core.js:14597 ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'dashboard'
Error: Cannot match any routes. URL Segment: 'dashboard'
at ApplyRedirects.push../node_modules/@angular/router/fesm5/router.js.ApplyRedirects.noMatchError (router.js:2469)
```

So change the router path to 'home/dashboard' and maybe that will make a difference?
```
 path: 'home/dashboard'
```

And in the template:
```
<a routerLink="/dashboard">
```

```
ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'home/dashboard'
Error: Cannot match any routes. URL Segment: 'home/dashboard'
    at
```

Tried the reverse config:
```
<a routerLink="/home/dashboard">
```

And:
```
path: 'dashboard', loadChildren: '../dashboard/dashboard.component'
```

The error is identical.  Time for the docs.

Ionic has its own router outlet implementation called <ion-router-outlet> which is an outlet wherever you want the component for the active route to be displayed. The same as Angular’s <router-outlet> except that it will automatically apply the screen transition animations.

The Angular example paths are:
```
const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'detail/:id', component: DetailPage },
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];
```

The outlet created by Ionic is in the app.component.html template:
```
<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```

To show that routing does work with the current Ionic release, we can do this experiment.
```
ionic start routingVanillaApp blank --type=angular
```

Without adding any routing, we can add a page like this:
```
$ ionic generate
? What would you like to generate? page
? Name/path of page: two
> ng generate page two
CREATE src/app/two/two.module.ts (528 bytes)
CREATE src/app/two/two.page.scss (0 bytes)
CREATE src/app/two/two.page.html (130 bytes)
CREATE src/app/two/two.page.spec.ts (670 bytes)
CREATE src/app/two/two.page.ts (244 bytes)
UPDATE src/app/app-routing.module.ts (439 bytes)
[OK] Generated page!
```

The routes will be configured for us:
```
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'two', loadChildren: './two/two.module#TwoPageModule' },
];
```

These three methods of navigation work fine.  Two programmatic methods:
```
this.router.navigateByUrl('two')
this.router.navigate(['./two']);
```

One template method:
```
<a routerLink="/two">Template link</a>
```

So we can now safely say the problem is not with the framework, but with our code (as is usually the case).

If we look at the link we are creating:

home.page.ts:90 url ../detail/acquiescence_bias//Q420693/Acquiescence bias

See, there is part of the route that is missing.  It appears as if the qCode has an extra slash attached to it.   But even after removing that, the error is gone but the page still does not transition to the detail page.  The url changes, yes, but the app goes no where.  The detail page is activate, as we can see a comment coming out in the log from that page.

[This is the merge request](https://github.com/timofeysie/loranthifolia/commit/f29dc44c4e24b237fe6776a3091f77e06a0c7af0) where the new branch replaced the master branch after starting a new project with release candidate 0 which can actually be build for iOS distribution.

Despite fixing the the double slash in the url problem,  the routing didn't work.  To move things along we put the detail functionality into the list page.  Not ideal but it fits in with our plan to use the tabs from the component library for switching views and not rely on the framework router.

But for some reason the item name is coming out as 'list'.  It was a hastily done refactor which I hope no one looks at closely.  All the functions from getting the lists and merging them to dealing with the possible re-directs to get the details need to be looked and thoroughly and moved into appropriate classes.  Most of it should go into the component library which exists only to support this project anyway.  It's probably something that's not going to be used for other purposes, as it's not being designed for that.  And it has to be constantly remembered that this is just to get the MVP release over the line which will enable use to get feedback from actual users as the re-design is underway.

So after fixing the item name, we still have to deal with the return to list feature, and the to and back from the options page.  Actually, there is more than that.  The detail page relied on life cycle hooks to do it's thing, so these need to be manually triggered now.  Just had a terrible infinite loop which crashed the browser and finally restarted the computer to get back to work.  Part of the problem is this old MacBook Pro from 2014.

We actually need a checklist now.
```
change the header for details.
merge the two style sheets
the return to list from detail.
to and back from the options page.
remove the preambles again.
deploy to TestFlight.
```

Wow.  We were almost done with this a month ago after uploading to the Play Store.  What a bummer developing can be sometimes!

To add to this, git stopped working to push to GitHub.  The closer you get to deployment, the more errors seems to crop up.  This actually a cognitive bias at work.  Anyway, had to run this line:
```
git config --global core.askpass "git-gui--askpass"
```

And then enter the credentials (even the username was treated to the password * for some reason) and the push worked.  Strange.  In all our years of working with Git (since 2012), never had to do that before!

Let's check out burndown now:
```
done - change the header for details.
done - merge the two style sheets
done - the return to list from detail.
done - to and back from the options page.
done - refresh the list function
seems done - change the language
remove the preambles again.
deploy to TestFlight.
```

The change the language function was working for a minute, now it's not after implementing the refresh list.  After trying a content refresh trick, that failed but the list refreshed, so not sure why it wasn't working before that except that maybe the server wasn't compiling the files?

The only other thing then is to remove the preambles again.  We have a function for that so it's a matter of finding out why it's not working now.  Who knows, maybe something on Wikipedia has changed.  We really need to do a better job of working with WikiPedia and WikiDate.  Actually WikiData is OK as it has a query language.  WikiMedia seems less organized.

First, lets try a deployment to a test device to see how it's looking.  After this (a week later), here are the iOS issues:

1. Splash screen and icon are stock
2. List title too close to the time and should be left
3. Detail page title not centered (it is at the right height however)
4. Back from detail button hard to press
5. No available languages in the select
6. Version number too far to the right
7. Remove the static offline detail demo code
8. App seems to hang on first install

Also, link to license in the options page.  We have been using the GNU GENERAL PUBLIC LICENSE so far, but we should change to be in line with the Creative Commons license used by Wikipedia.  Or just put a link to it in the options page: https://creativecommons.org/licenses/by/4.0/

Or is it OK to have the code under the GNU license, and the content under the CC license?  Have to ask a professional.

Anyhow, first on the list is the assets for iOS.  If you remember, the [Morony link](https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/) provides all the details we need to generate the assets for the iOS release.  Since Capacitor is hands-off on the native projects side, I suppose we will have to do something like copying and renaming the assets created with the ```ionic cordova assets ios``` command, but it might be different.  Have to re-read that now with iOS in mind.

Here are the assets created with the Ionic command:
```
Icons
icon-1024.png (98%)
icon-40.png (99%)
icon-40@2x.png (99%)
icon-40@3x.png (99%)
icon-50.png (99%)
icon-50@2x.png (99%)
icon-60.png (99%)
icon-60@2x.png (99%)
icon-60@3x.png (99%)
icon-72.png (99%)
icon-72@2x.png (99%)
icon-76.png (99%)
icon-76@2x.png (99%)
icon-83.5@2x.png (99%)
icon-small.png (99%)
icon-small@2x.png (99%)
icon-small@3x.png (99%)
icon.png (99%)
icon@2x.png (99%)

Splash screens
Default-568h@2x~iphone.png (99%)
Default-667h.png (99%)
Default-736h.png (97%)
Default-Landscape-736h.png (98%)
Default-Landscape@2x~ipad.png (98%)
Default-Landscape@~ipadpro.png (99%)
Default-Landscape~ipad.png (99%)
Default-Portrait@2x~ipad.png (99%)
Default-Portrait@~ipadpro.png (99%)
Default-Portrait~ipad.png (98%)
Default@2x~iphone.png (98%)
Default@2x~universal~anyany.png (99%)
Default~iphone.png (99%)
 ```

Here are the stock images in the Xcode project > App > App > Assets.xcassets:
```
AppIcon-20x20@1x.png
AppIcon-20x20@2x-1.png
AppIcon-20x20@2x.png
AppIcon-20x20@3x.png
AppIcon-29x29@1x.png
AppIcon-29x29@2x-1.png
AppIcon-29x29@2x.png
AppIcon-29x29@3x.png
AppIcon-40x40@1x.png
AppIcon-40x40@2x-1.png
AppIcon-40x40@2x.png
AppIcon-40x40@3x.png
AppIcon-60x60@2x.png
AppIcon-60x60@3x.png
AppIcon-76x76@1x.png
AppIcon-76x76@2x.png
AppIcon-83.5x83.5@2x.png
AppIcon-512@2x.png
```

The naming is completely different.

We could guess that icon-small@2x.png = AppIcon-20x20@1x.png, but we would have to check that manually.  Is there a conversion table online?

There is a [link](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/) with details for the icons:
Device or context - Icon size
```
iPhone	180px × 180px (60pt × 60pt @3x)
120px × 120px (60pt × 60pt @2x)
iPad Pro	167px × 167px (83.5pt × 83.5pt @2x)
iPad, iPad mini	152px × 152px (76pt × 76pt @2x)
App Store	1024px × 1024px (1024pt × 1024pt @1x)
```

Device	Spotlight icon size
```
iPhone	120px × 120px (40pt × 40pt @3x)
80px × 80px (40pt × 40pt @2x)
iPad Pro, iPad, iPad mini	80px × 80px (40pt × 40pt @2x)
```

Device	Settings icon size
```
iPhone	87px × 87px (29pt × 29pt @3x)
58px × 58px (29pt × 29pt @2x)
iPad Pro, iPad, iPad mini	58px × 58px (29pt × 29pt @2x)
```

Device	Notification icon size
```
iPhone	60px × 60px (20pt × 20pt @3x)
40px × 40px (20pt × 20pt @2x)
iPad Pro, iPad, iPad mini	40px × 40px (20pt × 20pt @2x)
```

We don't really care about what they are for, we just want to cover all the bases.  So lets create our own list without the types.

Icon sizes
```
180px × 180px (60pt × 60pt @3x)
120px × 120px (60pt × 60pt @2x)
167px × 167px (83.5pt × 83.5pt @2x)
152px × 152px (76pt × 76pt @2x)
1024px × 1024px (1024pt × 1024pt @1x)
120px × 120px (40pt × 40pt @3x)
80px × 80px (40pt × 40pt @2x)
80px × 80px (40pt × 40pt @2x)
87px × 87px (29pt × 29pt @3x)
58px × 58px (29pt × 29pt @2x)
58px × 58px (29pt × 29pt @2x)
60px × 60px (20pt × 20pt @3x)
40px × 40px (20pt × 20pt @2x)
40px × 40px (20pt × 20pt @2x)
```

Now a chart to convert our names.

Xcode:
```
AppIcon-20x20@1x.png
AppIcon-20x20@2x-1.png
AppIcon-20x20@2x.png
AppIcon-20x20@3x.png
AppIcon-29x29@1x.png
AppIcon-29x29@2x-1.png
AppIcon-29x29@2x.png
AppIcon-29x29@3x.png
AppIcon-40x40@1x.png
AppIcon-40x40@2x-1.png
AppIcon-40x40@2x.png
AppIcon-40x40@3x.png
AppIcon-60x60@2x.png
AppIcon-60x60@3x.png
AppIcon-76x76@1x.png
AppIcon-76x76@2x.png
AppIcon-83.5x83.5@2x.png
AppIcon-512@2x.png
```

Cordova:
```
icon-1024.png (98%)
icon-40.png (99%)
icon-40@2x.png (99%)
icon-40@3x.png (99%)
icon-50.png (99%)
icon-50@2x.png (99%)
icon-60.png (99%)
icon-60@2x.png (99%)
icon-60@3x.png (99%)
icon-72.png (99%)
icon-72@2x.png (99%)
icon-76.png (99%)
icon-76@2x.png (99%)
icon-83.5@2x.png (99%)
icon-small.png (99%)
icon-small@2x.png (99%)
icon-small@3x.png (99%)
icon.png (99%)
```

Working on the small size.  How do we correlate these?
iOS size: icon@2x.png (99%) 40px × 40px (20pt × 20pt @2x)

Cordova name (with info from the finder directory):
```
icon-small.png (99%)    - dimensions: 29 x 29.  Resolution 72 x 72.
icon-small@2x.png (99%) - dimensions: 58 x 58.  Resolution 72 x 72.
icon-small@3x.png (99%) - dimensions: 87 x 87.  Resolution 72 x 72.
icon.png (99%)          - dimensions: 57 x 57.  Resolution 72 x 72.
icon@2x.png             - dimensions: 114 x 114.  Resolution 72 x 72.
```

Xcode icon names:
```
AppIcon-20x20@1x.png  - dimensions: 20 x 20.
AppIcon-20x20@2x-1.png - dimensions: 40 x 40.
AppIcon-20x20@2x.png - dimensions: 40 x 40.
AppIcon-20x20@3x.png - dimensions: 60 x 60.
```

We could assemble a name conversion list, but without the same exact sizes, we are out of luck.  There a no exact matches.  So we can use another tool, such as the online one we used at work before.  I believe only the 1024 image would have to be done manulally in that case.  All we have to do is locate the online tool used over a year ago now.

Using [the Make App Icon](https://makeappicon.com/) site, these icons were created:
```
ItunesArtwork@2x.png
Icon-App-20x20@1x.png
Icon-App-20x20@2x.png
Icon-App-20x20@3x.png
Icon-App-29x29@1x.png
Icon-App-29x29@2x.png
Icon-App-29x29@3x.png
Icon-App-40x40@1x.png
Icon-App-40x40@2x.png
Icon-App-40x40@3x.png
Icon-App-60x60@2x.png
Icon-App-60x60@3x.png
Icon-App-76x76@1x.png
Icon-App-76x76@2x.png
Icon-App-83.5x83.5@2x.png
```

Maybe the file names are not important.  There is a Contents.json file in the created directory that also exists in the Capacitor stock icons which could provide the mapping for them.

The problem with that site then is that it doesn’t create splash screens or Android assets.

The splash screens created by the resources command are:
```
Default-568h@2x~iphone.png
Default-667h.png
Default-736h.png
Default-Landscape-736h.png
Default-Landscape@~ipadpro.png
Default-Landscape@2x~ipad.png
Default-Landscape~ipad.png
Default-Portrait@~ipadpro.png
Default-Portrait@2x~ipad.png
Default-Portrait~ipad.png
Default@2x~iphone.png
Default@2x~universal~anyany.png
Default~iphone.png
```

These are the only ones in the Xcode project creted by Capacitor:
```
splash-2732x2732.png
splash-2732x2732-2.png
splash-2732x2732-1.png
Contents.json
```

All the same?  Where is the contents.json file:
```
{
  "images" : [
    {
      "idiom" : "universal",
      "filename" : "splash-2732x2732-2.png",
      "scale" : "1x"
    },
    {
      "idiom" : "universal",
      "filename" : "splash-2732x2732-1.png",
      "scale" : "2x"
    },
    {
      "idiom" : "universal",
      "filename" : "splash-2732x2732.png",
      "scale" : "3x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
```

So, different scales, but the files all look the same.  Here is what the [official docs](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/launch-screen/) say about "Static Launch Screen Images"
*It’s best to use an Xcode storyboard for your launch screen, but you can provide a set of static images if necessary. Create static images in different sizes for different devices, and be sure to include the status bar region.*
```
Device	Portrait size	Landscape size
12.9" iPad Pro	2048px × 2732px	2732px × 2048px
11" iPad Pro	1668px × 2388px	2388px × 1668px
10.5" iPad Pro	1668px × 2224px	2224px × 1668px
9.7" iPad	1536px × 2048px	2048px × 1536px
7.9" iPad mini 4	1536px × 2048px	2048px × 1536px
iPhone XS Max	1242px × 2688px	2688px × 1242px
iPhone XS	1125px × 2436px	2436px × 1125px
iPhone XR	828px × 1792px	1792px × 828px
iPhone X	1125px × 2436px	2436px × 1125px
iPhone 8 Plus	1242px × 2208px	2208px × 1242px
iPhone 8	750px × 1334px	1334px × 750px
iPhone 7 Plus	1242px × 2208px	2208px × 1242px
iPhone 7	750px × 1334px	1334px × 750px
iPhone 6s Plus	1242px × 2208px	2208px × 1242px
iPhone 6s	750px × 1334px	1334px × 750px
iPhone SE	640px × 1136px	1136px × 640px
```

Going to try the next option on the Morony list, [Image Gorilla](https://apetools.webprofusion.com/app/#/tools/imagegorilla).  We should have used that first.  As long as it works of course.  Once choice is specifically for Ionic.  I creates a lot more splash screens with names like this:
```
Default-Landscape-2436h.png
Default-2436h.png
Default@3x~iphone~comany.png
Default@3x~iphone~anycom.png
...
```

There is no Contents.json file.  Will Xcode generate this if we just dump the images in the proper directory?  The other iOS option creates a few less splash screens: iOS: 14 icon sizes, 22 splashscreen sizes.  Compared with iOS (Ionic): 25 icon sizes, 23 splashscreen sizes.

Maybe the Ionic version is for pre-Ionic 4 without Capacitor (probably!).  Using the pure iOS option gives us files like this:
```
LaunchImage-2436@3x~iphoneX-landscape_2436x1125.png
LaunchImage-1125@3x~iphoneX-portrait_1125x2436.png
LaunchImage-1242@3x~iphone6s-landscape_2208x1242.png
LaunchImage-1242@3x~iphone6s-portrait_1242x2208.png
```

So, still not sure what to do with those.  Still no Contents.json file.  I'm thinking just dump them in the directory and then try a build/deploy and see what happens.  It's only 2:37 am on a Saturday night/Sunday morning.  Not like I should be going to bed or anything.  The Air B'n'B'ers downstairs had a loud party until 1:30 and then a prolonged love making session which sounded like it was in the same room.  Moving on, ... reading [an old schoolers approach](https://medium.com/@mattholt/its-2019-and-i-still-make-websites-with-my-bare-hands-73d4eec6b7) to web design: lol, "so I’m googling two-way data binding in React"!  It's funny because React was created as a react(ion) against AngularJS's two-way data binding.

Now should I be deleting the Contents.json file along with the old splash screens?

Now there is an alert on the Splash screen, and more alert on the Xcode page that mouseover "The image set 'Splash' has 22 unassigned children".

There is one of those on the ApiIcon folder page in Xcode also.  In the end we just dragged the 2732 splash image to all three icons shown in the Xcode loader image page and that works for now.  Will have to test on some tables to see if it looks strange or something there.

Other items on the list:
2. List title too close to the time and should be left
8. App seems to hang on first install
10. The short descriptions show a third cut off line and no padding on the left

For the first one, we might have to check the platform and then adjust the header by pushing it down.  It looks great on Android and terrible on iOS.  It that really what the stock blank starter app looks like on iOS?  Have to test on some more devices.  Also, the first install list problem needs more testing to debug that.  But we are so close!  TestFlight here we come.

The last one we could back to the ellipsis, or try out a new method.

HTMLDivElement.offsetWidth is one way to go.

A new method I used recently was a little hacky, but worth a try.  Uing the canvas measureText function we should be able to get the length of the text in the canvas:
```
element = document.createElement('canvas');
let context = element.getContext("2d");
context.font = 'font-size: 14px';
return context.measureText(text).width;
```

However, all the strings come back with the same value: 113.369…
So that’s not very helpful.

How about a usual break point approach.  Tried something like this:
```
import { Pipe, PipeTransform } from '@angular/core';
import { Platform } from 'ionic-angular';
@Pipe({ name: 'wordWrap' })
export class WordWrapPipe implements PipeTransform {
    windowWidth;

    constructor(platform: Platform) {
        platform.ready().then((readySource) => {
            this.windowWidth = platform.width();
            console.log('Width: ' + platform.width());
        });
    }

    transform(text: string, params: any) {
        let newText = text;
        if (typeof params !== 'undefined' && this.windowWidth < 400) {
            let width = params.offsetWidth;
            console.log('w: '+width);
            if (width < 130 && text.length > 30) {
                newText = text.substring(0,30) +'...';
            }
        } else {
            console.log('no change '+this.windowWidth)
        }
        return newText;
    }

    getTextWidth(element, text) {
        element = document.createElement('canvas');
        let context = element.getContext('2d');
        context.font = 'font-size: 14px';
        return context.measureText(text).width;
    }
}
```

The main point here is the getTextWidth function which creates an element and a font and then measures the text in the element to get the width of it.

## AWS Amplify

The preference related planned features are:

1. language change option
2. save named list changes in local storage
3. create a new category

However, we will also need to store an email and possibly other user info to accomplish these.  Combine hosting, OAuth and a backend including lambda hosted endpoints and you have a pretty powerful mix.  Include a CLI like Amplify and it looks like a better choice than to solve all those issues including user management and a database separately.

The [Amplify docs](https://blog.ionicframework.com/adding-aws-amplify-to-an-ionic-4-app/) for Ionic have come and gone and come back again, so with an AWS account in hand, here we go.  

We probably need to start with an Ionic update.  This project was started with Ionic 4 alpha 7.  Now it's at beta 15.  Where is the changelog and update guide?

We will be starting with a blank app and building the todo list to start from a working model as we introduce the list, details and option pages.  So maybe we don't need to do an upgrade at all.

Here is the outline for the next few sprints:

1. Create the ToDo model and UI
1. Define the data model
1. Create a list component
1. Create module definition
1. Add your route
1. Add a new tab
1. Add an authorization service
1. Add buttons to the homepage
1. Add auth service and list module to tabs module
1. Run and test your app
1. Implementing CRUD functionality
1. Create a modal
1. Define modal in your list module
1. Import the modal in your list page
1. Test CRUD functionality
1. Part 2: Working with Amplify CLI
1. Install and Configure AWS Amplify
1. Creating AWS Resources with the CLI
1. Add Global Shim
1. Adding Analytics to your Ionic app
1. Part 3: Adding Authorization
1. Enable auth UI
1. Using auth UI components
1. Enable Styling
1. Enable components in home module
1. Run and test your app
1. Part 4: Enabling the Cloud Backend
1. Enable Cloud Database
1. Add columns
1. Enable Cloud API
1. Adding CRUD Functionality to Your App

That's a lot to cover, but with Amplify, each step should be really short.  Then we can implement our new component library to show the list and detail pages and save the item states in the cloud protected by OAuth.  But we don't want to do too much until we find out how much this could run per month.  

The first two attempts to set up an Amplify demo app have failed.  Probably that should be a separate project for now.  This project can continue improvements from the list that do not include login (OAuth) and saved preferences option (db).

One of those improvements is new styles for the item state.  This needs to be created as an API for the Stencil component library to implement.  Sounds exciting exclaimation mark.

core.js:1521 ERROR Error: Uncaught (in promise): Error: Template parse errors:
Parser Error: Unexpected token 'Lexer Error: Unterminated quote at column 27 in expression [viewShortDescription(item)']' at column 28 in [viewShortDescription(item)'] in ng:///HomePageModule/HomePage.html@41:5 ("
				</ion-item>
				<ion-item-options padding-start
					[ERROR ->](ionSwipe)="viewShortDescription(item)'"

After two attempts to get a working sample of the todo code working, using Auth0 with Heroku (both free) is looking like a better bet.  Still, if lots of people start using the app, then we will definitely be paying money to those two, which means then having a paid version.  The free version could just be a static list that is bundled with the install so that no server interactions are needed.

This version will have to be made soon.  Probably the first full release should include this version, and the one that relies on a live list and user login to support user options and all our other planned features.  If we release a free version that includes server interactions, and someone writes an article on the app, and suddenly there are a million users, we will be screwed paying for all those free users.

Another thing about this fabled free version, is that we will need to scrape the detail pages from Wikipedia and save them in json files to be bundled with the app.  Another item for the proposed features list.  Copied the proposed features list from Conchifolia here to keep up with pruning the list easier.

After all the issues with iOS, and the failed attempts with AWS, we have re-considered this idea.  We assumed the iOS release would happen right after the Android and be painless.  After more than a month with all the pain and refactoring, all deals are off right now.


## Google Playstore Release

After creating a build for version 0.5.15, and using the Android Studio to do the .apk signing, the upload to the google Play Console failed with the following message:
```
You uploaded an APK with an invalid signature. Error from apksigner: ERROR: JAR_SIG_NO_SIGNATURES: No JAR signatures
```

In the past I have done this on the command line using the Java keytool and a keystore with an alias and then the Java zipalign tool.  These are the commands used:
```
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

This creates a release apk like this:

app-release.apk platforms/android/build/outputs/apk/android-release-unsigned-aligned.apk

That then creates the my-app-release.apk in the current directory.  The zipalign that file:
```
/Users/timcurchod/Library/Android/sdk/build-tools/25.0.2/zipalign -v -p 4 my-app-release.apk my-app-release-aligned.apk
```

After this, if the version is greater that any previous version of the upload, it should be usable for a release.

Using Android Studio, in the Build/Generate Signed APK... option, you can create a new keystore (release-key.jks file) and alias and generate the singed APK automatically.  There is an option for 'Signature Versions: V2 (Full APK Signature) which I checked.  This generates a app-release.apk.  The signature process ensures that only the person who knows the password to the key and alias can update the app, as we as attaching meta data about a person responsible.

But since just doing this with the Android Studio failed, it's time to read the docs to find out what has to happen, or just go back to the beautifully unweildy command line.

[The docs](https://developer.android.com/studio/publish/app-signing) say *Android requires that all APKs be digitally signed with a certificate before they can be installed. And you need to sign your Android App Bundle before you can upload it to the Play Console.*  We did that, no?

When creating an alpha release, I agreed to something about signing which I thought was a new terms and conditions document, but this may have been the mistake.  Now, the alpha release shows a section that says *App signing by Google Play Enabled*.  So maybe we are meant to upload an unsigned version now and the Play Console manages the signing?  There seems to be no way to disable this now.  To test this out create a regular debug apk and see what it says when that is uploaded.

This process creates *three* files now:
```
app-debug.apk
lor-app-debug.apk
output.json
```

OK, only two apks, but what is the point of two?

Uploading app-debug.apk shows the following message:
*You uploaded a debuggable APK or Android App Bundle. For security reasons you need to disable debugging before it can be published in Google Play. Find out more about debuggable APKs or Android App Bundles. You uploaded an APK or Android App Bundle that was signed in debug mode. You need to sign your APK or Android App Bundle in release mode. Find out more about signing.*

Uploading lor-app-debug.apk shows the same message.  Reading a bit more of the docs mentioned above, it says this about the Google signing process: *When you opt in to use App Signing by Google Play, you export and encrypt your app signing key using the Play Encrypt Private Key tool provided by Google Play, and then upload it to Google's infrastructure.*

May as well use the Google solution.  Render onto Cesar.  If this hard drive crashed right now and we had already launched the app, it would be orphaned without the possibility of update.  The docs keep mentioning an *App Bundle* which turns out is a build with filles but defers APK generation and signing to Google Play which generates and serves optimized APKs for each user’s device configuration.

After reading a bit more about the first error above, it turns out that you just have to also click the V1 as well as the V2 build option.  It's not one or the other.  After that the build is accepted, but upton review there are other errors and warnings:
```
Error
Your app has an APK with version code 1 that requests the following permission(s): android.permission.CAMERA. Apps using these permissions in an APK are required to have a privacy policy set.

Warning
This release will not be available to any users because you haven't specified any testers for it yet. Tip: Configure your testing track to ensure that the release is available to your testers.
```

So we don't use the camera, and if we can configure users do we need a privacy policy? Doing a global search for the string 'camera' returns no results in VSCode.  One comment on [a StackOverflow issue](https://stackoverflow.com/questions/41234205/warnings-your-apk-is-using-permissions-that-require-a-privacy-policy-android-p) said this: *Because of AdMob. Their current version 12.0.0 requests READ_PHONE_STATE (bug), even if your app doesn't has it in the manifest. So that's it. They said they will release an update to 12.0.1 soon.*

The next answer says you can remove requirments from

```
<uses-permission android:name="android.permission.READ_PHONE_STATE" tools:node="remove" />
```

Also add attribute
```
xmlns:tools="http://schemas.android.com/tools"
```
To the <manifest> tag to define namespace tools.

This is tailored for a different error, but we could probably just change that to *android.permission.CAMERA*.  Now where is the manifest file?  It's not in the Ionic project anywhere.

Searching Google for *ionic remove requirements from manifest* [this is the first thing that comes up](https://ionicframework.com/docs/native/android-permissions/).  It's an Ionic Native plugin *designed to support Android new permissions checking mechanism*.  When did this new permissions checking system start?  It doesn't say.

The example:
```
this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
  result => console.log('Has permission?',result.hasPermission),
  err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
);
```

So that's not going to help us get thru the Play Store.  It does clarify lower on the page: *Android 26 and above: due to Android 26's changes to permissions handling (permissions are requested at time of use rather than at runtime)*.

Looking at the [second answer for this question](https://stackoverflow.com/questions/41618453/how-to-remove-unnecessary-uses-permission-from-android-platform-build) I checked all the plugin.xml files inside each plugin directory inside the main plugins directory and found now permission entries.

I removed the Android platform which I had added by mistake out of habit fogetting one day that this project uses Capacitor, not Cordova.  Upgraded Ionic after seeing this message:
```
Update available 4.3.1 → 4.5.0
Run npm i -g ionic to update
```

That didn't help.  Someone here pointed out that we will be needing a privacy policy sooner or later (when we collect emails for login and store preferences and item state for example).  So now we are following [this gist](https://gist.github.com/alphamu/c42f6c3fce530ca5e804e672fed70d78) and creating a document for the project to use as a link for th app stores.

### Store listing assets

Uploading screenshots of Chrome emulating a Galaxy S5 results in these messages:
```
You need to resize your screenshot. Min length for any side: 320px. Max length for any side: 3840px. Max aspect ratio: 2:1.
```

Looking at the size of the screenshots from the S5 we have:
```
width: 302
height: 528
```

So our length is too short.  Abandoning the emulation mode and resizing to look about the same ratio, getting some shots at 326 by 611 works.

After the screen shots, there are the promo shots that all have to be particular sizes.

Hi-res icon: 512 x 512
Feature graphic: 1024 w x 500 h
Promo Graphic 180 w x 120 h
TV Banner 1280 w x 720 h

Is it just me or doesn't that tv size seem too small for the standard of flatscreen size these days?

We could also have a video.  Anyone?  Eventually we should do this.  But for now, it's time to start incremental development.  That means one feature per release.  Set a sprint period of about three to four weeks due to the amount of free time available to the project.  We should be able to plow through our features list.

But that's another story.

### Release

One thing I have a problem understanding are the meaning of rollout and release on the Google Play Store console.
```
Release:	0.5.15 Edit
seconds ago: Full roll-out.
RELEASE TO PRODUCTION
Roll-out history seconds ago: Full roll-out.
```

This info includes the text 'full roll-out' and a button 'release to production.  Since this is an alpha release to internal testers only, does releasing that to (alpha) production, or is that a promotion of the release to the public store?




## Fixing the GitHub issues

Trying to tie up some loose ends before the MVP release.

First up, this one is not an issue, but is an easy win.  We should be using either the *cognitive_biasLabel* or the *wikiMedia_label* for item names.  Both have proper formatting.

Also, on the detail page, issue #8: Forer_effect has underscore in title.  If we pass in the above labels, this issue will also be closed.

An official title was created from either of the above labels.  Passing that also to the detail page works for most things except for example titles with the word 'of' in them.  As we all know in English, 'of' should never be capitalized in a title.  A mistake here looks bad for the whole crew.  So things like 'Curse Of Knowledge' look bad.  People, we can all do better with grammar and spelling.

If we remove the ```text-transform: capitalize;``` from the item list and the detail title, we get most of what we want.  Someone thinks that only capitalizes the first letter of a sentence.  But actually it capitalizes the first letter of each word in the selected text.  Really?  Who created that little gem?  Didn't they know?

Still, the 'spiral of silence' stands out with no first letter capitalized.  Actually, we don't need to go that far down the list, 'affect heuristic' is the same.  This should be working:
```
.list__text::first-letter {
    text-transform: uppercase !important;
}
```
But it's not.  It shows up in the inspector like this:
```
.list__text[_ngcontent-c0]::first-letter {
    text-transform: uppercase !important;
}
```

But in the calculated styles shows:
```
text-transform: none;
none.item-md
```

Not sure why, but that item-md must be making life difficult, as if it were not difficult enough.  Going to leave this for now.  We don't want to have to capitalize the first letter of the actual strings, as these are used for the links which as we have learned, are case sensitive.

Next, another non-issue but something we need.  While waiting for the detail page info to load, we want to see the short description.  Because it is truncated with ellipsis in the list, and we cannot edit it yet, we often don't read it or forget to read it before clicking on the item.

The short description is truncated in the actual code.  It's not ideal.  We either keep a copy of the full version, or use css or a pipe to truncate it in the template.  We actually tried a few things to get the maximum space out of the slide out area, but had great difficulties.

We want a css only answer to this, but text-overflow has a serious limitation: it only works on a single line of text.  We want two lines.  Three lines and the spacing looks bad.  Adding padding just pushes the third line partially out of the container.  Not good.

Trying out the extremely long example by [Natalia Onischuk](http://hackingui.com/front-end/a-pure-css-solution-for-multiline-text-truncation/), we are getting rid of ```.substring(0,82)+'...'``` from the short description in the JavaScript.  The result doesn't work, but putting the padding at 9px will not show the third line.  The content looks bad at the right, but having the ellipsis appear after 82 characters which is at a different place for each description and wastes valuable real estate was getting very annoying.

The Natalia solution is slightly better.  We will use it for now.  Without it and just the padding, we actually see some of the third line below the box.  Still, there is no promised ellipsis.  There is a solution, but we have other ideas for the short description, so this hack will work for now.

We will move the item component into our fledgling [component library](https://github.com/timofeysie/socius) and create our own item just the way we like it.  The idea right now is icons that show/hide the description with an expanding animation and other icons to change the state of the item.  Until then, the Natalie plus padding will work.


## Fixing the citations
[Issue number 6](https://github.com/timofeysie/loranthifolia/issues/6) on the GitHub logs a problem with the footnotes.  After the second citation, there is extra junk that is not marked up correctly.

You can see in the markup below after the number 447779 the portion starting with ```.mw-parser-output cite.citation{``` is shown in raw text on the page:
```
<li id="cite_note-Sackett-2"><span class="mw-cite-backlink"><b><a href="#cite_ref-Sackett_2-0">^</a></b></span> <span class="reference-text"><cite class="citation journal">Sackett, D. L. (1979). "Bias in analytic research". <i>Journal of Chronic Diseases</i>. <b>32</b> (1–2): 51–63. <a href="https://en.wikipedia.org/wiki/Digital_object_identifier" title="Digital object identifier">doi</a>:<a rel="nofollow" class="external text" href="//doi.org/10.1016%2F0021-9681%2879%2990012-2">10.1016/0021-9681(79)90012-2</a>. <a href="https://en.wikipedia.org/wiki/PubMed_Identifier" class="mw-redirect" title="PubMed Identifier">PMID</a>&#160;<a rel="nofollow" class="external text" href="//www.ncbi.nlm.nih.gov/pubmed/447779">447779</a>.</cite><span title="ctx_ver=Z39.88-2004&amp;rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&amp;rft.genre=article&amp;rft.jtitle=Journal+of+Chronic+Diseases&amp;rft.atitle=Bias+in+analytic+research&amp;rft.volume=32&amp;rft.issue=1%E2%80%932&amp;rft.pages=51-63&amp;rft.date=1979&amp;rft_id=info%3Adoi%2F10.1016%2F0021-9681%2879%2990012-2&amp;rft_id=info%3Apmid%2F447779&amp;rft.aulast=Sackett&amp;rft.aufirst=D.+L.&amp;rfr_id=info%3Asid%2Fen.wikipedia.org%3AObserver-expectancy+effect" class="Z3988"></span><style data-mw-deduplicate="TemplateStyles:r861714446">.mw-parser-output cite.citation{font-style:inherit}.mw-parser-output q{quotes:"\"""\"""'""'"}.mw-parser-output code.cs1-code{color:inherit;background:inherit;border:inherit;padding:inherit}.mw-parser-output .cs1-lock-free a{background:url("//upload.wikimedia.org/wikipedia/commons/thumb/6/65/Lock-green.svg/9px-Lock-green.svg.png")no-repeat;background-position:right .1em center}.mw-parser-output .cs1-lock-limited a,.mw-parser-output .cs1-lock-registration a{background:url("//upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Lock-gray-alt-2.svg/9px-Lock-gray-alt-2.svg.png")no-repeat;background-position:right .1em center}.mw-parser-output .cs1-lock-subscription a{background:url("//upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lock-red-alt-2.svg/9px-Lock-red-alt-2.svg.png")no-repeat;background-position:right .1em center}.mw-parser-output .cs1-subscription,.mw-parser-output .cs1-registration{color:#555}.mw-parser-output .cs1-subscription span,.mw-parser-output .cs1-registration span{border-bottom:1px dotted;cursor:help}.mw-parser-output .cs1-hidden-error{display:none;font-size:100%}.mw-parser-output .cs1-visible-error{font-size:100%}.mw-parser-output .cs1-subscription,.mw-parser-output .cs1-registration,.mw-parser-output .cs1-format{font-size:95%}.mw-parser-output .cs1-kern-left,.mw-parser-output .cs1-kern-wl-left{padding-left:0.2em}.mw-parser-output .cs1-kern-right,.mw-parser-output .cs1-kern-wl-right{padding-right:0.2em}</style></span>
</li>
```

It looks like we can just remove the style tag there to solve this issue.  This method works fine.  Ideally this would be done with DOM manipulation, when we get back to toggling the preambles using their icons, it can be looked at again then.


## Alpha release

There is a long list now of things to do to make the app better.  After using the app during development for a while, it's becoming clear that a long list of items is nice, but really we want to go one screen at a time, and we want the app to organize that for us based on the state of items.

But if we keep on adding new features, there will never be a release, and we will never be able to tell our friends and colleagues about it.  So what is the list of items that would make the first release something to not be ashamed of?

1. (done) detail page icons skewed
1. (done) icon and splash screen
2. (done) add padding to the spinner
3. (done) put the refresh list action in the options page
4. (done) make the short descriptions responsive
5. (done) add the beige theme for the header
6. (done) deal with the lower case items at the end of the main list
7. (done) make sure redirect failures are handled gracefully

Nothing really big here, but things that look bad should be fixed before jumping in to any new features.

Number 2 & 3 have been addressed already.  Currently, number 7 is requiring quite a bit of work due to finding the Q-codes for WikiData items.  See the [Conchifolia project]((https://github.com/timofeysie/conchifolia)) for updates on that saga.  Once it's working there we can implement the same solution here.  After getting the redirects working, instead of getting in to using the Q-codes for anything else, it's time to have some fun with issue 1. detail page icons skewed.

We actually want to hide the text and just show the icons, which can then be expanded and collapsed.  This turns out to be more involved that we have time for with our goal of getting an MVP release ready.  The work done so far on this is in the [Manipulating the preamble DOM](#manipulating-the-preamble-DOM) section.

So with that done (for now) the next issue on deck is creating a icon and splash screen for the app.  Fire up [Gimp](https://www.gimp.org/)!

Instead of doing something elaborate and taking days to create options and then choose the best and then generate the icons and splash screens needed, we will go with a basic psi symbol as a placeholder to get this box checked for a first release.

Optimistically ran ```ionic cordova resources``` which generates all the various size assets used for deployments for iOS and Android.  Loaded the app on a device and there was no change to the graphics.  Then, realizing it's right there in the command: *cordova*.  Since we are using Capacitor now, of course it will fail.  Good old [Josh Morony](https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/), the Ionic tut king spells it out for us:
*Unlike Cordova, where splash screens and icons were specified in the config.xml file, in Capacitor projects we can just manage the splash screens and icons directly in the native project like any normal native application developer would.*

Actually, I was hoping that Cordova could still be used as the generating tool for the assets.  I guess this is in line with Capacitor forcing the developer to be more hands on with the respective build tools for deployment.

Maybe we can still use what Cordova did.  In the output from the command, and in git status, we can see what was generated:
```
 rewrite resources/android/icon/drawable-hdpi-icon.png (99%)
 rewrite resources/android/icon/drawable-ldpi-icon.png (99%)
 rewrite resources/android/icon/drawable-mdpi-icon.png (99%)
 rewrite resources/android/icon/drawable-xhdpi-icon.png (99%)
 rewrite resources/android/icon/drawable-xxhdpi-icon.png (99%)
 rewrite resources/android/icon/drawable-xxxhdpi-icon.png (99%)
 rewrite resources/android/splash/drawable-land-hdpi-screen.png (99%)
 rewrite resources/android/splash/drawable-land-ldpi-screen.png (99%)
 rewrite resources/android/splash/drawable-land-mdpi-screen.png (99%)
 rewrite resources/android/splash/drawable-land-xhdpi-screen.png (98%)
 rewrite resources/android/splash/drawable-land-xxhdpi-screen.png (98%)
 rewrite resources/android/splash/drawable-land-xxxhdpi-screen.png (84%)
 rewrite resources/android/splash/drawable-port-hdpi-screen.png (98%)
 rewrite resources/android/splash/drawable-port-ldpi-screen.png (99%)
 rewrite resources/android/splash/drawable-port-mdpi-screen.png (99%)
 rewrite resources/android/splash/drawable-port-xhdpi-screen.png (99%)
 rewrite resources/android/splash/drawable-port-xxhdpi-screen.png (98%)
 rewrite resources/android/splash/drawable-port-xxxhdpi-screen.png (67%)
 rewrite resources/icon.png (95%)
 rewrite resources/splash.png (98%)
 ```

And the resources command is on the list of tools from the Morony blog.  But actually using those generated assets (feels like money using that word) will be platform specific.

So one with the Android workflow.  The icons are located *inside of the mipmap folder, which you can find at app > res > mipmap.  To generate a new set of icons, right-click on the res folder and go to New > Image Asset, select a 1024×1024 pixels or larger icon, click Next and then Finish.*

So that's that for the icon.  Next up, the splashy splash.  *The default splash screens are in app > res > drawable > splash. Right-click on the drawable folder and choose Reveal in Finder you will be able to see folders for all of the various resolutions, then replace the splash.png file in each of these drawable*.

This is where we can re-use the Cordova files.  We have to do is move them to their correct directory and then rename the.  Kind of a drag.  There are still a few folders that we don't have images for.  To see how it goes with just those, while generating the .apk file, we got this message:
```
12:09 PM	Build APK(s): Errors while building APK. You can find the errors in the 'Messages' view.
```

There is no messages in the view menu options.  On a 'Text' tab in the colossal IDE shows this:
```
/Users/tim/repos/loranthifolia-teretifolia-curator/loranthifolia/android/app/src/main/res/drawable-land-xxxhdpi/splash-old.png: Error: '-' is not a valid file-based resource name character: File-based resource names must contain only lowercase a-z, 0-9, or underscore
```

The previous files were renamed to splash-old so that if there was a problem we could just alter the file causing the problem by modifying the original.  But have to get rid of those files and try again.  You would think the big bad IDE could handle a few extra files.

Anyhow, since this is going in app stores, it could be on any device, so we should make sure the images are all complete.  So to be safe we will also manually provide the icons and splashes that do not contain the new images.  For example, there is a mipmap-mdpi/icon.png that has the size 48 x 46.

After that, we are on to the short descriptions and making them fit into the slide out container or crop them depending on available size.  That should be fun.  We will let the user edit these (in the next release, we promise!) when we decide on where to store the user generated content.  A leading contender now is AWS using thier [Amplify whatever](https://aws-amplify.github.io/amplify-js/media/ionic_guide).  The good thing about this is it includes OAuth/user management and hosting.  We can also play with serverless funtions and put it on our resume!

With the descriptions, it's proving elusive getting perfectly centered short descriptions.  Some of the items are covered on the left, as if the slide wont slide all the way to reveal the whole thing.  Attentional bias is one example of this.

Someone might have figured this out.  One answer on SO said it's *a bug in how the CSS rules are being applied*, so I don't feel so bad about banging my head against this problem now.  Google!

After a little be we are getting rid of the '| slice:0:100' ellipsis template method and using this little css trick thanks to [Chris Coyier](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/):
```
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

The only problem with this is it gives us only one line.  If it will get us to our first release and doesn't look bad, it's in.  I was about to tick this one off, but on testing a device view, it's just not enough information to be helpful without two lines, so we're not out of the woods yet.

[This SO question](https://stackoverflow.com/questions/48047524/dynamically-styling-ionic-ion-item-sliding-items-with-ngstyle) is 9 months old.  I'm thinking now this is a shadow DOM issue, so let's find out what properties are exposed in this Ionic component before settling for less.  As a bonus we will be able to answer that question on SO and get some brownie points.

You can only affect things that Ionic has created css variables for within the shadow-root elements.  But, I can't see any '#shadow-root' tags in the DOM window of Chrome inspector.

We could always play with the native elements like with the failed preamble expander attempt.  There is something appealing about playing with the DOM.

Still, there should be a shadow DOM there in the inspector.  [This answer](https://forum.ionicframework.com/t/ionic-4-header-background-image/138677/2) points to the problem:
*The problem why whe can’t use css to style the header anymore is that ionic 4 encapsulates it inside a web component. Web components are meant to be uneffected by outside css.*

*Luckily we can absuse the color variables in “theme/variables.scss” to insert an image into the header. Because it’s content is direcly used as value for the css background property it is possible to do something like this:*

So using the color="medium" on the toolbar let's us set the color of the header.  The two line descriptions are not centered, but looking better than they were.  It's time to move on for now and triage these issues for the next sprint.

One more minor change that took far too long was removing footnotes from the short descriptions.  Where did that function go?  It was in Conchifolia.  Tried to move it into Socius but had difficulty removing any Angular from that dated project.  I couldn't make up my mind on the best way to create the simplest vanilla JavaScript front-end neutral lib.  Stay tuned.  This will be needed when we get back to the React, React Native and Stencil implementations of this app.

The last thing on our list then is the lower case items at the end of the main list.  This is the first item that we can't find to uppercase the first letter of the search name.
```
cognitive_bias: "http://www.wikidata.org/entity/Q382233"
cognitive_biasLabel: "affect heuristic"
lang: "en"
sortName: "affect heuristic"
```

After clarifying the various places where the sort names are created, someone decided lower case looks better.  Something about e e cummings.  This actually needs to be upper case.  e e cummings might be OK with us here, but the rest of the world might expect proper capitalizations.

There are still some funny things going on.

*contrast effect* had no description.

Also, when refreshing the list hangs.  Actually, if you re-load the app, the new list is there, but the UI sometimes does not refresh.

To rule things out, we can catch these errors that happen when the app is offline:
```
zone.js:2969 GET https://radiant-springs-38893.herokuapp.com/api/list/en net::ERR_INTERNET_DISCONNECTED
...
globalZoneAwareCallback @ zone.js:1566
home.page.ts:156 offline error HttpErrorResponse {headers: HttpHeaders, status: 0, statusText: "Unknown Error", url: null, ok: false, …}
```

The *contrast effect* actually does return a description sometimes also, so this may be a network connect issue we need to handle gracefully.

The line shown above, namely home.page.ts:156 is triggered in the catch block of the myDataService.getWikiDataList call.  The problem is we have used a spinner that shows when there is no list.  On the detail page, we show a message indicating re-direct status as well as the spinner.  Well, that's one problem.  We could fix that by using an updated message that will show as well as the spinner, and at the end, if everything fails, update the message and cancelling the spinner by setting the list to an empty array.

The strange thing is the refresh list function works with ionic serve, and returns rather quickly, but on our Android test device, we get an infinite spinner every time.  We will have to connect it and use remote debugging to see what's going on in the console to see where it's getting stuck.  

In any case, we never want to allow an infinite spinner.  On another project I work on, we use a timeout service which can be set to show an alert after a specific length of time.  This would allow the user to try again or try another feature, or at least stop them from waiting and getting impatient and giving up on the app forever.

But I don't think that that is the situation.  If you kill the app and load it again, the new list is there in the local storage, so obviously it did load and was saved.  For some reason the UI was not updated.  I'm pretty sure that the refresh list used to work on the device, so we have a regressions here.

Looking at the log on a device when the list is loaded but now shown, we see this:
```
list (191) [{…}, {…}, …]
capacitor-runtime.js:70 2.1: Stored en-list
```

That's in the DataStorageService.setItem function.  When testing with ionic serve, we don't see the second comment.  That's because it's using native storage on the device which is not available in the browser.  In the home/list page, this is where the action should end.  In the browser we can see the number of items in the list starting at 90, then increasing quickly as the WikiMedia calls come back.  The list is live and shows it change as it is sorted, right before the list is then put into either local storage for the browser or native storage for a device.

Since we see nothing during this process, the problem has already started.  So this may be a navigation issue.  We send the navigation back to the home page when the user chooses to refresh the list in the options page like this:
```
    this.dataStorageService.sharedAction = 'reset-list';
    this.location.back();
```

The role of the data storage is kind of a hack since there is no navigate back with parameters, and using a navigate to would create a whole new class and enter the world of the memory leak.

Back in the home page we check for the presence of 'reset-list' in the storage service, set it back to none, and then call refreshList().
```
refreshList() {
    this.list = null;
    this.getListFromStorageOrServer();
}
```

When the list is set to null, the UI does refresh, as this is what triggers the spinner to be shown.  What happens if this is removed?  Nothing in the browser.  I would expect the list to double in size.  Not sure if it's worth going through the build and deploy process on the device.

There are at least three things to try based on [this Ionic Forum thread](https://forum.ionicframework.com/t/ionic-refresh-current-page/47167/24):
```
location.reload();
// or
window.location.reload()

// 2nd option
import { Content } from ‘ionic-angular’;
export class TestPage {
@ViewChild(Content) content: Content;
...
this.content.resize();

// 3rd option
// apparently, pull to refresh does this:
this.navCtrl.setRoot(this.navCtrl.getActive().component);
```

The first two options work, but now our loading spinner solution is not so great.  It will show until the first call returns, so the user will see the list of 91 items from the WikiData call.  But then nothing for quite some time until the three Wikipedia sections load and are added to the list and sorted.  Then the screen goes blank and the new list is re-loaded.  Not great UX.

Some solutions to this would be to show the spinner in the header.  Possibly disable the items in the list to prevent the user clicking thru and interrupting the load.  Maybe this wouldn't be an issue.  Not sure if all that work would finish if the user navigated away during the process.

Anyhow, time to deploy to the device and see if it works there.

The good news is, it does!  Actually better than the experience in the browser.  As I mentioned before, the spinner disappears after the first list loads, but the user is hanging until the rest are loaded, merged, sorted and the page refreshes.

This does pose a bit of a problem for development, when we want to look at the log created by refreshing the list.  It will disappear on reload.  Bummer.

This section became too long.  The section below was initially part of this.  Also, fixing some of the issues on the GitHub site we considered and fixed.  More testing needs to be done to make sure there is nothing embarrassing int he app before the first release via the app stores.

The optimism with which this section was started points out the big problems people have with estimating tasks!


## The backup title for Loranthifolia

On the matter of spinners, we still have to fix the infinite spinner by setting the list to something.

```
error: "Redirect to data uri value"
message: "Http failure response for https://radiant-springs-38893.herokuapp.com/api/detail/experimenter's/en/false: 300 Multiple Choices"
```
Not sure what statusText: "Multiple Choices" means.  If you look at the Wikipedia page, it does have a long list of things to try.  The real link should be in the backup title, shouldn't it?

This is what the Conchifolia readme says about it:

*Experimenter'* appears on the list with the backup title of *Experimenter's bias*
```500 Experimenter%27s_bias redirect error Internal Server Error```

Some of us here were wondering if that was a typo in the readme or not.
The actual Wikipedia page is a redirect:
```
Observer-expectancy effect (Redirected from Experimenter's bias)
```

It looks like this kind of business logic got lost in that project.  It just goes to prove that we need a better more organized way to implement these re-directs.  Some are done on the server, and some are done in the clients.  Where is the single source of truth?  Scattered across five projects.  Sometimes a monolith makes sense.

Anyhow, on with the work.  How does Conchifolia deal with getting the backup titles?

If you look at [the Heroku site hosting the sample demonstration site](https://radiant-springs-38893.herokuapp.com/detail/experimenter's/en/Experimenter's%20bias/null) and look for our item, you find *Experimenter's (Experimenter's bias)*.  We shouldn't be showing the main title in this case.  But whatever.  Choose the item and we get:
```
[object Object]
Redirect to data uri value
```

Not a very successful re-direct.  It is some unfinished business with the data page.  We do get the WikiData page for the item.  Here is the console log for the re-direct.
```
1.this.list[i][backupTitle] Experimenter's bias
detail.page.ts:47 4. error HttpErrorResponse {headers: HttpHeaders, status: 300, statusText: "Multiple Choices", url: "https://radiant-springs-38893.herokuapp.com/api/detail/experimenter's/en/false", ok: false, …}
(anonymous) @ detail.page.ts:47
push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.__tryOrUnsub @ Subscriber.js:195
push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.error @ Subscriber.js:146
...
(anonymous) @ pages-detail-detail-module.js:1
detail.page.ts:50 5. error msg Redirect to data uri value
detail.page.ts:53 6. Redirect to data uri value
backend-api.service.ts:22 label /api/data/query/Experimenter's bias/en
detail.page.ts:99
```

You can see in the backend-api.service.ts line 22 has *Experimenter's bias* there.  The bindings array returned from this call is an array of one item with two objects, item and item label.
```
item:
    type: "uri"
    value: "http://www.wikidata.org/entity/Q2556417"
itemLabel:
    type: "literal"
    value: "observer-expectancy effect"
    xml:lang: "en"
```

The value there could be used to create yet another re-direct to the *observer-expectancy effect*.  For now we have a solution to the infinite spinner.  But if we can we want all these redirect automatically.

First, we need to go back to Conchifolia and fix that re-direct, then eventually come back here to implement the backup title and full re-direct.

That worked out well, but now we have some work to do here.  Namely, introduce the backupTitle concept from Conchifolia.  In the addItems function which comes first in the code, take the backupTitle if it exists and put it on the item model.

But before this happens, the parseSectionList which we call parseList function here needs to add the backup title.  To do this we also need the helper getAnchorTitleForBackupTitle() function.

Then, on navigation we need to determine if this title should be used instead of the normal title.  This is done in the navigateAction() function.

The problem with this last item is how the Ionic app navigates to the detail pages.  In the template we just do this:
```
routerLink="/detail/{{ item.sortName }}"
```

Probably we want to replace this with a programmatic approach and use the navigateAction() function instead.

Since we are using Ionic 4 which can use the Angular router, we should be able to use the entire navigateAction() function here, right?

There is extra baggage with it however.  First we will also need the findQCode() funtion.

We also need to change the listLanguage to langChoice.  Or should we be converting these names so they match Conchifolia exactly?  Good question.  Some here think these differences are obvious to any developer.

Good questions aside, we can change the routerLink to this:
```
(click)="navigateAction(item.sortName, i)"
```

With those changes in place, this is the error that we get:
```
ERROR Error: Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'detail/actor-observer_bias/en/actor-observer%20bias/null'
```

Now we also need to add the qCode to the route.  Axctually, we will need two routes now:
```
  { path: 'detail/:id/:listLanguage/:qCode', loadChildren: './pages/detail/detail.module#DetailPageModule' },
  { path: 'detail/:id/:listLanguage/:title/:qCode', loadChildren: './pages/detail/detail.module#DetailPageModule' },
```  
We don't need the list language in Loranthifolia because the detail page has access to it.  Remember, in Conchifolia the language choice is done on a select on the list page.  The error happens now due to the way the routes are assembled in our function.
```
this.router.navigate(['detail/'+itemRoute+'/'+this.langChoice+'/'+this.list[i].sortName+'/'+qCode]);
```

We used to use the item name, so that should be the default.  We need to get clear on what the role of the navigate action is in Conchifolia.  The notes in the function show:
```
1.this.list[i][backupTitle]
2.this.list[i][cognitive_bias].replace()
3.else sortName
```

Currently, actor observer bias works.  That's using method 3.  What was the one that started this whole mess?
'experimenter's'  which should be 'experimenter's bias' that then should redirect to 'observer-expectancy effect' by using the qCode.

That link is still not working.
```
message: "Http failure response for https://radiant-springs-38893.herokuapp.com/api/detail/experimenter's/en/false: 300 Multiple Choices"
```

It is also using method 3, but it should be using method 1.

Oh, someone forgot to refresh the list!

Now, in the parseList() function, for Experimenter's, we see this table div:
```
<td>
    <a href="/wiki/Experimenter%27s_bias"
        class="mw-redirect"
        title="Experimenter's bias">Experimenter's</a>
     or
     <a href="/wiki/Expectation_bias"
        class="mw-redirect"
        title="Expectation bias">expectation bias</a>
</td>
```

It looks like we want the second one there.  But how will we decide if there are multiple ones?  A quick look down the list shows that this one also has two options:
```
<td>
    <a href="/wiki/Forer_effect"
        class="mw-redirect"
        title="Forer effect">Forer effect</a>
    or
    <a href="/wiki/Barnum_effect"
        title="Barnum effect">Barnum effect</a>
</td>
```

The only difference there is there is no class on the second anchor.  Now the redirects are working.  We should think about using the backup title as the actual title if it exists.

After a bit of testing on the device, switching to Korean immediately brings up an problem with 3.else sortName 노출 효과
message: "Http failure response for https://radiant-springs-38893.herokuapp.com/api/detail/%25eb%2585%25b8%25ec%25b6%259c_%25ed%259a%25a8%25ea%25b3%25bc/ko/false: 300 Multiple Choices"


[This link works](https://ko.wikipedia.org/wiki/%EB%85%B8%EC%B6%9C_%ED%9A%A8%EA%B3%BC).  The only difference is the route name is encoded with lower case.  Actually no, there is a difference:
```
%EB%85%B8%EC%B6%9C_%ED%9A%A8%EA%B3%BC
%25eb%2585%25b8%25ec%25b6%259c_%25ed%259a%25a8%25ea%25b3%25bc
```

Remove all the %25s and they are the same, right?  The same thing happens for the peridolia affect.
```
2018-11-01T12:08:48.551467+00:00 app[web.1]: singlePageUrl http://ko.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=%25eb%2585%25b8%25ec%25b6%259c_%25ed%259a%25a8%25ea%25b3%25bc
2018-11-01T12:08:48.625280+00:00 app[web.1]: details simple redirect Url https://ko.wikipedia.org/wiki/%25eb%2585%25b8%25ec%25b6%259c_%25ed%259a%25a8%25ea%25b3%25bc
2018-11-01T12:08:48.731384+00:00 heroku[router]: at=info method=GET path="/api/detail/%25eb%2585%25b8%25ec%25b6%259c_%25ed%259a%25a8%25ea%25b3%25bc/ko/false" host=radiant-springs-38893.herokuapp.com request_id=9837287f-ade4-4fe2-b402-45470a22034f fwd="49.181.226.52" dyno=web.1 connect=0ms service=179ms status=300 bytes=424 protocol=https
2018-11-01T12:17:11.177735+00:00 app[web.1]: singlePageUrl http://ko.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=%25ed%258c%258c%25eb%25a0%2588%25ec%259d%25b4%25eb%258f%258c%25eb%25a6%25ac%25ec%2595%2584
2018-11-01T12:17:11.318543+00:00 app[web.1]: details simple redirect Url https://ko.wikipedia.org/wiki/%25ed%258c%258c%25eb%25a0%2588%25ec%259d%25b4%25eb%258f%258c%25eb%25a6%25ac%25ec%2595%2584
2018-11-01T12:17:11.414343+00:00 heroku[router]: at=info method=GET path="/api/detail/%25ed%258c%258c%25eb%25a0%2588%25ec%259d%25b4%25eb%258f%258c%25eb%25a6%25ac%25ec%2595%2584/ko/false" host=radiant-springs-38893.herokuapp.com request_id=820947a7-733b-489c-a613-1657a80ecdfd fwd="120.18.228.99" dyno=web.1 connect=0ms service=237ms status=300 bytes=424 protocol=https
```

The server log is not helpful.  These use to work...  Accoding to [this url endcode reference](https://www.w3schools.com/tags/ref_urlencode.asp), %25 is the code for the actual character %.  So it looks like it's doubly encoded.

There are two places in the app where we can find the encodeURI JavaScript function:

In detail.page.ts right before the call to the backend:
```
    const itemNameAgain = encodeURI(linkTitle).toLowerCase();
    this.myDataService.getDetail(itemNameAgain,this.langChoice,false).subscribe(
```

And then again in the data service:
```
  getDetail(pageName: string, lang: string, leaveCaseAlone: boolean) {
    const backendDetailUrl = 'https://radiant-springs-38893.herokuapp.com/api/detail/'+pageName+'/'+lang+'/'+leaveCaseAlone;
    return this.httpClient.get(encodeURI(backendDetailUrl))
```

Well, there's yr' problem!

Which one makes more sense, the caller or the callee?
I'm thinking the callee should do what it needs without the caller having to know what that is.

After that, the 노출 효과 redirect works!  
http://localhost:8100/detail/%EB%85%B8%EC%B6%9C%20%ED%9A%A8%EA%B3%BC/null

The second one seems to time out:
3.else sortName 호손 효과
```
Request URL: https://radiant-springs-38893.herokuapp.com/api/detail/%ED%98%B8%EC%86%90_%ED%9A%A8%EA%B3%BC/ko/false
```

Another item in the list failes:
```
zone.js:2969 GET https://radiant-springs-38893.herokuapp.com/api/detail/%ED%98%84%EC%83%81%EC%9C%A0%EC%A7%80%ED%8E%B8%ED%96%A5/ko/false 500 (Internal Server Error)
detail.page.ts:123 error from detail
HttpErrorResponse {headers: HttpHeaders, status: 500, statusText: "Internal Server Error", url: "https://radiant-springs-38893.herokuapp.com/api/de…3%81%EC%9C%A0%EC%A7%80%ED%8E%B8%ED%96%A5/ko/false", ok: false, …}
error: "Error code:missingtitle"
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
message: "Http failure response for https://radiant-springs-38893.herokuapp.com/api/detail/%ED%98%84%EC%83%81%EC%9C%A0%EC%A7%80%ED%8E%B8%ED%96%A5/ko/false: 500 Internal Server Error"
name: "HttpErrorResponse"
ok: false
```

What does the server say?
```
2018-11-03T05:31:13.971480+00:00 heroku[router]: at=info method=GET path="/api/detail/%ED%98%84%EC%83%81%EC%9C%A0%EC%A7%80%ED%8E%B8%ED%96%A5/ko/false" host=radiant-springs-38893.herokuapp.com request_id=17f9e580-9091-447f-a6a2-553d8a5b252d fwd="49.181.226.52" dyno=web.1 connect=1ms service=359ms status=500 bytes=426 protocol=https
2018-11-03T05:31:13.963101+00:00 app[web.1]: 2.errData, trying detailsSimpleRedirect missingtitle
2018-11-03T05:31:13.963996+00:00 app[web.1]: details simple redirect Url https://undefined.wikipedia.org/wiki/%25ED%2598%2584%25EC%2583%2581_%25EC%259C%25A0%25EC%25A7%2580_%25ED%258E%25B8%25ED%2596%25A5
2018-11-03T05:31:13.967729+00:00 app[web.1]: errors-3: missingtitle
2018-11-03T05:31:14.072726+00:00 app[web.1]: events.js:183
2018-11-03T05:31:14.072730+00:00 app[web.1]: throw er; // Unhandled 'error' event
2018-11-03T05:31:14.072732+00:00 app[web.1]: ^
2018-11-03T05:31:14.072733+00:00 app[web.1]:
2018-11-03T05:31:14.072738+00:00 app[web.1]: Error: getaddrinfo ENOTFOUND undefined.wikipedia.org undefined.wikipedia.org:443
2018-11-03T05:31:14.072739+00:00 app[web.1]: at errnoException (dns.js:50:10)
2018-11-03T05:31:14.072741+00:00 app[web.1]: at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:92:26)
2018-11-03T05:31:14.193322+00:00 heroku[web.1]: State changed from up to crashed
...
```

Looks like we didn't get rid of the %25s.  The server was calling the detail redirect without the language and leave case alone args, so that was also causing a problem.  Now everything seems to be fine.


## Manipulating the preamble DOM

A brief view of the html shows a table with two styles that will indicate the two elements:
```
<tbody>
    <tr>
        <td class="mbox-image">
            <div style="width:52px">
                <img alt=""
                    src="//upload.wikimedia.org/...Ambox_important.svg.png"
                    width="40" height="40" srcset="//upload.wikimedia.org/...Ambox_important.svg.png 1.5x, //upload.wikimedia.org/...Ambox_important.svg.png 2x"
                    data-file-width="40"
                    data-file-height="40" />
            </div>
        </td>
        <td class="mbox-text">
            <div class="mbox-text-span">
                <div class="mw-collapsible"
                    style="width:95%;
                    margin: 0.2em 0;">
                    <b>This article has multiple issues.</b> Please help
```

The classes mbox-image and mbox-text are what we can do.  We want to put a click handler on the image, and a conditional show/don't show on the text.  Find element by class.


I always have to look at a lot of examples when accessing elements via the renderer in Angular.  Getting an array of DOM elements by class name is the classic way to go.  This is the 2018 Angular way to do it:
```
let texts = this.descriptionhook.nativeElement.getElementsByClassName('mbox-text');
for (let i = 1; i < texts.length; i++) {
    texts[i].innerHTML = '';
};
```

Setting them to an empty string works to remove all their children.  But, actaully, we want to hid and show them.  Do we keep a backup of them before deleting them, and add them back in the icon element on click function?  Guess that would work.  It would be nice to put an *ngIf on it to remove and add it back from the DOM.  But, maybe we should be destructuring the preambles and making our own array of preambles.  Maybe we should make a class for this purpose.

The above code actually is doing a poor job.  The array returns a parent div (the exclamation icon) with three child divs (a question mark, a pencil on paper, etc).  But, maybe if someone here learned more about querying WikiData/Media, we could get exactly what we need.

The exclamation mark has a generic preamble description in elements:
*This article has multiple issues.  Please help improve it or discuss these issues on the talk page.(Learn how and when to remove these template messages)*

Onclick of this icon, we want this description to appear, and the icons inside the mbox-text to appear.  Onclick of *those* icons will then show each description in turn.

Here is the markup for the content after the exclamation mark.
```
<td class="mbox-text">
    <div class="mbox-text-span">
        <div class="mw-collapsible"><b>This article has multiple issues.</b> Please help <b><a class="external text" href="//en.wikipedia.org/w/index.php?title=Actor%E2%80%93observer_asymmetry&amp;action=edit">improve it</a></b> or discuss these issues on the <b><a href="https://en.wikipedia.org/wiki/Talk:Actor%E2%80%93observer_asymmetry" title="Talk:Actor–observer asymmetry">talk page</a></b>. <small><i>(<a href="https://en.wikipedia.org/wiki/Help:Maintenance_template_removal" title="Help:Maintenance template removal">Learn how and when to remove these template messages</a>)</i></small>
            <div class="mw-collapsible-content">
                <table class="plainlinks metadata ambox ambox-style ambox-More_footnotes" role="presentation">
                    <tbody>
                        <tr>
                            <td class="mbox-image">
                                <div><img alt="" src="//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/40px-Text_document_with_red_question_mark.svg.png" width="40" height="40" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/60px-Text_document_with_red_question_mark.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/80px-Text_document_with_red_question_mark.svg.png 2x"></div>
                            </td>
                            <td class="mbox-text"></td>
                        </tr>
                    </tbody>
                </table>
                <table class="plainlinks metadata ambox ambox-content" role="presentation">
                    <tbody>
                        <tr>
                            <td class="mbox-image">
                                <div>
                                    <a href="https://en.wikipedia.org/wiki/File:Crystal_Clear_app_kedit.svg" class="image"><img alt="Crystal Clear app kedit.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Crystal_Clear_app_kedit.svg/40px-Crystal_Clear_app_kedit.svg.png" width="40" height="40" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Crystal_Clear_app_kedit.svg/60px-Crystal_Clear_app_kedit.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Crystal_Clear_app_kedit.svg/80px-Crystal_Clear_app_kedit.svg.png 2x"></a>
                                </div>
                            </td>
                            <td class="mbox-text"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div><small class="hide-when-compact"></small></div>
</td>
```

As a challenge, and a learning experience, we will try and use class names and elements to add these actions.

First, to show only the exclamation mark, we can hid all the other content like this (ignoring error checking):
```
let texts = this.descriptionhook.nativeElement.getElementsByClassName('mbox-text');
let exclamationMarkDesc = texts[0].getElementsByClassName('mw-collapsible');
```

Next, adding the click listeners.  The ngAfterViewChecked lifecycle hook gets called four times after adding the click listener once which means the listener is being added multiple times.  Even if we put the click event on the element that contains the content in our template, the ngAfterViewChanged hook gets called multiple times, which reprocesses all the hiding login again and again.  Not good.

However, if we add the listeners in the ionViewDidEnter where it seems we should be able to, nothing happens and we don't have access to the DOM.

Reading through [this blog](https://blog.angularindepth.com/working-with-dom-in-angular-unexpected-consequences-and-optimization-techniques-682ac09f6866) on working with the DOM in Angular, it says after removing elements this way *change detection is still run for the child component and its children*.  It's actually a kind of virtual DOM (hello React!).  Internally Angular has a data structure commonly called a View or a Component View.  So removing the actual DOM does not touch this model.

works directly with views and such tool in Angular is View Container.
it can hold two types of views: embedded and host views.
Embedded views are created from templates using TemplateRef, while host views are created using a view (component) factory.
for static views it holds a reference to child views inside the node specific to the child component.
Dynamic view hooks are obtained like this:
```
@ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
```

embedded views like this:
```
@ViewChild('tpl', {read: TemplateRef}) tpl: TemplateRef<null>;
```

The method we tried first was this:
```
@ViewChild('descriptionhook') descriptionhook: ElementRef;
```

Looking at the TemplateRef method next, our hook is undefined in the recommends lifecycle hood of ngAfterViewInit().  So does this mean that we shouldn't be using the embedded vue method?  ViewContainerRef also shows as undefined in this hook.  Trying the other problem lifecycle hooks that at least worked for ElementRef's, both TemplateRef and ViewControllerRef are also undefined.  Need to finish reading that blog and looking at some of the sample code.

A first thought is that using the following is not working for these methods:
```
<div>[innerHTML]="description"></div>
```

Maybe what we need to be doing is what is discussed in the blog.
Create a host view with a component factory, use the componentFactoryResolver service to obtain a reference to the component factory and use it to initialize the component, create the host view and attach this view to a view container.  After all that, the writer has the gall to say: *To do that we simply call createComponent method and pass in a component factory*.  I don't know about you, but I find nothing simple about this process.  The domain name for the blog is: Angular-in-depth.  That gives you a hint that it is in fact *not* simple.  I hate it when writers trying and fool you into to thinking that something is each (maybe because it is for them that that point in their career) by using the word *simply*.  What's the bias for that?  The curse of knowledge?

Rant over, the [example here](https://stackblitz.com/github/maximusk/dom-manipulation-workshop/tree/s4?file=src%2Fapp%2Fapp.component.ts) looks like exactly what we want to be doing.

Can we cut up the description markup and put the parts of it we want to interact with?  Then the detach method preserves the detached DOM parts to be re-used in the future, also exactly what we need.

So after the description content returns from the service, we pass it into a sub component.  Inside that component, we can further disect the content and do the same thing recursively for the different types of messages in the entire exclamation DOM structure.

This all hinges on breaking up the description markup before it is passed into any child component.  This thing with that is, if we are doing all the work to cut the DOM up, we can just add the parts to separate elements and use ngIf to turn them on or off.

For now, we will just remove the preambles completely.  This expand/collapse preambles feature will take more work and are not part of our MVP release.  What we want is the description for now, and we have that by removing the inner HTML content manually.

After a bit of testing, a few more preambles are still there.  Decided to raise them as issue on GitHub to keep track of updates and other preamble problems since testing is usually done away from the editor.

Trait acription bias
```
<div class="mw-parser-output">
    <table class="vertical-navbox nowraplinks hlist" style="float:right;clear:right;width:22.0em;margin:0 0 1.0em 1.0em;background:#f9f9f9;border:1px solid #aaa;padding:0.2em;border-spacing:0.4em 0;text-align:center;line-height:1.4em;font-size:88%">
        <tbody>
            <tr>
                <td style="padding-top:0.4em;line-height:1.2em">Part of a series on</td>
            </tr>
            <tr>
                <th class="navbox-title" style="padding:0.2em 0.4em 0.2em;padding-top:0;font-size:145%;line-height:1.2em"><a href="https://en.wikipedia.org/wiki/Psychology" title="Psychology">Psychology</a></th>
            </tr>
            <tr>
                <td style="padding:0.2em 0 0.4em;padding-bottom:0;"><img alt="" src="//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/100px-Psi2.svg.png" width="100" height="100" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/150px-Psi2.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/200px-Psi2.svg.png 2x" data-file-width="100" data-file-height="100" /></td>
            </tr>
            <tr>
                <td style="padding:0.3em 0.4em 0.3em;font-weight:bold;border-top: 1px solid #aaa; border-bottom: 1px solid #aaa;padding-bottom:0.35em;">
                    <ul>
                        <li><a href="https://en.wikipedia.org/wiki/Outline_of_psychology" title="Outline of psychology">Outline</a></li>
                        <li><a href="https://en.wikipedia.org/wiki/History_of_psychology" title="History of psychology">History</a></li>
                        <li><a href="https://en.wikipedia.org/wiki/Subfields_of_psychology" title="Subfields of psychology">Subfields</a></li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td style="padding:0 0.1em 0.4em;padding:0.15em 0.5em 0.6em;">
                    <div class="NavFrame collapsed" style="border:none;padding:0">
                        <div class="NavHead" style="font-size:105%;background:transparent;text-align:left;background:#ddddff;text-align:center;"><a href="https://en.wikipedia.org/wiki/Basic_science_(psychology)" title="Basic science (psychology)">Basic types</a></div>
                        <div class="NavContent" style="font-size:105%;padding:0.2em 0 0.4em;text-align:center">
                            <ul>
                                <li><a href="https://en.wikipedia.org/wiki/Abnormal_psychology" title="Abnormal psychology">Abnormal</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Behavioural_genetics" title="Behavioural genetics">Behavioral genetics</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Behavioral_neuroscience" title="Behavioral neuroscience">Biological</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Cognitive_psychology" title="Cognitive psychology">Cognitive</a>/<a href="https://en.wikipedia.org/wiki/Cognitivism_(psychology)" title="Cognitivism (psychology)">Cognitivism</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Comparative_psychology" title="Comparative psychology">Comparative</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Cross-cultural_psychology" title="Cross-cultural psychology">Cross-cultural</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Cultural_psychology" title="Cultural psychology">Cultural</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Differential_psychology" title="Differential psychology">Differential</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Developmental_psychology" title="Developmental psychology">Developmental</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Evolutionary_psychology" title="Evolutionary psychology">Evolutionary</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Experimental_psychology" title="Experimental psychology">Experimental</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Mathematical_psychology" title="Mathematical psychology">Mathematical</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Neuropsychology" title="Neuropsychology">Neuropsychology</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Personality_psychology" title="Personality psychology">Personality</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Positive_psychology" title="Positive psychology">Positive</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Quantitative_psychology" title="Quantitative psychology">Quantitative</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Social_psychology" title="Social psychology">Social</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding:0 0.1em 0.4em;padding:0.15em 0.5em 0.6em;">
                    <div class="NavFrame collapsed" style="border:none;padding:0">
                        <div class="NavHead" style="font-size:105%;background:transparent;text-align:left;background:#ddddff;text-align:center;"><a href="https://en.wikipedia.org/wiki/Applied_psychology" title="Applied psychology">Applied psychology</a></div>
                        <div class="NavContent" style="font-size:105%;padding:0.2em 0 0.4em;text-align:center">
                            <ul>
                                <li><a href="https://en.wikipedia.org/wiki/Applied_behavior_analysis" title="Applied behavior analysis">Applied behavior analysis</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Clinical_psychology" title="Clinical psychology">Clinical</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Community_psychology" title="Community psychology">Community</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Consumer_behaviour" title="Consumer behaviour">Consumer</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Counseling_psychology" title="Counseling psychology">Counseling</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Critical_psychology" title="Critical psychology">Critical</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Educational_psychology" title="Educational psychology">Educational</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Environmental_psychology" title="Environmental psychology">Environmental</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Human_factors_and_ergonomics" title="Human factors and ergonomics">Ergonomics</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Forensic_psychology" title="Forensic psychology">Forensic</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Health_psychology" title="Health psychology">Health</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Humanistic_psychology" title="Humanistic psychology">Humanistic</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Industrial_and_organizational_psychology" title="Industrial and organizational psychology">Industrial and organizational</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Legal_psychology" title="Legal psychology">Legal</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Medical_psychology" title="Medical psychology">Medical</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Military_psychology" title="Military psychology">Military</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Music_psychology" title="Music psychology">Music</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Occupational_health_psychology" title="Occupational health psychology">Occupational health</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Political_psychology" title="Political psychology">Political</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Psychology_of_religion" title="Psychology of religion">Religion</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/School_psychology" title="School psychology">School</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Sport_psychology" title="Sport psychology">Sport</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Traffic_psychology" title="Traffic psychology">Traffic</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding:0 0.1em 0.4em;padding:0.15em 0.5em 0.6em;">
                    <div class="NavFrame collapsed" style="border:none;padding:0">
                        <div class="NavHead" style="font-size:105%;background:transparent;text-align:left;background:#ddddff;text-align:center;"><a href="https://en.wikipedia.org/wiki/Category:Psychology_lists" title="Category:Psychology lists">Lists</a></div>
                        <div class="NavContent" style="font-size:105%;padding:0.2em 0 0.4em;text-align:center">
                            <ul>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychology_disciplines" title="List of psychology disciplines">Disciplines</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychology_organizations" title="List of psychology organizations">Organizations</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychologists" title="List of psychologists">Psychologists</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychotherapies" title="List of psychotherapies">Psychotherapies</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_important_publications_in_psychology" title="List of important publications in psychology">Publications</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychological_research_methods" title="List of psychological research methods">Research methods</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/List_of_psychological_schools" title="List of psychological schools">Theories</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Timeline_of_psychology" title="Timeline of psychology">Timeline</a></li>
                                <li><a href="https://en.wikipedia.org/wiki/Index_of_psychology_articles" title="Index of psychology articles">Topics</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding:0.3em 0.4em 0.3em;font-weight:bold;border-top: 1px solid #aaa; border-bottom: 1px solid #aaa;border-top:1px solid #aaa;border-bottom:1px solid #aaa;">
                    <ul>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/File:Psi2.svg" class="image"><img alt="Psi2.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/16px-Psi2.svg.png" width="16" height="16" class="noviewer" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/24px-Psi2.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Psi2.svg/32px-Psi2.svg.png 2x" data-file-width="100" data-file-height="100" /></a> <a href="https://en.wikipedia.org/wiki/Portal:Psychology" title="Portal:Psychology">Psychology&#32;portal</a></li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td style="text-align:right;font-size:115%;padding-top: 0.6em;">
                    <div class="plainlinks hlist navbar mini">
                        <ul>
                            <li class="nv-view"><a href="https://en.wikipedia.org/wiki/Template:Psychology_sidebar" title="Template:Psychology sidebar"><abbr title="View this template">v</abbr></a></li>
                            <li class="nv-talk"><a href="https://en.wikipedia.org/wiki/Template_talk:Psychology_sidebar" title="Template talk:Psychology sidebar"><abbr title="Discuss this template">t</abbr></a></li>
                            <li class="nv-edit"><a class="external text" href="//en.wikipedia.org/w/index.php?title=Template:Psychology_sidebar&amp;action=edit"><abbr title="Edit this template">e</abbr></a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <p><b>Trait ascription bias</b> is the tendency for people to view <i>themselves</i> as relatively variable in terms of <a href="https://en.wikipedia.org/wiki/Personality" title="Personality">personality</a>, behavior and mood while viewing others as much more predictable in their personal traits across different situations.<sup id="cite_ref-kammer_1-0" class="reference"><a href="#cite_note-kammer-1">&#91;1&#93;</a></sup> More specifically, it is a tendency to describe one's own behaviour in terms of situational factors while preferring to describe another's behaviour by ascribing fixed dispositions to their personality. This may occur because peoples' own internal states are more readily observable and <a href="https://en.wikipedia.org/wiki/Availability_heuristic" title="Availability heuristic">available</a> to them than those of others.
    </p>
    <p>
        This <a href="https://en.wikipedia.org/wiki/Attributional_bias" class="mw-redirect" title="Attributional bias">attributional bias</a> intuitively plays a role in the formation and maintenance of <a href="https://en.wikipedia.org/wiki/Stereotype" title="Stereotype">stereotypes</a> and <a href="https://en.wikipedia.org/wiki/Prejudice" title="Prejudice">prejudice</a>, combined with the <a href="https://en.wikipedia.org/wiki/Negativity_effect" class="mw-redirect" title="Negativity effect">negativity effect</a>. However, trait ascription and trait-based models of personality remain contentious in modern <a href="https://en.wikipedia.org/wiki/Psychology" title="Psychology">psychology</a> and <a href="https://en.wikipedia.org/wiki/Social_science" title="Social science">social science</a> research. Trait ascription bias refers to the situational and dispositional evaluation and description of personality traits on a personal level. A similar bias on the group level is called the <a href="https://en.wikipedia.org/wiki/Outgroup_homogeneity_bias" class="mw-redirect" title="Outgroup homogeneity bias">outgroup homogeneity bias</a>.</p>
    <div class="mw-references-wrap">
        <ol class="references">
            <li id="cite_note-kammer-1"><span class="mw-cite-backlink"><b><a href="#cite_ref-kammer_1-0">^</a></b></span> <span class="reference-text"><cite class="citation journal">Kammer, D. (1982). "Differences in trait ascriptions to self and friend: Unconfounding intensity from variability". <i>Psychological Reports</i>. <b>51</b> (1): 99–102. <a href="https://en.wikipedia.org/wiki/Digital_object_identifier" title="Digital object identifier">doi</a>:<a rel="nofollow" class="external text" href="//doi.org/10.2466%2Fpr0.1982.51.1.99">10.2466/pr0.1982.51.1.99</a>.</cite><span title="ctx_ver=Z39.88-2004&amp;rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&amp;rft.genre=article&amp;rft.jtitle=Psychological+Reports&amp;rft.atitle=Differences+in+trait+ascriptions+to+self+and+friend%3A+Unconfounding+intensity+from+variability&amp;rft.volume=51&amp;rft.issue=1&amp;rft.pages=99-102&amp;rft.date=1982&amp;rft_id=info%3Adoi%2F10.2466%2Fpr0.1982.51.1.99&amp;rft.aulast=Kammer&amp;rft.aufirst=D.&amp;rfr_id=info%3Asid%2Fen.wikipedia.org%3ATrait+ascription+bias" class="Z3988"></span>
                </span>
            </li>
        </ol>
    </div>
</div>
```

It seems like we should be getting rid of the entire table.  We can choose vertical-navbox, nowraplinks, or hlist.  nowraplinks works fine for now.


## Adding links

We would like to add more content, especially mitigation and debiasing info for each bias.  This is the kind of thing that really needs to be part of some kind of list customization feature.

The easiest link to put is Wikipedia.  Just replace spaces with underscores and add the base URL like this:
```
https://en.wikipedia.org/wiki/Acquiescence_bias
```

There is another bias site with great content we will call Your Bias.  Fir this site, we add dashes to the item name and add the base URL:
```
https://www.yourbias.is/the-sunk-cost-fallacy
```

The content for this site is great, and there is mitigating ideas for each one.  However, there are only about 20 or so items on the site which have to be scrolled through one at a time.  So it's a long shot for most of the items on our list.  

We could use a service that checks if the page is there or not and change the UI in some way to indicate yes or no.  But this is not a really dependable service, and the names might be different enough, that most of them wont work.  We will just create dumb links for now to see what happens.

For example, there is a Wikipedia page for *sunk cost*.  This has a section with this link:
```
https://en.wikipedia.org/wiki/Sunk_cost#Loss_aversion_and_the_sunk_cost_fallacy
```

The section has this note: *Further information: [Escalation of commitment](https://en.wikipedia.org/wiki/Escalation_of_commitment)*

This is billed as *a human behavior pattern*, not a bias at all.  So we will just have to let the user find this kind of content themselves.  So the Wikipedia links will help a bit for that.

The Your Bias link is:
```
https://www.yourbias.is/the-sunk-cost-fallacy
```

We can easily create a link, but ```https://www.yourbias.is/Framing-effect``` would need a *the* in from of the name and be lower cased.

To see what all the problems are, here are all 24 links:
```
https://www.yourbias.is/the-framing-effect
https://www.yourbias.is/fundamental-attribution-error
https://www.yourbias.is/the-halo-effect
https://www.yourbias.is/optimism-bias
https://www.yourbias.is/pessimism-bias
https://www.yourbias.is/just-world-hypothesis
https://www.yourbias.is/in-group-bias
https://www.yourbias.is/the-placebo-effect
https://www.yourbias.is/the-bystander-effect
https://www.yourbias.is/reactance
https://www.yourbias.is/the-spotlight-effect
https://www.yourbias.is/anchoring
https://www.yourbias.is/the-sunk-cost-fallacy
https://www.yourbias.is/the-availability-heuristic
https://www.yourbias.is/the-curse-of-knowledge
https://www.yourbias.is/confirmation-bias
https://www.yourbias.is/the-dunning-kruger-effect
https://www.yourbias.is/belief-bias
https://www.yourbias.is/self-serving-bias
https://www.yourbias.is/the-backfire-effect
https://www.yourbias.is/the-barnum-effect
https://www.yourbias.is/groupthink
https://www.yourbias.is/negativity-bias
https://www.yourbias.is/declinism
```

May as well just memorize the list and be done with it.  Or, we could make an optional field to let the user add links?  Then we will have to have the *user created content* discussion, which ends in some kind of overhead each app.  We could store it locally, but all that will be lost in an update, or moving to a new device.  So we could have a manual backup service, or a paywall or something which requires more work and expenses for all.

Still, with our short descriptions which we want the user to create or alter, we will have to come up with a good solution.

For now we can move on to a more useful job, like automatic re-directs.

Take the *framing effect* again.  The server returns content which is a re-direct to *Framing (social sciences).

This needs to happen on the server, so it's back to Conchifolia for that.


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

We can use the rule of three: if you have to cut and paste functions, on third it should be refactored out into shared code.  So when faced with implementing all this again the next time, we can look at what will work as a tool function.  Remember earlier on in this project, adding DOM parsing functionality in the curator lib ruined both Ionic and React Native app builds and took up loads of time until it was realized that some JavaScript from NodeJS land will not work in the browser.  So basically we need a backend lib, and a front end lib.  We already have one;
[Socius](https://github.com/timofeysie/socius): A shared component library which can be used in Angular 2 projects.

We can also include our constants and data models there.

OK.  All that about adding a new project to the five projects already at play with this (look mom, it's a microservice!), is taking us away from getting this feature finished.

Removing the Q-code items is not so simple.  They need to be removed from the list, and right now it's not working as it does in Conchifolia.

The detail links that are in Korean cause a 500 error:
```
GET https://radiant-springs-38893.herokuapp.com/api/detail/%25EC%25B9%25A8%25EB%25AC%25B5%25EC%259D%2598_%25EB%2582%2598%25EC%2584%25A0/en/false 500 (Internal Server Error)
```

However, tyring to get the logs from the server is failing:
```
$ heroku logs
2018-09-10T23:12:02+00:00 heroku[logplex]: L15: Error displaying log lines. Please try again.
```

If it's not one thing, it's another.  A Han Solo movie with the Mahavishnu Orchestra soundtrack.  Yeah baby!  Could test it locally mofo.  Start up the server with node index.js, then go here: https://localhost:5000/api/detail/%EC%B9%A8%EB%AC%B5%EC%9D%98_%EB%82%98%EC%84%A0/en/false

Result:
```
This site can’t provide a secure connection
localhost sent an invalid response.
ERR_SSL_PROTOCOL_ERROR
```

Doh!  Http for localhost!  New response:
```
No data in response:[object Object]
```

But now we have our server log:
```
$ node index.js
Listening on 5000
id 침묵의_나선
leaveCaseAlone false
wikiRes.headers { date: 'Mon, 10 Sep 2018 23:41:51 GMT',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '345',
  connection: 'close',
  server: 'mw1276.eqiad.wmnet',
  'x-powered-by': 'HHVM/3.18.6-dev',
  'mediawiki-api-error': 'missingtitle',
  p3p: 'CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."',
  'cache-control': 'private, must-revalidate, max-age=0',
  vary: 'Accept-Encoding',
  'content-disposition': 'inline; filename=api-result.json',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'backend-timing': 'D=31371 t=1536622911182231',
  'x-varnish': '308225602, 687847215, 308634397, 53115105',
  via: '1.1 varnish (Varnish/5.1), 1.1 varnish (Varnish/5.1), 1.1 varnish (Varnish/5.1), 1.1 varnish (Varnish/5.1)',
  'accept-ranges': 'bytes',
  age: '0',
  'x-cache': 'cp1075 pass, cp2013 pass, cp5009 pass, cp5011 pass',
  'x-cache-status': 'pass',
  'strict-transport-security': 'max-age=106384710; includeSubDomains; preload',
  'set-cookie':
   [ 'WMF-Last-Access=10-Sep-2018;Path=/;HttpOnly;secure;Expires=Fri, 12 Oct 2018 12:00:00 GMT',
     'WMF-Last-Access-Global=10-Sep-2018;Path=/;Domain=.wikipedia.org;HttpOnly;secure;Expires=Fri, 12 Oct 2018 12:00:00 GMT',
     'GeoIP=AU:NSW:Lane_Cove:-33.82:151.17:v4; Path=/; secure; Domain=.wikipedia.org' ],
  'x-analytics': 'https=1;nocookies=1',
  'x-client-ip': '49.195.129.24' }
Url: https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=%EC%B9%A8%EB%AC%B5%EC%9D%98_%EB%82%98%EC%84%A0
```

Me: Computer, what is 'mediawiki-api-error': 'missingtitle'?
Computer: The page you requested doesn't exist.
Me: So why doesn't the message say 'missingpage'?
Computer: Because a human wrote it.

OK.  Very funny.  Now, what *should* the url be?
```
https://ko.wikipedia.org/wiki/%EC%B9%A8%EB%AC%B5%EC%9D%98_%EB%82%98%EC%84%A0
```

Me: Oh, and I'm the human, so I didn't see the wrong language was being passed for a Korean title.  The computer's got a point.
Zoo Keeper: How's the day going fellas?
Computer: Very well, thank you.
Me: Pretty darn good now we know how to fix these links.  Not so good for getting rid of the Q-codes tho...

The problem was that we still had en hardwired into the service.  Replace that with the option, and move the name of the options key into the constants class to do things a little more properly, and our call works:
```
https://radiant-springs-38893.herokuapp.com/api/detail/%EC%B9%A8%EB%AC%B5%EC%9D%98_%EB%82%98%EC%84%A0/ko/false

Result:
{"description":"<div class=\"mw-parser-output\"><p><b>침묵의 나선 이론</b> (沈默- 螺線理論, <span style=\"font-size: smaller;\"><a href=\"/wiki/%EB%8F%85%EC%9D%BC%EC%96%B4\" title=\"독일어\">독일어</a>&#58; </span><span lang=\"de\">Die Theorie der Schweigespirale</span>, <span style=\"font-size: smaller;\"><a href=\"/wiki/%EC%98%81%EC%96%B4\" title=\"영어\">영어</a>&#58; </span><span lang=\"en\">Spiral of Silence Theory</span>)은 <a href=\"/wiki/%EC%A0%95%EC%B9%98%ED%95%99\" title=\"정치학\">정치학</a>과 <a href=\"/wiki/%EB%8C%80%EC%A4%91%EB%A7%A4%EC%B2%B4\" class=\"mw-redirect\" title=\"대중매체\">대중매체</a>에 관한 이론이다. 1966년 독일의 사회과학자 <a href=\"/w/index.php?title=%EC%97%98%EB%A6%AC%EC%9E%90%EB%B2%A0%EC%8A%A4_%EB%85%B8%EC%97%98%EB%A0%88-%EB%85%B8%EC%9D%B4%EB%A7%8C&amp;action=edit&amp;redlink=1\" class=\"new\" title=\"엘리자베스 노엘레-노이만 (없는 문서)\">엘리자베스 노엘레-노이만</a>(Elisabeth Noelle-Neumann)이 발표한 〈Öffentliche Meinung und Soziale Kontrolle<span style=\"color:gray;\"><small>→여론과 사회 통제</small></span>〉에서 제시되었다.\n</p><p>\n하나의 특정한 의견이 다수의 사람들에게 인정되고 있다면, 반대되는 의견을 가지고 있는 ... </div>"}
```

If you an see one span has the title in English: *Spiral of Silence Theory*.  This will be helpful in learner mode where there is a native language setting and a language to be learned setting which will turn the list into text/translation list where the translation takes the place of our short description.

Regarding the Q-code items.  They are fixed now.  We were forgetting to use list.slice().reverse().forEach instead of a normal forEach.

The only thing remaining with the Korean list then is the details page.

Here is a sample link created for a detail page:
```
https://radiant-springs-38893.herokuapp.com/api/detail/%EC%A3%BC%EC%88%A0%EC%A0%81_%EC%82%AC%EA%B3%A0/ko/false
```

In the browser, this returns a seeming usable response:
```
{
    "description":"<div class=\"mw-parser-output\"><p><b>주술적 사고</b> (呪術的思考, Magical thinking)는 <a href=\"/wiki/%EC%A3%BC%EC%88%A0\" title=\"주술\">주술</a>이 효과가 있다는 전제로 사물을 생각하거나 문제가 있을 때에 자기의 건전하고 합리적인 <a href=\"/wiki/%EB%85%B8%EB%A0%A5\" title=\"노력\">노력</a>이 부족한 채로, 주술에 유사한 행동에만 따라 해결해 버리려는 사고를 가리킨다. <b>마술적 사고</b>라고도 불린다. <a href=\"/wiki/%EC%A7%84%ED%99%94_%EC%8B%AC%EB%A6%AC%ED%95%99\" title=\"진화 심리학\">진화 심리학</a>적으로 생각하면, 불결한 냄새를 혐오해, 그 일반화로서 <a href=\"/w/index.php?title=%EB%8D%94%EB%9F%AC%EC%9B%80&amp;action=edit&amp;redlink=1\" class=\"new\" title=\"더러움 (없는 문서)\">더러움</a>을 꺼리는 것은 병을 예방하고 유전자를 늘리는 것에 연결되어, 어느 정도 합리성이 있었다고 말할 수 있다.\n</p>\n<!-- \nNewPP limit report\nParsed by mw1228\nCached time: 20180912080036\nCache expiry: 1900800\nDynamic content: false\nCPU time usage: 0.004 seconds\nReal time usage: 0.005 seconds\nPreprocessor visited node count: 1/1000000\nPreprocessor generated node count: 0/1500000\nPost‐expand include size: 0/2097152 bytes\nTemplate argument size: 0/2097152 bytes\nHighest expansion depth: 1/40\nExpensive parser function count: 0/500\nUnstrip recursion depth: 0/20\nUnstrip post‐expand size: 0/5000000 bytes\nNumber of Wikibase entities loaded: 0/400\n-->\n<!--\nTransclusion expansion time report (%,ms,calls,template)\n100.00%    0.000      1 -total\n-->\n</div>"}
```

In the app it's a 500 (Internal Server Error).

fails:
```
https://radiant-springs-38893.herokuapp.com/api/detail/%25ED%2598%25B8%25EC%2586%2590_%25ED%259A%25A8%25EA%25B3%25BC/en/false

this one also fails.
http://localhost:5000/api/detail/%25ED%2598%25B8%25EC%2586%2590_%25ED%259A%25A8%25EA%25B3%25BC/en/false

The server uses:
Url: https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=%25ED%2598%25B8%25EC%2586%2590_%25ED%259A%25A8%25EA%25B3%25BC
```

This returns the message:
```
{"error":{"code":"invalidtitle","info":"Bad title \"%ED%98%B8%EC%86%90_%ED%9A%A8%EA%B3%BC\".","*":"See https://en.wikipedia.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/mailman/listinfo/mediawiki-api-announce&gt; for notice of API deprecations and breaking changes."},"servedby":"mw2206"}
```

What needs to happen is the server needs to deal with this kind of error.  But yes, first we need to know what the root problem is.

The front end should also look for this error and print out the info:
```
{"error":{"code":"invalidtitle","info":"Bad title \"
```

Also, the detail page is detecting a language change.

For some reason, we are getting a CORS warning now, or was it there all along and no one noticed it?
```
Cross-origin response https://radiant-springs-38893.herokuapp.com/api/detail/%ED%98%B8%EC%86%90_%ED%9A%A8%EA%B3%BC/undefined/false with MIME type text/html. See https://www.chromestatus.com/feature/5629709824032768 for more details.
```

This works with the web app.  What's the difference there and here?  Maybe look at those notes again?  Nothing cooking there.  All that is said about this was *after encoding the URL for the detail page, the 28 links are working as well as the English version.*
 Unless there was some secret that came before that?

 In this project, we do:
 ```
 return this.httpClient.get(encodeURI(backendDetailUrl))
 ```

 In Conchifolia, we do this:
 ```
return this.httpClient.get<DetailModel>(encodeURI(this.backendDetailUrl+'/'+detailId+'/'+lang+'/'+leaveCaseAlone)).pipe(data => data);
```

Then, suddenly the detail content for the first item shows up.  But after that it appears to be a zone.js:2969 Cross-Origin Read Blocking (CORB) blocked cross-origin response issue.

Testing some more links, using this url:
https://radiant-springs-38893.herokuapp.com/api/detail/%EA%B3%A8%EB%A0%98_%ED%9A%A8%EA%B3%BC/ko/false

We get an official Heroku application error page:
```
Application error
An error occurred in the application and your page could not be served. If you are the application owner, check your logs for details. You can do this from the Heroku CLI with the command
heroku logs --tail
```

Only one problem with that:
$ heroku logs --tail
 ▸    Logs eventsource failed with: 503 Service Unavailable

Let's do another deployment.  Then we get the first item detail again!  But the second item:
```
zone.js:2969 GET https://radiant-springs-38893.herokuapp.com/api/detail/%ED%98%84%EC%83%81%EC%9C%A0%EC%A7%80%ED%8E%B8%ED%96%A5/undefined/false 503 (Service Unavailable)
```
Undefined, our old friend!  We had both an ngOnInit and a ionViewWillEnter function, the first one to get and set the preferences, the second to get the details via http.  It seems like these don't always fire in order, so getting rid of the ionic one and calling that after the options have been loaded seems to fix that issue.

The only thing we need now (desperately) is a spinner.  Luckily for us, Ionic already has a spinner so we don't have to create our own svg components like in the Conchifolia project.  Yes, we could have used Material Design, Bootstrap or any other design framework, but we learn more doing things by hand.  But, using Material Design or Bootstrap, and then having that on the resume and being able to talk about them well during interviews is also something to think about.  But that's kind of out of scope for this project.  Another day.  First lunch, and then the spinner.

Love this little graphic:
```
<img alt="Psi template.gif" src="//upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Psi_template.gif/45px-Psi_template.gif" width="45" height="45" srcset="//upload.wikimedia.org/wikipedia/commons/4/4b/Psi_template.gif 1.5x">
```

In Ionic, the spinner is as simpke as this:
```
<ion-spinner></ion-spinner>
```

Us the list and the description page being empty as the trigger, and we have our spinner.


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

After sorting the service for the main WikiData list out a bit, the content is a little different the was expected:
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


## Starting the app and parsing Wikipedia

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
