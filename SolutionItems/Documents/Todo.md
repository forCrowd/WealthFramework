*** HOT ***

send exception to server in 404 case?

viewModel - bindingModel - namingConvention fix (send correct objects to server - not vm from controller?)

angular dependency order alphabetically

check this out; http://breeze.github.io/doc-breeze-labs/directives-validation.html
check this out: https://github.com/mmanela/chutzpah/wiki/Chutzpah.json-Settings-File

content for editor? new content or new resourcepool - content in a content? or page as a new entity?

cmrp list? -> search?

item.numberOfSales / element.numberOfSales

redirect www.forcrowd.org to wealth.forcrowd.org?

Check the grants from Nadia's F18 slides

how to use modals! is there any resolve? controllers + views into separate files?

samples with sample user? (to prevent edit link)

---
Total Cost Index
Low sales vs high sale case - is this correct?
Org1 price 100 sales 5
Org2 price 150 sales 100
Org3 price 200 sales 100
Org4 price 300 sales 5
still Org1 gets the most?

*** UNSORTED ***

Identity / Account:
. client side user session expire case - expires property to calculate?!
. refresh tokens
. Invalidating tokens http://stackoverflow.com/questions/22755700/revoke-token-generated-by-usertokenprovider-in-asp-net-identity-2-0/22767286#22767286
. before sending any email to user, check whether it's confirmed?
. Two factor auth.
. Account lockout
. rememberMe - register user auto login: false - external login vm.rememberMe?

---
check the routes again!
/_system/account ?
/_system/content/about ... ?
/_system/articles/?
/_system/register
/_system/login
_sys|_|~|.|-|.sys|.s|.i|_int|
ALPHA / DIGIT / "-" / "." / "_" / "~"

