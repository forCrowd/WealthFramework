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

* token binding protocol?
HTTP/2 Support?

* was there any problem of calculating otherusersresourcepoolratetotal - because of it was retrieving all the users (related with multitenancy?)
try to do it again? otherwise, after loading the data from the server, it should calculate this on the client-side only once?

TEST RELATED
* celltests.js is okay, apply the same approach to others
* create a generic cmrp function in commons.js to replace most of the test preparation code?
* Check and try to remove these; // TODO Manually update?!
In most cases, it should only call cell.numericValue() etc. (most basic one) and then the rest should be done like a domino
* karma ff console! angular etc. errors! bit problematic?
* Unit testing for controllers + unitofwork etc.?

---
* check validation cases - null is okay but how about Id check - Id > 0?

* check whether unit of work classes (and also Controllers) need merging  
however, in the current structure, every entity will have a unitofwork + controller by default?  
be careful about different contexts entities - license.resourcepool = sampleResourcePool was creating new resource pools!  
either work with Ids, or try to work on merging unitofwork classes  

* authorize only for admins didnt work - resourcepool etc.?
any user should be able to access them but only the owners and admins can update them?  
according to this, normal user may not use post action for instance? check these rules later on  

* glimpse webapi (trace for instance) doesn't work for the moment - check it again later
* glimpse on remote server? http://blog.getglimpse.com/2013/12/09/protect-glimpse-axd-with-your-custom-runtime-policy/
* implement soft delete
* exists should work with find or alllive.any() or all.any()?  
* find vs deleted records? - findlive? or don't retrieve dead records at all?
* loading animation? both for breeze + angular  
[nprogress](http://ricostacruz.com/nprogress/) ?
* enum data type didnt work with odata? or api?
* using texbox to update chart data didn't work, it breaks the chart?
* about MVC, only routing is left, if that could be replaced MVC could be gone forever?
Check this; modules runAllManagedModulesForAllRequests="true"
* http://localhost:15001/content/ - 403 - Forbidden: Access is denied error?
* automate .tt scripts with afterbuild?
* try to have a standard for css usage + html layout formats + also js script conventions
* enable auto test for appveyor - currently it fails probably because it can't create the db?
* __migrationhistory createdon field error - it seems there is not much to do, it also might be about glimpse?
* code contracts?
* Install-Package DynamicQuery?
* http://www.hanselman.com/blog/crossbrowserdebuggingintegratedintovisualstudiowithbrowserstack.aspx
* https://www.runscope.com/signup
* html minifier: https://github.com/deanhume/html-minifier
* /help works, improve and use it?
And how about Install-Package Microsoft.AspNet.WebApi.HelpPage ? same?
* web api throttling!
* request validation -> html agility pack?
* coded ui test or canopy or ..? web iu testers?
* object level validation IValidatableObject
* http://www.postsharp.net/aspects#examples
* elastic search?
* https://github.com/hazzik/DelegateDecompiler
* Generalizing Validation via Custom Validation Filter Attribute -> general filter for ModelState.IsValid check! http://www.dotnetcurry.com/showarticle.aspx?ID=927
* validateantiforgerytoken + bind attributes in odata controller?
* template pattern for elementfield + fieldtype classes!
* calling saveChanges in dispose of unitofwork?
* extend dbcontext validation errors - check spaanjaars sample and use them in webapp with modelstate blocks?
* result of datetime (ticks) index is bit useless? need reference a start or end date as a reference?
* remove scripts folder from github? - it's not possible for today / 11 Mar. '15
* how about disabling proxy classes? what will be the difference exactly?
* elmah for glimpse. necessary?
* automapper - useful library, do we need it?
* Convert batch files to PowerShell scripts - to get used to Powershell
* ElementField SortOrder field validations - Check various scenarios, it shouldn't contain duplicate values for instance, what should happen then? Create test cases

* jetbrains vs tools open source promotion;
https://www.jetbrains.com/

* angularjs conventions;
https://github.com/mgechev/angularjs-style-guide

* breeze save queuing - is this useful?
http://www.getbreezenow.com/documentation/concurrent-saves
tried this but should be improved. Before calling saveChanges function, we set each modified entities' RowVersion property in prepareSaveBatches function in dataContext.js. And this function is getting called before queuing operation, which means it stores outdated (invalid RowVersion) entities (normally after save operation it was updating local entity with RowVersion that comes from the server) and in the second call it returns 'Conflict' error message.

* unified approach for controller validations;
SequenceEqual check is only in Patch method, in on Post & Put
DbUpdateConcurrencyException is only in Post & Put, in on Patch
Delete does't have any Concurrency check?

* Handling concurrency can be improved;
Load the new record from the server and let the user update it's record accordingly
Or in some cases, it should do it automatically (like in resourcePoolEditor samples?)

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
* software licenses;
https://www.blackducksoftware.com/resources/data/top-20-open-source-licenses			
http://opensource.org/licenses/category
http://products.office.com/en-us/microsoft-software-license-agreement
http://www.microsoft.com/en-us/legal/intellectualproperty/useterms/default.aspx
http://download.microsoft.com/Documents/UseTerms/Windows_8.1_English_468d3103-64a4-44fa-8f73-23490ee17ea5.pdf

* angular interceptor for error handling?
http://www.codeproject.com/Articles/857594/MVC-Thorough-Error-Handling		

* Content related;
dynamic pricing - low price is good but can't be zero because then it's not sustainable as well?
Answer to this question: It's not just zero but any income lower than the cost wouldn't be sustainable (income >= cost). The question is how to ensure that the organization is going to get more income in case if they're making their products accessible to all by not asking any money (which we would like to encourage). Probably the organization should say we're going to get our income from the pool, not by selling it. Which means it will be totally controlled and funded by the pool.

* keep dataContext.js in localStorage?

* elementfield - selectedelement validations + test?

* cmrp rate visibility or resourcepool has it?
(total) resource pool field incl. CMRP Add. field visibility?

* try to make stores (repositories), managers and controllers (also business objects) testable?
what are the dependencies? work on separation of concerns.
where to create memorydbcontext? on dbobjects or business objects? also do we need IoC framework? ninject looks quite easy but is it necessary?
instead of dataobjects, it should be dataobjects.EF?

* check todo items

* check error handling again, it was handling api errors as well? - IS THIS OBSOLETE?

---
http://www.asp.net/web-api/overview/testing-and-debugging/mocking-entity-framework-when-unit-testing-aspnet-web-api-2

---
. addfield method should create new elementcells for this new field for the existing items!

. one element can't be selected by multiple fields?

. breeze entities - initial values - to prevent !== 'undefined' checks!
. element.js - in objects, create their inner arrays userElementSet[] etc.

. Odata - Find a better way for readonly props (edmbuilder)?
Also AccountController methods? So WebApi can go forever?

. multitenancy; no need to set User props but handle validation issue
how about user entity itself?
test - what if the user not logged in or not auth.! then what happens to interceptors?
test - userqueryvisitor with filter!

. complete security.permissions on business objects

. _manual contains static 18,2 for decimal

. ? http://blogs.msdn.com/b/webdev/archive/2015/02/11/improve-performance-by-optimizing-queries-for-asp-net-identity-and-other-membership-providers.aspx

. What to test on BL?

* possible error; if one child element will have 2 indexes, UI is not going to work correctly?

* find a way to log sql queries! glimpse?

* who has a right to enter a rating for cmrp rate + index + element item rating (cell)
if the current user has no right to enter a rating for that area, then it must use ALL USERS' RATING - no need to show 'Your Own Ratings' option

* auto retry for certain (concurrency) save cases ?!

* user level notes;
1. try to handle all the actions by using authenticated user, shouldn't be necessary to pass user variable
2. in case you need to set UserId explicitly, do these actions under methods that can only be called by Admins!
3. when the user logs out, how to clear existing related data from context?
								
* users should choose the ideal rate/ratings - it shouldn't be experimental? especially license ratings, index ratings, cmrp rate!

* introduction, don't allow to use multiplier functions?
some samples don't need to be saved ?! intro + basics?
	
	* **social media login?**

	* **Better ratings UI**
https://angular-ui.github.io/bootstrap/#/getting_started

	* **verification email?**

	* **allow cmrp rate to be changed**

	* **update google analytics on route changes**

* current vs existing vs present vs old?

* sitemaps for google search console

* cleanup social media stuff!

* accountController.js doesn't handle the error the server well, it only says "Invalid request" or something. Check modelState error?

* how breeze react in case of querying expanded + expandedwithuser from local..? does it say it's there or not?

* creative commons?

* social media
skype
pinterest
instagram
others?
http://namevine.com/#/forcrowd

. wording;
facebook	log in		sign up
twitter		log in		sign up for Twitter
google		sign in		create a new account (sign up)
linkedin	sign in		join now
microsoft	sign in		sign up

* should samples details need to be mentioned? all organizations are equal except the indexes, they all have to have same number of sales etc.

. sendgrid;
https://sendgrid.com/windowsazure.html - 25K free emails for Azure account
http://azure.microsoft.com/en-in/documentation/articles/sendgrid-dotnet-how-to-send-email/ - uses SendGrid library to send the emails

https://sendgrid.com/blog/tips-tricks-stay-spam-folder-qa/
https://sendgrid.com/docs/User_Guide/warming_up.html
http://www.mail-tester.com/

wealth is interested in the following questions;
. how the society allocates its resources?
. what type of organizations get more resources?
. room for improvement? - yes
. what would happen if the people could control and allocate the resources directly?

* users, user metadata check!

* improve password validation https://docs.angularjs.org/guide/forms

* disqus errors - https://github.com/Q42/q42.nl/issues/17
https://github.com/michaelbromley/angularUtils/tree/master/src/directives/disqus
nuget package?

* permissions - instead of enableresourcepooladdition field to control whether user can enter userresourcepoolrate, handle it with permissions - if the user has a right to enter or not? same goes for FieldIndex ratings

* user aware is not enough anymore
we should also be able to mention which actions are allowed
userresourcepool + userx is okay, but resourcepool will also be under user now but other users can retrieve it this time, while other actions are still not permitted

* element cell - user element cell - user cleanup

* check old sample org names

sector index - 4 org - 4 sector
knowle index - 2 org - 2 license
total  index - 3 prices
fair s index - 2 org - 2 options

32 ~ 48

sector1+lic1+prof+keeper
sector2+lic2+nonprof+sharer
sector3+lic1+prof+keeper
sector4+lic2+nonprof+sharer
sector1+lic2+prof+sharer
sector2+lic1+nonprof+keeper
sector3+lic2+prof+sharer
sector4+lic1+nonprof+keeper

cosmetics Queen's Favorites
education School of Arcana
entertainment Band of Bards
heathcare Cleric's Touch

hidden knowledge / blackbox
true source

profit nonprofit

keeper sharer

Hidden Cosmetics (Profit + Keeper)
Hidden Cosmetics (Non-profit + Keeper)
Hidden Cosmetics (Profit + Sharer)
Hidden Cosmetics (Non-profit + Sharer)
True Cosmetics (Profit + Keeper)
True Cosmetics (Non-profit + Keeper)
True Cosmetics (Profit + Sharer)
True Cosmetics (Non-profit + Sharer)

Hidden Education (Profit + Keeper)
Hidden Education (Non-profit + Keeper)
Hidden Education (Profit + Sharer)
Hidden Education (Non-profit + Sharer)
True Education (Profit + Keeper)
True Education (Non-profit + Keeper)
True Education (Profit + Sharer)
True Education (Non-profit + Sharer)

Hidden Entertainment (Profit + Keeper)
Hidden Entertainment (Non-profit + Keeper)
Hidden Entertainment (Profit + Sharer)
Hidden Entertainment (Non-profit + Sharer)
True Entertainment (Profit + Keeper)
True Entertainment (Non-profit + Keeper)
True Entertainment (Profit + Sharer)
True Entertainment (Non-profit + Sharer)

Hidden Healthcare (Profit + Keeper)
Hidden Healthcare (Non-profit + Keeper)
Hidden Healthcare (Profit + Sharer)
Hidden Healthcare (Non-profit + Sharer)
True Healthcare (Profit + Keeper)
True Healthcare (Non-profit + Keeper)
True Healthcare (Profit + Sharer)
True Healthcare (Non-profit + Sharer)

---
refresh tokens?

cors (ngclient + api separation)
http://bitoftech.net/2014/06/09/angularjs-token-authentication-using-asp-net-web-api-2-owin-asp-net-identity/
https://github.com/tjoudeh/AngularJSAuthentication

X-InlineCount
X-Pagination

---
scroll directive (scrollToItem - requires jQuery);
http://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
moving menu (fixed to top of the screen)
selecting the current item in the menu / updating url?
navigating to the current item on initial load?
prevent re-render
update editor size accordingly (with menu, it doesn't fit to screen)
check, use anchorScrollTest project?

---
anti forgery: AntiForgery.GetTokens

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

---
// TODO With just Ok(), it return the response with no content-type.
// Apparetnly Firefox default for no content-type is xml and logs 'no element found' message on console.
// return Ok();
return Ok(string.Empty);
