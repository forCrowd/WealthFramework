# Todo

## Short Term

### Functional

* Check userunitofwork + resourcepoolunitofwork + userresourcepoolunitofwork for sample records + delete cases
* Initial (fixed) amount for resource pool
* Currently multiplier + resource pool field types can only be added once per element (or resource pool) - check it again
* ismainelement -> DefaultElement
* instead of MainElement boolean on Element level, can it be done with MainElement field on ResourcePool level? yes, with InverseProperty
* subtotals; sales price, sales price incl. tax, number of sales, total tax, total sales price incl. tax, total income
* userelementcell ratings + counts?
* display index's own ratings + counts?

### Technical

* Unit testing for controllers + unitofwork etc.?
* autofac or ninject or windsor or unity or spring?
check the websites  
http://www.dimecasts.net/Casts/ByTag/Ninject  
unitofwork taking dbcontext as a parameter in the constructor case? passing an initialized context, is it safe at all?  
check asp.net identity as a sample  
* dbcontext -> aanmeldencontext -> resourcepoolmanager?
* generic dbset to resourcepoolrepository?
* remove repositories?
* ElementFields - SortOrder field errors + validations?

* separate web into webclient / webservice
* cors;
http://www.dotnetcurry.com/showarticle.aspx?ID=921
http://msdn.microsoft.com/en-us/magazine/dn532203.aspx
http://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api
* javascript logging; http://jsnlog.com/
* automapper?
* asp.net identity - two factor auth. + account lockout + confirmation + pass reset + security stamp? + social logins + samples
* add multiple fields test
* check [required] attribute for newer classes?
* try to convert other batch files to ps scripts as well
* elmah for glimpse?
* dbcontext.create?
* usermanager - owin parts?
* user.issample field? + web.config         <add key="SampleUserId" value="2" />
* db tables -> [x]set?
* public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager <ApplicationUser> manager) - ?
* check validation cases - null is okay but how about Id check - Id > 0?
* use fluent approach on element + item + field + cell

### Misc

* Update TED link with forCrowd account's version?

## Long Term

### Functional

* default license ratings should be 50/50 and ratings total should always be 100%?
* create sample data with average ratingvalue? or make the rating nullable  
* exclude sample user from rating averages - or make them always 50 / 50?  
* how to calculate average index? some people may enter 1,2,3 - some may enter 100,200,300? always force them to enter percentage?  
or always calculate the total average based on invidiuals percentage? or both?
* in 'not rated index' case, userResourcePool view doesn't show the result
* in'not rated organizations' case, it's collecting the tax but not giving it back? - basically how to treat an organization that doesn't have any rating?

### Technical

* check EF conventions for possible use - rowversion, datetime, id etc?

* pass entity or entityId - check CopySampleDataAsync() method - sourceUserId vs targetUser?

* When creating resourcepool is gives tons of errors but then does the operation and says ok in UI?!

* breeze - check save + has + get + reject changes  
currently they don't work on entity level? - also prepareBatch method?

* learn how and when to use disposable thingy?  
repo + unitofwork + context + controllers?

* handling concurrency can be improved  
load the new record and let the user choose which one is correct

* check whether unit of work classes need merging  
however, in the current structure, every entity will have a unitofwork + controller by default?  
be careful about different contexts entities - license.resourcepool = sampleResourcePool was creating new resource pools!  
either work with Ids, or try to work on merging unitofwork classes  

* multiple pk cases for user element + user resource pool organization + resource pool organization  
* table structure - by this way, userresourcepool could reach to ratings/values easily;  
User - Resourcepool - UserresourcepoolId  
UserResourcePoolElementCell -> UserResourcePoolId ElementCellId?  

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
* html cache break - angular scripts + views etc.?
* using texbox to update chart data didn't work, it breaks the chart?
* use or try to remove scripts.render() + styles.render() from layout.cshtml - then mvc can be removed completely
* automate .tt scripts with afterbuild?
* try to have a standard for css usage + html layout formats + also js script conventions
* check spelling of the texts!
* enable auto test for appveyor - currently it fails probably because it can't create the db?
* __migrationhistory createdon field error - it seems there is not much to do, it also might be about glimpse?
* upgrade to .net 4.5.1?  
http://msdn.microsoft.com/en-us/library/hh925568%28v=vs.110%29.aspx
* what to do these lines; datacontext.js - batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));
* code contracts?
* Install-Package DynamicQuery?
* http://www.hanselman.com/blog/crossbrowserdebuggingintegratedintovisualstudiowithbrowserstack.aspx
* https://www.runscope.com/signup
* html minifier: https://github.com/deanhume/html-minifier
* Install-Package Microsoft.AspNet.WebApi.HelpPage
* karma js tester?
* web api throttling!
* http://smtp4dev.codeplex.com/
* request validation -> html agility pack?
* web.config httpcompression?
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
. remove scripts folder from github? - it's not possible for today / 11 Mar. '15

* how about disabling proxy classes? what will be the difference exactly?

* find method  
public IEnumerable[t] FindBy(System.Linq.Expressions.Expression[func[T, bool]] predicate)  
{ IEnumerable[T] query = _dbset.Where(predicate).AsEnumerable();
return query; }

* odata4  
odata4 upgrade was failed; breeze doesn't support it yet!  
http://damienbod.wordpress.com/2014/06/10/getting-started-with-web-api-and-odata-v4/  
http://blogs.msdn.com/b/webdev/archive/2013/11/01/introducing-batch-support-in-web-api-and-web-api-odata.aspx  

* odata - paging (also filters?)  
querayable vs enablequerysupport  
[Queryable(PageSize=10)]  
var queryAttribute = new QueryableAttribute() { AllowedQueryOptions = AllowedQueryOptions.Top | AllowedQueryOptions.Skip, MaxTop = 100 };
config.EnableQuerySupport(queryAttribute);  