expand('User' - brings all user info ?!?!?
http://stackoverflow.com/questions/10781309/asp-net-mvc-4-webapi-manually-handle-odata-queries
http://stackoverflow.com/questions/33126251/webapi-odata-pre-filtering-expand-queries

odata validation
https://blogs.msdn.microsoft.com/webdev/2013/02/06/protect-your-queryable-api-with-the-validation-feature-in-asp-net-web-api-odata/

fix these; basics - new model - update elementcellnumericvalue? - NOT CLEAR?

rating UI: Current ratings are from 0 to 100, could to 5, 10 or 1000 as well?

IMPORTANT BUT LATER!
do we correctly update RatingCount (probably yes..)?
but do we update other computed values (resourcepooltotal, count, numericvaluetotal, count, fieldratingtotal, count) correctly?
in case the owner edits them?
after save it only calls update cache.. shouldn't be enough?

try to use pure entities, instead of breeze versions? then demo resource pools wouldn't need isTemp?

Navigate away confirmation in isEditing

review odatacontroller;
userId check, rowVersion check, try catch blocks, unique key checks - before or after, validation or exception, 400 or 409?
resourcepoolcontroller patch (and others?) is missing userId check?
put methdods need to be updated based on 'post' & 'patch'

---
ng-show / if: if it will be on/off frequently (and takes time to render), use show
if it will be drawn once based on a certain condition and probably it will not change its state, use if?

elementField.js - DataType prop uses 'broadcast' and dataContext handles this event to create the actual event
seems nice, and it could be used in other cases.
however it doesn't return the newly created entity to the caller, which probably is not suitable for most cases?
how about using $injector.get('dataContext') in these cases, instead of broadcast?

use createEntity in addX cases!

// TODO Most of these functions are related with userService.js - updateX functions
// Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
function updateCache() {

move saveElementField fixes under elementfield.js datatype prop!

UseFixedValue doesn't work at all! fix it!
also check resourcePool.UseFixedResourcePoolRate case!

objects vs entities

add newly created cmrps to fetchedList in cmrpfactory - and don't use newlyCreated flag

resourcePoolFactory.js - // Locally created CMRPs (isTemp) - TODO !

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

check return conflict() blocks, there's something wrong with them!

. check these notes - too old? - Calcuation Notes & Questions
Sample user doesn't have to have ratings and therefore no need to copy them to new users.
Sample user will only be the owner of sample CMRPs
User rating will only be created if he/she interacts with it?

. elementfield - indexcalculationtype + indexsortype should have null value?

. field restrictions, one multiplier, one incomefield - server side validation?
Currently direct income & multiplier field types can only be added once per element (or resource pool)? If this is true, apply validations & tests

. info tooltips hover, won't work on mobiles?

. Better ratings UI https://angular-ui.github.io/bootstrap/#/getting_started
. angular material - https://material.angularjs.org/latest/

. toastr has a jquery dependency - without it, jquery can be removed?
. source-map - original position name & column props are null

---
blank project (User / Environment Ignorant)
Try to remove static configurations from the application, so the users can use the application with their own settings.

The list of projects & files that have static connectionStrings;
All .tt files
Facade.Tests
Dataobjects.Tests
Dataobjects
Local_db command scripts

---
an async issue?
RowVersion property of the entity cannot be null&#xD;&#xA;   at forCrowd.WealthEconomy.WebApi.Controllers.OData.BaseUserElementCellController.&lt;Patch&gt;d__9.MoveNext() in D:\Development\Projects\GitHub\forCrowd\WealthEconomy\WebApi\Controllers\OData\Generated\UserElementCellController.cs:line 133
throw new InvalidOperationException("RowVersion property of the entity cannot be null");

* naming updates
referenceRatingMultiplied -> aggressiveRatingBase ?
Repository -> Store
UnitOfWork -> Manager
Db table names -> [Table]Set? - So using "User" table wouldn't be a problem?

* html form novalidate attribute?

* apply "// Set otherUsers' properties" section in custom resourcepoolservice.js to all getResourcePool options?

* sales price is actually not correct in CMRP samples?
should it show sales price including cmrp tax instead? it's not clear where the money comes from..?
or it doesn't matter at the moment? at least mention it in CMRP Rate: The Fountain section?

* don't make cmrp rate updateable? then the user will be affected other user's cmrp ratings?

* complete Index Enabled property - try to use IndexEnabled to prevent unnecessary calculations

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

* token binding protocol? HTTP/2 Support?

* was there any problem of calculating otherusersresourcepoolratetotal - because of it was retrieving all the users (related with multitenancy?)
try to do it again? otherwise, after loading the data from the server, it should calculate this on the client-side only once?

TEST RELATED
* celltests.js is okay, apply the same approach to others
* create a generic cmrp function in commons.js to replace most of the test preparation code?
* Check and try to remove these; // TODO Manually update?!
In most cases, it should only call cell.numericValue() etc. (most basic one) and then the rest should be done like a domino
* Unit testing for controllers + unitofwork etc.?

---
* datasets endpoints? https://github.com/datasets/gdp/blob/master/data/gdp.csv

* Remark: cookieauth was necessary to use browser to reach auth pages - elmah.axd for instance and /api/..

* check validation cases - null is okay but how about Id check - Id > 0?

* check whether unit of work classes (and also Controllers) need merging  
however, in the current structure, every entity will have a unitofwork + controller by default?  
be careful about different contexts entities - license.resourcepool = sampleResourcePool was creating new resource pools!  
either work with Ids, or try to work on merging unitofwork classes  

* authorize only for admins didnt work - resourcepool etc.?
any user should be able to access them but only the owners and admins can update them?  
according to this, normal user may not use post action for instance? check these rules later on  

* angularjs 404 case? https://prerender.io/documentation/best-practices
* object level validation IValidatableObject
* glimpse webapi (trace for instance) doesn't work for the moment - check it again later
* glimpse on remote server? http://blog.getglimpse.com/2013/12/09/protect-glimpse-axd-with-your-custom-runtime-policy/
* implement soft delete
* find vs deleted records? - findlive? or don't retrieve dead records at all?
* enum data type didnt work with odata? or api?
* using texbox to update chart data didn't work, it breaks the chart?
* automate .tt scripts with afterbuild?
* enable auto test for appveyor - currently it fails probably because it can't create the db?
* __migrationhistory createdon field error - it seems there is not much to do, it also might be about glimpse?
* code contracts?
* Install-Package DynamicQuery?
* http://www.hanselman.com/blog/crossbrowserdebuggingintegratedintovisualstudiowithbrowserstack.aspx
* https://www.runscope.com/signup
* html minifier: https://github.com/deanhume/html-minifier | https://www.npmjs.com/package/gulp-minify-html
* web api throttling!
* request validation -> html agility pack?
* coded ui test or canopy or ..? web iu testers?
* http://www.postsharp.net/aspects#examples
* elastic search?
* https://github.com/hazzik/DelegateDecompiler
* Generalizing Validation via Custom Validation Filter Attribute -> general filter for ModelState.IsValid check! http://www.dotnetcurry.com/showarticle.aspx?ID=927
* validateantiforgerytoken + bind attributes in odata controller?
* template pattern for elementfield + fieldtype classes!
* calling saveChanges in dispose of unitofwork?
* Learn when and how to use IDisposable. Currently are there any object that should implement and/or call Dispose, repository + unitofwork + context + controllers?
* extend dbcontext validation errors - check spaanjaars sample and use them in webapp with modelstate blocks?
* result of datetime (ticks) index is bit useless? need reference a start or end date as a reference?
* how about disabling proxy classes? what will be the difference exactly?
* elmah for glimpse. necessary?
* automapper - useful library, do we need it?
* Convert batch files to PowerShell scripts - to get used to Powershell
* ElementField SortOrder field validations - Check various scenarios, it shouldn't contain duplicate values for instance, what should happen then? Create test cases

* aspnet 5 - it seems it's not ready or at least easy to publish at the moment / coni2k - 28 Jan. '16

* google analytics filters - apparently ignoring localhost + test only works for future visits?

* angularjs conventions; https://github.com/mgechev/angularjs-style-guide

* breeze save queuing - is this useful?
http://www.getbreezenow.com/documentation/concurrent-saves
tried this but should be improved. Before calling saveChanges function, we set each modified entities' RowVersion property in prepareSaveBatches function in dataContext.js. And this function is getting called before queuing operation, which means it stores outdated (invalid RowVersion) entities (normally after save operation it was updating local entity with RowVersion that comes from the server) and in the second call it returns 'Conflict' error message.

* breeze remark: fetchEntityByKey 'User' - EntityQuery.from 'Users'

* dataContext - What to do these lines; batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));

