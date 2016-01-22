/js
/js/app
/js/includes
/js/lib
/js/external?
/css
/images
/views?

---
incremental build?
https://github.com/gulpjs/gulp/blob/master/docs/recipes/README.md
https://github.com/gulpjs/gulp/blob/master/docs/API.md
live reload

search for location.path() - replace with url(/)

REQUIRE JS? when "requirejs", do we need to bundle all js? or only "main.js"
http://www.dotnetcurry.com/angularjs/1207/using-angularjs-bower-requirejs-visual-studio

http://vswebessentials.com/

---
remove debug+min aspx from route.js
test web.config ""

be careful about what's changed
also webapi sslenabled came back?
how to make this thingy faster?

leave cdn & fallback cases to requirejs

http://www.hanselman.com/blog/CDNsFailButYourScriptsDontHaveToFallbackFromCDNToLocalJQuery.aspx

---
SMARTER ASP.NET MAPPED DOMAIN NAME MOVE TO ANOTHER HOSTING OPTION ?!
click here to move it to another Hosting Account.

smarter asp.net visitor stats + default doc + custom errors + url redirect options?

---
CONTINUE WITH GULP!
minify js files
how to handle angular? sort order is important or not? attemp #1 failed?
but then how to say use 'real' in dev + use 'min' in production?
same goes for .css
and then html?

BOWER_COMPONENTS FOLDER CAN BE RENAMED TO LIB OR SOMETHING WITH A SPECIAL BOWER FILE?
.bowerrc { "directory": "wwwroot/lib" }

grunt or gulp? auto minify + bundling
requirejs - basic setup looks good and can be done but require some understading let's say, folder structure for instance
aspnet 5 - can it be published to live?

maincontroller -> defaultController? -> home + homecontroller?
README - mention node.js? + Paste these two files to this folder - into this..
ngclient - disqus.js from bower?
angularjs 404 case?
do we need <web> block in webapi config file? ngclient has only one section, it can be just like that?
test email account! + social logins test callbacks? + test database? + test facebook (google should be okay) + local & test microsoft?
microsoft login doesn't work? - doesnt work on local & test, since its configured for live domain?
delete resource pool error?
remember me - forgot pass
save your changes timeout?
remove http: parts?
redirect www.forcrowd.org to wealth.forcrowd.org?
gitignore googleanalytics.js so anyone can enter their own? also don't run it on local + test?
ngclient - use their own version for ?v= pattern for external libs?
jasmine-core@2.3.4 was installed earlier but uninstalling it didn't change anything on chutzpah..? was it necessary for karma?
karma.conf.js?
RELEASE NOTES - CHANGELOG?

errors at the bottom of todohot.md

---
https://mva.microsoft.com/en-US/training-courses/angular-applications-with-typescript-14330?l=C9DsEeLgB_7404668937
http://www.codelord.net/2016/01/07/adding-the-first-angular-2-service-to-your-angular-1-app/
https://channel9.msdn.com/Events/Seth-on-the-Road/DevIntersection-2015/Making-Sense-of-the-JavaScript-Client-Side-with-Ward-Bell

---
. reset password + remember me?

. Sector index -> priority index!

---
content for editor? new content or new resourcepool - content in a content? or page as a new entity?
url structure:
/[username]/articles/[article name] - prevents duplicate article name - readable, but too long?
/article/[articleId] - universal, short but unreadable?

facebook - /[username]/videos/[videoid]
twitter - /[username]/status/[tweetid]
linkedin - /pulse/[articlename+username]
youtube - /?v=[videoid]

current?
1. resourcePool /[id] -> resourcePool id
2. content /content(or /c)/[id] -> content id
3. account /account/xxx
4. generateds /generated/[entity]/[action]/[id] -> ...
how about users/ organizations/ ?

don't forget: preserved keywords (account, resourcepool and future ones?), also "inappropriate content"

---
Alpha team review!

tests, tests, tests

Find a designer! Ozgur's Ali

save anon user to db?

---
Identity / Account:

. Invalidating tokens
http://stackoverflow.com/questions/22755700/revoke-token-generated-by-usertokenprovider-in-asp-net-identity-2-0/22767286#22767286

. before sending any email to user, check whether it's confirmed?

. confirmEmail etc. pages should be behind authorization? handle it in a generic way? the user shouldn't access these pages without logging in?

---
angular 1.5 component?

elementField.js - DataType prop uses 'broadcast' and dataContext handles this event to create the actual event
seems nice, and it could be used in other cases.
however it doesn't return the newly created entity to the caller, which probably is not suitable for most cases?
how about using $injector.get('dataContext') in these cases, instead of broadcast?