* one to one relation;  
{  
[Key, ForeignKey("Player")]  
public long PlayerId { get; set; }  
public virtual Player Player { get; set; }  
}  

* composite key definition;  

[Key]
[Column(Order = 0)]  
public int LocationID { get; set; }  

[Key]
[Column(Order = 1)]  
public int DayID { get; set; }  

[Key]
[Column(Order = 2)]  
public intTimeID { get; set; }  

[Key]  
[Column(Order = 3)]  
public string LanguageID { get; set; }  

### Misc - Unsorted

* software licenses;
https://www.blackducksoftware.com/resources/data/top-20-open-source-licenses			
http://opensource.org/licenses/category
http://products.office.com/en-us/microsoft-software-license-agreement
http://www.microsoft.com/en-us/legal/intellectualproperty/useterms/default.aspx
http://download.microsoft.com/Documents/UseTerms/Windows_8.1_English_468d3103-64a4-44fa-8f73-23490ee17ea5.pdf

* sector -> industry?	

* angular interceptor for error handling?
http://www.codeproject.com/Articles/857594/MVC-Thorough-Error-Handling		

* using resourcePool initialValue for Basic Sample is not a good idea - it's not on user level?!

* Content related;
dynamic pricing - low price is good but can't be zero because then it's not sustainable as well?

* keep dataContext.js in localStorage?

* elementfield - selectedelement validations + test?

* resourcepoolfield -> incomefield?
total[x] props -> [x]Multiplied?

* cmrp rate visibility or resourcepool has it?
(total) resource pool field incl. CMRP Add. field visibility?

* try to make stores (repositories), managers and controllers (also business objects) testable?
what are the dependencies? work on separation of concerns.
where to create memorydbcontext? on dbobjects or business objects? also do we need IoC framework? ninject looks quite easy but is it necessary?
instead of dataobjects, it should be dataobjects.EF?

* check todo items

* check error handling again, it was handling api errors as well?

---
http://www.asp.net/web-api/overview/testing-and-debugging/mocking-entity-framework-when-unit-testing-aspnet-web-api-2

---
. addfield method should create new elementcells for this new field for the existing items!

. one elementfieldindex per elementfield ?!?!?!
	
. one element can't be selected by multiple fields?

. resourcepoolfield -> incomefield
resourcepooladdition -> resourcepoolfield ?!

. breeze entities - initial values - to prevent !== 'undefined' checks!
. element.js - in objects, create their inner arrays userElementSet[] etc.

. enableresourcepool + enablesubtotals on element?
also resourcepoolrate on element?

. ResourcePoolEditor in a bootsrap panel?

. Odata - Find a better way for readonly props (edmbuilder)?
Also AccountController methods? So WebApi can go forever?

. multitenancy; no need to set User props but handle validation issue
how about user entity itself?
test - what if the user not logged in or not auth.! then what happens to interceptors?
test - userqueryvisitor with filter!

. complete security.permissions on business objects

. _manual contains static 18,2 for decimal

. update packages - especially try odata4 again?

. ? http://blogs.msdn.com/b/webdev/archive/2015/02/11/improve-performance-by-optimizing-queries-for-asp-net-identity-and-other-membership-providers.aspx

. Improve + update tests? Also javascript tests?

. Remove unnecessary methods & props from Business Objects - totalIncome() etc should only be calculated on client-side? then what to test on BL?

. github licenses;
https://developer.github.com/v3/licenses/

. (TOTAL) SALES PRICE INCL. CMRP fields?

. cmrp rate - fixed vs. users' average

. no need to keep decimalvalue + integervalue etc. on cell level - keep all of them in user level
if the owner doesn't allow, then it becomes static anyway - get always the average?
which can be applied to resource pool rate? and index ratings?

* about aggressive method, last operation may not be necessary for one of the types - check excel file!

* check whether it's possible to send email from contact@forcrowd.org? there is no password at the moment? does it necessary to have a different plan for this?
then continue with the other registrations?

* possible error; if one child element will have 2 indexes, UI is not going to work correctly?

* performance problem; especially ratingMultiplied() method called too many times which makes it pretty slow - improve it - find a proper approach to update cached values?
elementItem - ratingMultiplied function should be cached? but then how to update the cache? events & properties etc.?

	* continue with cmrp rate content + summary?
	* users should choose the ideal rate/ratings - it shouldn't be experimental? especially license ratings, index ratings, cmrp rate!
	* eula license?
	https://www.microsoft.com/en-us/legal/intellectualproperty/useterms/default.aspx

	* fair share - it requires some extra work, transparency of the organizations etc. think about it, mention them
	* indexes pie + cmrp rate could use same sample? update each other? like basics?
	* should samples details need to be mentioned? all organizations are equal except the indexes, they all have to have same number of sales etc.

. sendgrid;
https://sendgrid.com/blog/tips-tricks-stay-spam-folder-qa/
https://sendgrid.com/docs/User_Guide/warming_up.html
http://www.mail-tester.com/

. triodos - sign & send;
https://www.triodos.nl/downloads/over-triodos-bank/algemene-bankvoorwaarden-2009-triodos-bank.pdf
https://www.triodos.nl/downloads/betalen/algemene-voorwaarden-internet-bankieren-zakelijk-gebruik-triodos-bank.pdf
https://www.triodos.nl/downloads/betalen/zak-algemene-voorwaarden-triodos-internet-zakenrekening-2011.pdf

wealth is interested in the following questions;
. how the society allocates its resources?
. what type of organizations get more resources?
. room for improvement? - yes
. what would happen if the people could control and allocate the resources directly?

* add & improve all in one sample ?!

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