* unified approach for controller validations;
SequenceEqual check is only in Patch method, in on Post & Put
DbUpdateConcurrencyException is only in Post & Put, in on Patch
Delete doesn't have any Concurrency check?

* Handling concurrency can be improved;
Load the new record from the server and let the user update it's record accordingly
Or in some cases, it should do it automatically (like in resourcePoolEditor samples?)
* Auto retry for certain (concurrency etc.) when it fails to read or write to server?

* Controller Put & Patch returns Ok, instead of Updated? Because Updated() doesn't return the server-side updates, why?

* find method  
public IEnumerable[t] FindBy(System.Linq.Expressions.Expression[func[T, bool]] predicate)  
{ IEnumerable[T] query = _dbset.Where(predicate).AsEnumerable();
return query; }

* odata - paging (also filters?)  
querayable vs enablequerysupport  
[Queryable(PageSize=10)]  
var queryAttribute = new QueryableAttribute() { AllowedQueryOptions = AllowedQueryOptions.Top | AllowedQueryOptions.Skip, MaxTop = 100 };
config.EnableQuerySupport(queryAttribute);  

---
* elementfield - selectedelement validations + test?

* cmrp rate visibility or resourcepool has it?
(total) resource pool field incl. CMRP Add. field visibility?

* try to make stores (repositories), managers and controllers (also business objects) testable?
what are the dependencies? work on separation of concerns.
where to create memorydbcontext? on dbobjects or business objects? also do we need IoC framework? ninject looks quite easy but is it necessary?
instead of dataobjects, it should be dataobjects.EF?

* dependecy injection
Autofac, Ninject, Unity or ? Check their websites - Check Asp.Net Identity as a sample
And do we need it?

* http://www.asp.net/web-api/overview/testing-and-debugging/mocking-entity-framework-when-unit-testing-aspnet-web-api-2

* Check EF conventions for possible use; rowversion, datetime, id etc?

---
. addfield method should create new elementcells for this new field for the existing items! - ALREADY OK?

. one element can't be selected by multiple fields?

. breeze entities - initial values - to prevent !== 'undefined' checks! - THIS WON'T WORK
. element.js - in objects, create their inner arrays userElementSet[] etc. - THIS WON'T WORK

. Odata - Find a better way for readonly props (edmbuilder)?
Also AccountController methods? So WebApi can go forever?

. multitenancy; no need to set User props but handle validation issue
how about user entity itself?
test - what if the user not logged in or not auth.! then what happens to interceptors?
test - userqueryvisitor with filter!

. complete security.permissions on business objects