use createEntity in addX cases!

THIS REQUIRES USERID TO BE USED AS WELL?
D:\Development\Projects\GitHub\forCrowd\WealthEconomy\Web\Controllers\OData\Generated\UserElementCellController.cs
if (MainUnitOfWork.Exists(userElementCell.ElementCellId))

// TODO Most of these functions are related with userService.js - updateX functions
// Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
function updateCache() {

move saveElementField fixes under elementfield.js datatype prop!

UseFixedValue doesn't work at all! fix it!
also check resourcePool.UseFixedResourcePoolRate case!

objects vs entities

add newly created cmrps to fetchedList in cmrpfactory - and don't use newlyCreated flag

resourcepool - resourcepoolratetotal, count, ratingcount never null
elementfiel - indexratingtotal, count never null
elementcell - numericvaluecount never null - ONLY numericvaluetotal CAN BE NULL? which can be changed to NOT NULL!

rules
directincome type must use fixed value
multiplier cannot use fixed value

try to use enums + js entities in add functions + tests

move enums to their related class?

copy from an existing cmrp / template?
how to handle user level data - only copy computed ones?

currently saveChanges in datacontext (and in all factory.js) files, saves all changes, not one particular entity?!

check return conflict() blocks, there's something wrong with them!

. elementfield - indexcalculationtype + indexsortype should have null value?

. field restrictions, one multiplier, one incomefield - server side validation?

. info tooltips hover, won't work on mobiles?

. asp.net 5?

. Better ratings UI https://angular-ui.github.io/bootstrap/#/getting_started
. angular material - https://material.angularjs.org/latest/

. update google analytics on route changes

CONTENT
. antidote of capitalism?
. all in one?
. create new content based on TED talks?

. google index? it's too slow at the moment?

Page Insights
https://developers.google.com/speed/pagespeed/insights/?hl=en&utm_source=wmx&utm_campaign=wmx_otherlinks&url=https%3A%2F%2Fwealth.forcrowd.org%2F&tab=mobile

Mobile 53/100
Desktop 65/100

compression for dynamic content
https://wealth.forcrowd.org/odata/ResourcePool?$filter=Id%20eq%209&amp;$expand=ElementSet%2FElementFieldSet%2CElementSet%2FElementItemSet%2FElementCellSet

async or defer js? which ones?
optimize css? with which tool?
bundling?

---
RowVersion property of the entity cannot be null&#xD;&#xA;   at forCrowd.WealthEconomy.WebApi.Controllers.OData.BaseUserElementCellController.&lt;Patch&gt;d__9.MoveNext() in D:\Development\Projects\GitHub\forCrowd\WealthEconomy\WebApi\Controllers\OData\Generated\UserElementCellController.cs:line 133

---
System.Web.HttpUnhandledException (0x80004005): Exception of type 'System.Web.HttpUnhandledException' was thrown. ---> forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: Cannot read property 'Id' of undefined
Caused by: N/A
Url: /account/login
Stack: TypeError: Cannot read property 'Id' of undefined
    at mainController.isAuthenticated (https://wealth.forcrowd.org/app/controllers/content/mainController.js?v=0.41.3:88:61)
    at Object.fn [as get] (eval at <anonymous> (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:213:110), <anonymous>:4:242)
    at r.$digest (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:131:14)
    at https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:400
    at e (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:305)
    at https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181

---
System.Web.HttpUnhandledException (0x80004005): Exception of type 'System.Web.HttpUnhandledException' was thrown. ---> forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: Cannot read property 'isAuthenticated' of undefined
Caused by: N/A
Url: /account/login
Stack: TypeError: Cannot read property 'isAuthenticated' of undefined
    at https://wealth.forcrowd.org/app/route.js?v=0.41.3:110:36
    at https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
    at r.$eval (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:313)
    at r.$digest (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:412)
    at https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:400
    at e (https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:305)
    at https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181

---	
forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: vm.currentUser is undefined Caused by: N/A Url: /account/externalLogin
Stack: isAuthenticated@https://wealth.forcrowd.org/app/controllers/content/mainController.js?v=0.41.3:88:13 anonymous/fn@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42 line 213 > Function:2:239 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:131:12 lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76 g@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:87:442 T@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:50 Uf/</w.onload@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:93:78 EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429 r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156 m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404 lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398 e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303 setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156 lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369 mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95 f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498 td/<.$$resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:97 td/<.resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:120:359 e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416 h.executeQuery/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3569 lw/<@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11668 r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18868 EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620 authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24 lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490 r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766 r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814 h.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3461 K@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:3782 Wt</tt.executeQuery/n<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:13320 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404 lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398 e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303 Nf/k.defer/c<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181 setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156 lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369 mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95 f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498 td/<.$$resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:97 td/<.resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:120:359 e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416 h.fetchMetadata/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:4176 lw/<@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11668 r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18868 EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620 authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24 lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490 r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766 r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814 h.fetchMetadata@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3777

Generated: Sat, 16 Jan 2016 12:19:06 GMT

System.Web.HttpUnhandledException (0x80004005): Exception of type 'System.Web.HttpUnhandledException' was thrown. ---> forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: vm.currentUser is undefined
Caused by: N/A
Url: /account/externalLogin
Stack: isAuthenticated@https://wealth.forcrowd.org/app/controllers/content/mainController.js?v=0.41.3:88:13
anonymous/fn@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42 line 213 > Function:2:239
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:131:12
lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76
g@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:87:442
T@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:50
Uf/</w.onload@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:93:78
EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429
r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156
m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404
lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398
e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303
setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156
lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369
mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95
f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498
td/<.$$resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:97
td/<.resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:120:359
e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416
h.executeQuery/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3569
lw/<@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11668
r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18868
EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620
authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24
lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490
r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766
r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814
h.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3461
K@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:3782
Wt</tt.executeQuery/n<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:13320
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404
lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398
e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303
Nf/k.defer/c<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181
setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156
lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369
mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95
f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498
td/<.$$resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:97
td/<.resolve@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:120:359
e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416
h.fetchMetadata/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:4176
lw/<@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11668
r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18868
EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620
authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24
lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490
r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766
r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814
h.fetchMetadata@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3777

		

Server Variables
Name	Value
ALL_HTTP	HTTP_CONNECTION:keep-alive HTTP_CONTENT_LENGTH:5732 HTTP_CONTENT_TYPE:application/json;charset=utf-8 HTTP_ACCEPT:application/json, text/plain, */* HTTP_ACCEPT_ENCODING:gzip, deflate, br HTTP_ACCEPT_LANGUAGE:en-US,en;q=0.5 HTTP_HOST:api.wealth.forcrowd.org HTTP_REFERER:https://wealth.forcrowd.org/account/externalLogin?tempToken=24372b15-9eef-4a68-bc86-96fbc6b2b1a5 HTTP_USER_AGENT:Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0 HTTP_ORIGIN:https://wealth.forcrowd.org
ALL_RAW	Connection: keep-alive Content-Length: 5732 Content-Type: application/json;charset=utf-8 Accept: application/json, text/plain, */* Accept-Encoding: gzip, deflate, br Accept-Language: en-US,en;q=0.5 Host: api.wealth.forcrowd.org Referer: https://wealth.forcrowd.org/account/externalLogin?tempToken=24372b15-9eef-4a68-bc86-96fbc6b2b1a5 User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0 Origin: https://wealth.forcrowd.org
APPL_MD_PATH	/LM/W3SVC/1026774205/ROOT
APPL_PHYSICAL_PATH	h:\root\home\forcrowd-001\www\forcrowd.org\wealth.api\
AUTH_TYPE	 
AUTH_USER	 
AUTH_PASSWORD	*****
LOGON_USER	 
REMOTE_USER	 
CERT_COOKIE	 
CERT_FLAGS	 
CERT_ISSUER	 
CERT_KEYSIZE	256
CERT_SECRETKEYSIZE	2048
CERT_SERIALNUMBER	 
CERT_SERVER_ISSUER	C=BE, O=GlobalSign nv-sa, CN=GlobalSign Domain Validation CA - SHA256 - G2
CERT_SERVER_SUBJECT	OU=Domain Control Validated, CN=wealth.forcrowd.org
CERT_SUBJECT	 
CONTENT_LENGTH	5732
CONTENT_TYPE	application/json;charset=utf-8
GATEWAY_INTERFACE	CGI/1.1
HTTPS	on
HTTPS_KEYSIZE	256
HTTPS_SECRETKEYSIZE	2048
HTTPS_SERVER_ISSUER	C=BE, O=GlobalSign nv-sa, CN=GlobalSign Domain Validation CA - SHA256 - G2
HTTPS_SERVER_SUBJECT	OU=Domain Control Validated, CN=wealth.forcrowd.org
INSTANCE_ID	1026774205
INSTANCE_META_PATH	/LM/W3SVC/1026774205
LOCAL_ADDR	205.144.171.9
PATH_INFO	/api/Exception/Record
PATH_TRANSLATED	h:\root\home\forcrowd-001\www\forcrowd.org\wealth.api\api\Exception\Record
QUERY_STRING	 
REMOTE_ADDR	78.173.37.118
REMOTE_HOST	78.173.37.118
REMOTE_PORT	64953
REQUEST_METHOD	POST
SCRIPT_NAME	/api/Exception/Record
SERVER_NAME	api.wealth.forcrowd.org
SERVER_PORT	443
SERVER_PORT_SECURE	1
SERVER_PROTOCOL	HTTP/1.1
SERVER_SOFTWARE	Microsoft-IIS/8.5
URL	/api/Exception/Record
HTTP_CONNECTION	keep-alive
HTTP_CONTENT_LENGTH	5732
HTTP_CONTENT_TYPE	application/json;charset=utf-8
HTTP_ACCEPT	application/json, text/plain, */*
HTTP_ACCEPT_ENCODING	gzip, deflate, br
HTTP_ACCEPT_LANGUAGE	en-US,en;q=0.5
HTTP_HOST	api.wealth.forcrowd.org
HTTP_REFERER	https://wealth.forcrowd.org/account/externalLogin?tempToken=24372b15-9eef-4a68-bc86-96fbc6b2b1a5
HTTP_USER_AGENT	Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0
HTTP_ORIGIN	https://wealth.forcrowd.org
HTTP_X_REWRITE_URL	/api/Exception/Record

Powered by ELMAH, version 1.2.14706.955. Copyright (c) 2004, Atif Aziz. All rights reserved. Licensed under Apache License, Version 2.0.

---
forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: scope.resourcePool is undefined Caused by: N/A Url: /account/login Stack: getResourcePool/<@https://wealth.forcrowd.org/app/directives/resourcePoolEditor/resourcePoolEditor.js?v=0.41.3:165:1 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404 lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398 e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303 Nf/k.defer/c<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181 setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156 lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369 mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95 f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498 td/<.$$reject@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:292 td/<.reject@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:194 e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416 h.executeQuery/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3649 r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18873 EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620 authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24 lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490 r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766 r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814 h.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3461 K@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:3782 Wt</tt.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:13243 executeQuery@https://wealth.forcrowd.org/app/dataContext.js?v=0.41.3:79:20 getResourcePoolExpanded/<@https://wealth.forcrowd.org/app/factories/resourcePoolFactory.js?v=0.40:408:28 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404 lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76 g@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:87:442 T@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:50 Uf/</w.onload@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:93:78 EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429 r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156 m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404 lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76 EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429 r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156 m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331 f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129 lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309 lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404

Generated: Sat, 16 Jan 2016 12:17:49 GMT

System.Web.HttpUnhandledException (0x80004005): Exception of type 'System.Web.HttpUnhandledException' was thrown. ---> forCrowd.WealthEconomy.WebApi.Controllers.Api.AngularException: scope.resourcePool is undefined
Caused by: N/A
Url: /account/login
Stack: getResourcePool/<@https://wealth.forcrowd.org/app/directives/resourcePoolEditor/resourcePoolEditor.js?v=0.41.3:165:1
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404
lf/this.$get</r.prototype.$evalAsync/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:398
e@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:43:303
Nf/k.defer/c<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:181
setTimeout handler*Nf/k.defer@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:46:156
lf/this.$get</r.prototype.$evalAsync@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:369
mf/this.$get</<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:95
f@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:498
td/<.$$reject@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:292
td/<.reject@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:121:194
e/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:118:416
h.executeQuery/<@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3649
r.defaultHttpClient.request/f.onreadystatechange@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18873
EventHandlerNonNull*r.defaultHttpClient.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:18620
authorizationRun/newClient.request@https://wealth.forcrowd.org/app/authorization.js?v=0.29:35:24
lw@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:11490
r.request@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:63766
r.read@https://wealth.forcrowd.org/bower_components/datajs/datajs.min.js?v=0.42:13:62814
h.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:6:3461
K@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:3782
Wt</tt.executeQuery@https://wealth.forcrowd.org/bower_components/breeze-client/build/breeze.min.js?v=0.42:5:13243
executeQuery@https://wealth.forcrowd.org/app/dataContext.js?v=0.41.3:79:20
getResourcePoolExpanded/<@https://wealth.forcrowd.org/app/factories/resourcePoolFactory.js?v=0.40:408:28
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404
lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76
g@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:87:442
T@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:50
Uf/</w.onload@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:93:78
EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429
r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156
m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404
lf/this.$get</r.prototype.$apply@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:134:76
EventHandlerNonNull*Uf/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:92:429
r@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:89:156
m/g<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:86:331
f/<@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:119:129
lf/this.$get</r.prototype.$eval@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:133:309
lf/this.$get</r.prototype.$digest@https://wealth.forcrowd.org/bower_components/angular/angular.min.js?v=0.42:130:404

		

Server Variables
Name	Value
ALL_HTTP	HTTP_CONNECTION:keep-alive HTTP_CONTENT_LENGTH:4793 HTTP_CONTENT_TYPE:application/json;charset=utf-8 HTTP_ACCEPT:application/json, text/plain, */* HTTP_ACCEPT_ENCODING:gzip, deflate, br HTTP_ACCEPT_LANGUAGE:en-US,en;q=0.5 HTTP_HOST:api.wealth.forcrowd.org HTTP_REFERER:https://wealth.forcrowd.org/account/login HTTP_USER_AGENT:Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0 HTTP_ORIGIN:https://wealth.forcrowd.org
ALL_RAW	Connection: keep-alive Content-Length: 4793 Content-Type: application/json;charset=utf-8 Accept: application/json, text/plain, */* Accept-Encoding: gzip, deflate, br Accept-Language: en-US,en;q=0.5 Host: api.wealth.forcrowd.org Referer: https://wealth.forcrowd.org/account/login User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0 Origin: https://wealth.forcrowd.org
APPL_MD_PATH	/LM/W3SVC/1026774205/ROOT
APPL_PHYSICAL_PATH	h:\root\home\forcrowd-001\www\forcrowd.org\wealth.api\
AUTH_TYPE	 
AUTH_USER	 
AUTH_PASSWORD	*****
LOGON_USER	 
REMOTE_USER	 
CERT_COOKIE	 
CERT_FLAGS	 
CERT_ISSUER	 
CERT_KEYSIZE	256
CERT_SECRETKEYSIZE	2048
CERT_SERIALNUMBER	 
CERT_SERVER_ISSUER	C=BE, O=GlobalSign nv-sa, CN=GlobalSign Domain Validation CA - SHA256 - G2
CERT_SERVER_SUBJECT	OU=Domain Control Validated, CN=wealth.forcrowd.org
CERT_SUBJECT	 
CONTENT_LENGTH	4793
CONTENT_TYPE	application/json;charset=utf-8
GATEWAY_INTERFACE	CGI/1.1
HTTPS	on
HTTPS_KEYSIZE	256
HTTPS_SECRETKEYSIZE	2048
HTTPS_SERVER_ISSUER	C=BE, O=GlobalSign nv-sa, CN=GlobalSign Domain Validation CA - SHA256 - G2
HTTPS_SERVER_SUBJECT	OU=Domain Control Validated, CN=wealth.forcrowd.org
INSTANCE_ID	1026774205
INSTANCE_META_PATH	/LM/W3SVC/1026774205
LOCAL_ADDR	205.144.171.9
PATH_INFO	/api/Exception/Record
PATH_TRANSLATED	h:\root\home\forcrowd-001\www\forcrowd.org\wealth.api\api\Exception\Record
QUERY_STRING	 
REMOTE_ADDR	78.173.37.118
REMOTE_HOST	78.173.37.118
REMOTE_PORT	64903
REQUEST_METHOD	POST
SCRIPT_NAME	/api/Exception/Record
SERVER_NAME	api.wealth.forcrowd.org
SERVER_PORT	443
SERVER_PORT_SECURE	1
SERVER_PROTOCOL	HTTP/1.1
SERVER_SOFTWARE	Microsoft-IIS/8.5
URL	/api/Exception/Record
HTTP_CONNECTION	keep-alive
HTTP_CONTENT_LENGTH	4793
HTTP_CONTENT_TYPE	application/json;charset=utf-8
HTTP_ACCEPT	application/json, text/plain, */*
HTTP_ACCEPT_ENCODING	gzip, deflate, br
HTTP_ACCEPT_LANGUAGE	en-US,en;q=0.5
HTTP_HOST	api.wealth.forcrowd.org
HTTP_REFERER	https://wealth.forcrowd.org/account/login
HTTP_USER_AGENT	Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0
HTTP_ORIGIN	https://wealth.forcrowd.org
HTTP_X_REWRITE_URL	/api/Exception/Record

Powered by ELMAH, version 1.2.14706.955. Copyright (c) 2004, Atif Aziz. All rights reserved. Licensed under Apache License, Version 2.0. 