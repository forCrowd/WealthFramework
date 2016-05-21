*** HOT ***

* Globalsign - 24 May, confirmation email for new ssl certificate

* smarterasp.net static ip + hosting

* smarterasp.net facebook api

* dataContext.create new cmrp - always check existing ones and don't create duplicate; New-CMRP
Save failed!<br />Key 'New-CMRP' already exists Error: Conflict
* field - rating edit in manage.html?
* warmup script for live?!
* content for forcrowd - story + team
* content for wealth - articles
* cmrp list? -> search page
* content for editor? new content or new resourcepool - content in a content? or page as a new entity?
* route update (_system/)
* samples with sample user? (to prevent edit link)

* expand('User' - brings all user info ?!?!?
http://stackoverflow.com/questions/10781309/asp-net-mvc-4-webapi-manually-handle-odata-queries
http://stackoverflow.com/questions/33126251/webapi-odata-pre-filtering-expand-queries

* UseFixedValue doesn't work at all! fix it! also check resourcePool.UseFixedResourcePoolRate case!

* number of sales fix - item.numberOfSales / element.numberOfSales - Total Cost Index

Low sales vs high sale case - is this correct?
Org1 price 100 sales 5
Org2 price 150 sales 100
Org3 price 200 sales 100
Org4 price 300 sales 5
still Org1 gets the most?

---
After Therion
get backup of pubxml files (app.min.js addition to publish) and other files in gitignore + unsynced
gpg keys? https://help.github.com/articles/checking-for-existing-gpg-keys/
remove forCrowd/breeze.js repository?
check this item - fix these; basics - new model - update elementcellnumericvalue? - probably this about 'keep displaying login/register modal on each click?'

---
* Busines Rules
 * possible error; if one child element will have 2 indexes, UI is not going to work correctly?
 * directincome type must use fixed value
 * multiplier cannot use fixed value
 * one element can't be selected by multiple fields?
 * elementfield - selectedelement validations + test?
 * ElementField SortOrder field validations - Check various scenarios, it shouldn't contain duplicate values for instance, what should happen then? Create test cases
 * field restrictions, one multiplier, one incomefield - server side validation?
Currently direct income & multiplier field types can only be added once per element (or resource pool)? If this is true, apply validations & tests

* ngClient - Entities & Factories
 * elementField.js - DataType prop uses 'broadcast' and dataContext handles this event to create the actual event
seems nice, and it could be used in other cases.
however it doesn't return the newly created entity to the caller, which probably is not suitable for most cases?
how about using $injector.get('dataContext') in these cases, instead of broadcast?
 * try to use pure entities, instead of breeze versions? then demo resource pools wouldn't need isTemp?
resourcePoolFactory.js - // Locally created CMRPs (isTemp) - TODO !
 * use createEntity in addX cases!
 * // TODO Most of these functions are related with userService.js - updateX functions
// Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
function updateCache() {
 * move saveElementField fixes under elementfield.js datatype prop!
 * try to use enums + js entities in add functions + tests
 * angularjs 404 case? https://prerender.io/documentation/best-practices
 * IMPORTANT BUT LATER!
do we correctly update RatingCount (probably yes..)?
but do we update other computed values (resourcepooltotal, count, numericvaluetotal, count, fieldratingtotal, count) correctly?
in case the owner edits them?
after save it only calls update cache.. shouldn't be enough?
* complete Index Enabled property - try to use IndexEnabled to prevent unnecessary calculations

* ngClient - Testing
 * celltests.js is okay, apply the same approach to others
 * create a generic cmrp function in commons.js to replace most of the test preparation code?
 * Check and try to remove these; // TODO Manually update?!
In most cases, it should only call cell.numericValue() etc. (most basic one) and then the rest should be done like a domino

* WebApi
 * review odatacontroller;
userId check, rowVersion check, try catch blocks, unique key checks - before or after, validation or exception, 400 or 409?
resourcepoolcontroller patch (and others?) is missing userId check?
put methdods need to be updated based on 'post' & 'patch'
 * Controller Put & Patch returns Ok, instead of Updated? Because Updated() doesn't return the server-side updates, why?
 * check return conflict() blocks, there's something wrong with them!
 * enum data type didnt work with odata? or api?
 * Odata - Find a better way for readonly props (edmbuilder)?
 * Merge OData & WebApi? So WebApi can go forever?
 * validateantiforgerytoken + bind attributes in odata controller? AntiForgery.GetTokens
 * Controller validation - unified approach?
SequenceEqual check is only in Patch method, in on Post & Put
DbUpdateConcurrencyException is only in Post & Put, in on Patch
Delete doesn't have any Concurrency check?
 * odata - paging (also filters?)
X-InlineCount - X-Pagination
querayable vs enablequerysupport  
[Queryable(PageSize=10)]  
var queryAttribute = new QueryableAttribute() { AllowedQueryOptions = AllowedQueryOptions.Top | AllowedQueryOptions.Skip, MaxTop = 100 };
config.EnableQuerySupport(queryAttribute);  
* Admin auth. - Only for admins didnt work - resourcepool etc.?
any user should be able to access them but only the owners and admins can update them?  
according to this, normal user may not use post action for instance? check these rules later on  

* BL / DAL
 * resourcepool - resourcepoolratetotal, count, ratingcount never null
elementfiel - indexratingtotal, count never null
elementcell - numericvaluecount never null - ONLY numericvaluetotal CAN BE NULL? which can be changed to NOT NULL!
elementfield - indexcalculationtype + indexsortype should have null value?
 * move enums to their related class?
 * complete security.permissions on business objects
 * implement soft delete
 * find vs deleted records? - findlive? or don't retrieve dead records at all?
 * IAuditableEntity - entity createdby, modifiedby, deletedby properties
 * extend dbcontext validation errors - check spaanjaars sample and use them in webapp with modelstate blocks?
 * how about disabling proxy classes? what will be the difference exactly?
 * Learn when and how to use IDisposable. Currently are there any object that should implement and/or call Dispose, repository + unitofwork + context + controllers?
 * calling saveChanges in dispose of unitofwork?
 * template pattern for elementfield + fieldtype classes!
 * Find method  
public IEnumerable[t] FindBy(System.Linq.Expressions.Expression[func[T, bool]] predicate)  
{ IEnumerable[T] query = _dbset.Where(predicate).AsEnumerable(); return query; }
 * check whether unit of work classes (and also Controllers) need merging  
however, in the current structure, every entity will have a unitofwork + controller by default?  
be careful about different contexts entities - license.resourcepool = sampleResourcePool was creating new resource pools!  
either work with Ids, or try to work on merging unitofwork classes
* UserAware remark: ResourcePool has UserId but doesn't use UserAware attribute, so any user can retrieve someone else's CMRP
But is this correct approach? And how about updating it, does it allow other users to update?
With UserAware, should we also mention which actions are allowed?
* In case you need to set UserId explicitly, do these actions under methods that can only be called by Admins!
* When the user logs out, how to clear existing related data from context? Or is this an issue?

* Identity / Account:
 * client side user session expire case - expires property to calculate?!
 * refresh tokens
 * Invalidating tokens http://stackoverflow.com/questions/22755700/revoke-token-generated-by-usertokenprovider-in-asp-net-identity-2-0/22767286#22767286
 * before sending any email to user, check whether it's confirmed?
 * Two factor auth.
 * Account lockout
 * rememberMe - register user auto login: false - external login vm.rememberMe?

* Glimpse
 * find a way to log sql queries! glimpse?
 * glimpse webapi (trace for instance) doesn't work for the moment - check it again later
 * elmah for glimpse. necessary?
 * Remote server? http://blog.getglimpse.com/2013/12/09/protect-glimpse-axd-with-your-custom-runtime-policy/

* ngClient - UI
 * my ratings / show all users' ratings should be applied each section separately (cmrp rate, field rating, element cell value)
 * Navigate away confirmation in isEditing
 * angular material - https://material.angularjs.org/latest/
 * blur admin https://github.com/akveo/blur-admin?utm_content=buffera7574&utm_medium=twitter&utm_source=changelog&utm_campaign=buffer
 * Better ratings UI https://angular-ui.github.io/bootstrap/#/getting_started
 * improve password validation https://docs.angularjs.org/guide/forms
 * copy from an existing cmrp / template? how to handle user level data - only copy computed ones?
 * html form novalidate attribute?
 * toastr has a jquery dependency - without it, jquery can be removed?
 * Rating UI: Current ratings are from 0 to 100, could to 5, 10 or 1000 as well?
 * HighCharts - using texbox to update chart data didn't work, it breaks the chart?
 * moving menu (fixed to top of the screen)
 * update editor size accordingly (with menu, it doesn't fit to screen)
 * info tooltips hover, won't work on mobiles?
 * cmrp rate visibility or resourcepool has it?
 * (total) resource pool field incl. CMRP Add. field visibility?
 * scroll directive (scrollToItem - requires jQuery); http://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
 * selecting the current item in the menu / updating url?
 * navigating to the current item on initial load?
 * Handling concurrency can be improved;
Load the new record from the server and let the user update it's record accordingly
Or in some cases, it should do it automatically (like in resourcePoolEditor samples?)
 * Auto retry for certain (concurrency etc.) when it fails to read or write to server?

* Server Side Testing
 * enable auto test for appveyor - currently it fails probably because it can't create the db?
 * http://www.asp.net/web-api/overview/testing-and-debugging/mocking-entity-framework-when-unit-testing-aspnet-web-api-2
 * dependecy injection necessary? - Autofac, Ninject, Unity or ? Check their websites - Check Asp.Net Identity as a sample

* New Features

* Misc
 * permissions - instead of enableresourcepooladdition field to control whether user can enter userresourcepoolrate, handle it with permissions - if the user has a right to enter or not? same goes for FieldIndex ratings
 * Database performance: Suggests to create a separate username field with index http://blogs.msdn.com/b/webdev/archive/2015/02/11/improve-performance-by-optimizing-queries-for-asp-net-identity-and-other-membership-providers.aspx
 * __migrationhistory createdon field error - it seems there is not much to do, it also might be about glimpse?
 * Convert batch files to PowerShell scripts - to get used to Powershell

 * blank project (User / Environment Ignorant)
Try to remove static configurations from the application, so the users can use the application with their own settings.

 * The list of projects & files that have static connectionStrings;
All .tt files - Facade.Tests - Dataobjects.Tests - Dataobjects - Local_db command scripts

 * naming updates
referenceRatingMultiplied -> aggressiveRatingBase ?
Repository -> Store - UnitOfWork -> Manager - Db table names -> [Table]Set? - So using "User" table wouldn't be a problem?

 * check the routes again!
/_system/account
/_system/about | /_system/content/about ?
/_system/articles/?
/_system/register
/_system/login
/_system/search
_sys|_|~|.|-|.sys|.s|.i|_int|
ALPHA / DIGIT / "-" / "." / "_" / "~"

 * MAP - Update this list!
most of 'updateRelated' blocks & IndexEnabled check on ElementCell.js became obsolete!
cell.numericValueAverage | cell.currentUserNumericValue
cell.numericValue | item.multiplier
cell.numericValueMultiplied
field.numericValueMultiplied
. cell.passiveRatingPercentage
. field.referenceRatingMultiplied
. cell.aggressiveRating
. field.aggressiveRating
. cell.aggressiveRatingPercentage
. cell.indexIncome

 * FieldType notes
string - n/a
bool - indexable (fixed / user (only current - rating average))
int - indexable (fixed / user (only current - rating average))
decimal - indexable (fixed / user (only current - rating average)) - resource pool (fixed) - multiplier (user - only current)
datetime - indexable (fixed / user (only current - rating average))
element - n/a
resource - ~decimal
multiplier - n/a
result of datetime (ticks) index is bit useless? need reference a start or end date as a reference?

* 3rd party - Check & Review Later
 * google search console - sitemap
 * breeze save error extension http://breeze.github.io/doc-breeze-labs/save-error-extensions.html
 * breeze metadata helper http://breeze.github.io/doc-breeze-labs/metadata-helper.html
 * angularjs conventions; https://github.com/mgechev/angularjs-style-guide
 * chutzpah - https://github.com/mmanela/chutzpah/wiki/Chutzpah.json-Settings-File
 * web api throttling!
 * automapper - useful library, do we need it?
 * html minifier: https://github.com/deanhume/html-minifier | https://www.npmjs.com/package/gulp-minify-html
 * creative commons?
 * Token binding protocol? HTTP/2 Support?
 * http://namevine.com/#/forcrowd
 * shields.io for badges
 * Nice tool: http://www.mail-tester.com/
 * request validation -> html agility pack?
 * coded ui test or canopy or ..? web iu testers?
 * http://www.postsharp.net/aspects#examples
 * elastic search?
 * https://github.com/hazzik/DelegateDecompiler
 * datasets endpoints? https://github.com/datasets/gdp/blob/master/data/gdp.csv
 * code contracts?
 * Install-Package DynamicQuery?
 * http://www.hanselman.com/blog/crossbrowserdebuggingintegratedintovisualstudiowithbrowserstack.aspx
 * https://www.runscope.com/signup