. ? http://blogs.msdn.com/b/webdev/archive/2015/02/11/improve-performance-by-optimizing-queries-for-asp-net-identity-and-other-membership-providers.aspx

. What to test on BL?

* possible error; if one child element will have 2 indexes, UI is not going to work correctly?

* find a way to log sql queries! glimpse?

* who has a right to enter a rating for cmrp rate + index + element item rating (cell)
if the current user has no right to enter a rating for that area, then it must use ALL USERS' RATING - no need to show 'Your Own Ratings' option

* user level notes;
1. try to handle all the actions by using authenticated user, shouldn't be necessary to pass user variable - THIS SHOULD ALREADY BE OK
2. in case you need to set UserId explicitly, do these actions under methods that can only be called by Admins!
3. when the user logs out, how to clear existing related data from context?

* sitemaps for google search console

* how breeze react in case of querying expanded + expandedwithuser from local..? does it say it's there or not?

* creative commons?

* http://namevine.com/#/forcrowd

* shields.io for badges

* Nice tool: http://www.mail-tester.com/

* users, user metadata check!

* improve password validation https://docs.angularjs.org/guide/forms

* permissions - instead of enableresourcepooladdition field to control whether user can enter userresourcepoolrate, handle it with permissions - if the user has a right to enter or not? same goes for FieldIndex ratings

* user aware is not enough anymore
we should also be able to mention which actions are allowed
userresourcepool + userx is okay, but resourcepool will also be under user now but other users can retrieve it this time, while other actions are still not permitted

* element cell - user element cell - user cleanup

* refresh tokens?

* X-InlineCount - X-Pagination

* anti forgery: AntiForgery.GetTokens

* scroll directive (scrollToItem - requires jQuery);
http://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
moving menu (fixed to top of the screen)
selecting the current item in the menu / updating url?
navigating to the current item on initial load?
prevent re-render
update editor size accordingly (with menu, it doesn't fit to screen)
check, use anchorScrollTest project?

* // TODO With just Ok(), it return the response with no content-type.
// Apparetnly Firefox default for no content-type is xml and logs 'no element found' message on console.
// return Ok();
return Ok(string.Empty);

---
public class CountryController : Controller
  {
      //initialize service object
      ICountryService _CountryService;
 
      public CountryController(ICountryService CountryService)
      {
	  }
  }
  
public interface IContext
   {
       IDbSet<Person> Persons { get; set; }
       IDbSet<Country> Countries { get; set; }
       
       DbSet<TEntity> Set<TEntity>() where TEntity : class;
       DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
 
       int SaveChanges();
   }
 
 
   public class SampleArchContext : DbContext, IContext
   {
 
       public SampleArchContext()
           : base("Name=SampleArchContext")
       {
           //this.Configuration.LazyLoadingEnabled = false; 
       }
 
       public IDbSet<Person> Persons { get; set; }
       public IDbSet<Country> Countries { get; set; }
        
       protected override void OnModelCreating(DbModelBuilder modelBuilder)
       {
           modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();  
           base.OnModelCreating(modelBuilder);
       }
 
       public override int SaveChanges()
       {
           var modifiedEntries = ChangeTracker.Entries()
               .Where(x => x.Entity is IAuditableEntity
                   && (x.State == System.Data.Entity.EntityState.Added || x.State == System.Data.Entity.EntityState.Modified));
 
           foreach (var entry in modifiedEntries)
           {
               IAuditableEntity entity = entry.Entity as IAuditableEntity;
               if (entity != null)
               {
                   string identityName = Thread.CurrentPrincipal.Identity.Name;
                   DateTime now = DateTime.UtcNow;
 
                   if (entry.State == System.Data.Entity.EntityState.Added)
                   {
                       entity.CreatedBy = identityName;
                       entity.CreatedDate = now;
                   }
                   else {
                       base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                       base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;                   
                   }
 
                   entity.UpdatedBy = identityName;
                   entity.UpdatedDate = now;
               }
           }
 
           return base.SaveChanges();
       }       
   }

---
string - n/a

bool - indexable (fixed / user (only current - rating average))
int - indexable (fixed / user (only current - rating average))
decimal - indexable (fixed / user (only current - rating average)) - resource pool (fixed) - multiplier (user - only current)
datetime - indexable (fixed / user (only current - rating average))

element - n/a
resource - ~decimal
multiplier - n/a

*** ERRORS ***

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
