### Release Notes

**0.38.3**

* userFactory.js - updateX functions detached entity bug fix

**0.38.2**

* CMRP Edit - New element field uses resourcePoolFactory.createElementField now
* New element cells don't get saved fix
updateCache function was using accept changes only if the elementcell wasn't modified earlier, which was causing a problem if element cell was in isAdded state.
Now that's changed into only if element cell was previously in unchanged state.

**0.38.1**

* CMRP Edit - New element field Index Enabled change doesn't set related properties fix
* CMRP Edit - New element field DirectIncome data type will always be UseFixedValue true
* CMRP Edit - New element field Multiplier data type will always be UseFixedValue false (fixed)

**0.38**

* Anonymous CMRP create / edit
LocationItem object was created to hold the newly created resource pools, so it can navigate back to correct Id that's been retrieved from the server
* Anonymous user login fix
If the user logs in after interacting as an 'anonymous user', changes will be saved as that logged in user's
* Element.IsMainElement instead of ResourcePool MainElement (back to previous method)
* ResourcePool.CurrentElement property was replaced with selectedElement function
* Server-side properties were added to javascript objects, except Navigation Properties (due to breezejs error)

**0.37**

* Resource Pool create / edit feature was added
* ElementField - ElementFieldType was renamed to DataType, IndexType was renamed to IndexCalculationType, IndexRatingSortType was renamed to IndexSortType
* Adding a default 'Name' field approach was removed
* enumKey angular filter was added: Probably this enum operations can be done in a better way
but right now this is the easiest way to save the day.
* dataContext.js createEntity() was updated to a synchronous function again
Creating sample entities was too difficult & complex with async. function
metadataReady() function is now called under initializeStore() and it doesn't wait for the result.
To fix this issue permanently;
https://github.com/angular/angular.js/issues/4003
* (An empty) robots.txt was created
* File & folder / url structure updates
* highcharts updates
* angular-ui-bootstrap updates for deprecated directives
* New / edit entity view bug fix

**0.36.2**

* ElementItem name was updated to 250 chars
* Content updates

**0.36.1**

* angular-numberSymbol filter
* OtherUsers' values calculation bug fix
* Content updates

**0.36**

* Billion Dollar Question
* ElementField - IndexType property was added
There are two types; Aggressive (existing) & Passive
Passive case covers CMRPs that only use Initial value (like Billion Dollar Question)
* Content updates

**0.35.2**

* Content updates

**0.35.1**

* Upgraded to Visual Studio 2015 & .NET Framework 4.6
* nuget package updates were installed
* SolutionItems/Notes folder was renamed to Documents
* ResourcePoolEditor - label as badge toggle color fix
* Setup instructions were updated

**0.35**

* Performance Update: Most of the calculations (numericValue, passiveRating, aggressiveRating, indexIncome etc. functions) are cached
and they only calculated when there is an actually change in one of the related values.
All in One sample increase multiplier action was reduced under a second from 7 seconds.
* Further with javascript tests & entities cleanup
* resourcePool, elementField, elementCell - other users' average properties were merged with other users' total
* element.js - parents() was renamed to familyTree() & parent() returns null if there is no actual parent (instead of self)
* Javascript tests array fix; initial push() lines were replaced with assignments (.array = [object])
* ResourcePool - ResourcePoolRate was renamed to ResourcePoolRateTotal
* ElementField - IndexRating was renamed to IndexRatingTotal
* ElementCell - NumericValue was renamed to NumericValueTotal

**0.34.1**

* ResourcePoolRate calculation fix
* Minor updates

**0.34**

* Hosting plan upgrade
* New javascript tests

**0.33**

* Cache breaker value update (033 -> 0.33)
* Other users' properties calculation fixes (again)

**0.32**

* angular unit testing: Node.js, Chutzpah, Jasmine
* Other users' properties calculation fixes
* BusinessObjects cleanup

**0.31**

* https://github.com/forCrowd/WealthEconomy/issues/50
* https://github.com/forCrowd/WealthEconomy/issues/25
* Label as on / off badge was created

**0.30**

* Tooltips for resource pool editor
* ResourcePool EnableResourcePoolAddition was renamed to UseFixedResourcePoolRate
* ResourcePool EnableSubtotals field was removed
* angular-ui-bootstrap instead of bootstrap.js
* Content updates

**0.29.2**

* https://github.com/forCrowd/WealthEconomy/issues/8
* Logo was added to footer

**0.29.1**

* Minor content updates

**0.29**

* https://github.com/forCrowd/WealthEconomy/issues/15
* https://github.com/forCrowd/WealthEconomy/issues/48
* https://github.com/forCrowd/WealthEconomy/issues/49
* https://github.com/forCrowd/WealthEconomy/issues/12
* https://github.com/forCrowd/WealthEconomy/issues/14

**0.28**

* https://github.com/forCrowd/WealthEconomy/issues/27

**0.27.1**

* https://github.com/forCrowd/WealthEconomy/issues/46
* https://github.com/forCrowd/WealthEconomy/issues/47

**0.27**

* https://github.com/forCrowd/WealthEconomy/issues/40
* https://github.com/forCrowd/WealthEconomy/issues/26
* https://github.com/forCrowd/WealthEconomy/issues/39
* https://github.com/forCrowd/WealthEconomy/issues/41
* https://github.com/forCrowd/WealthEconomy/issues/16
* https://github.com/forCrowd/WealthEconomy/issues/42
* https://github.com/forCrowd/WealthEconomy/issues/43
* https://github.com/forCrowd/WealthEconomy/issues/44
* https://github.com/forCrowd/WealthEconomy/issues/45
* https://github.com/forCrowd/WealthEconomy/issues/6

**0.26**

* https://github.com/forCrowd/WealthEconomy/issues/37
* https://github.com/forCrowd/WealthEconomy/issues/38

**0.25**

* https://github.com/forCrowd/WealthEconomy/issues/34
* https://github.com/forCrowd/WealthEconomy/issues/35
* https://github.com/forCrowd/WealthEconomy/issues/36

**0.24**

* Reset cases of user level data was improved
* Composite keys were used in User level tables, Id fields were removed
* Initial_Manual migration drop function fix
* Package updates

**0.23**

* ResourcePool MainElement instead of Element.IsMainElement
* All projects were upgraded to .NET 4.5.1
* Todo cleanup & moving items to GitHub "Issues"

**0.22.3**

* fetched fix for user logged out case

**0.22.2**

* Change password fix
* SeedInitialData method updates & fixes

**0.22.1**

* introductionController increaseMultiplier timer definition before resourcePool fix

**0.22**

* Registration alert email
* AppSettings.cs to Framework

**0.21**

* Invalid CMRP Id case

**0.20**

* MVC clean-up
* Improvements for Error, 404 cases

**0.19.1**

* finally block was used in getUserInfo() method of sample controllers to prevent loading resource pools before determining whether there is a user or not
* Social media etc. cleanup

**0.19**

* Cache breaking attempt
* BundleConfig.cs scripts, styles were moved to layout.cshtml

**0.18.1**

* resourcePoolService expanded methods can now query local as well
* basicsController & introductionController invalid service method call fix
* basicsController timer fix
* Other timer adjustments

**0.18**

* Delayed save feature was added. resourcePoolEditor actions will be saved after a second.
* Web - External components (gratipay, flattr, twitter etc.) was moved to js files and also disabled in case of localhost

**0.17.2**

* Multitenancy: It raises an exception if the request is not authenticated
* Copying sample user's data as the initial values will not be used anymore, angular objects will handle it.
* Web loginController.js $rootScope fix
* Content updates
* Code cleanup

**0.17.1**

* Multitenancy: "Sequence contains more than one element" temporary fix for User level tables

**0.17**

* ResourcePoolEditor isAuthenticated check for buttons
* routeRun() & locationHistory array was added to remember and navigate back after register & login operations

**0.16.1**

* IsAuthenticated fix for ResourcePool - UserResourcePool property
* Total Cost Index sample Id fix
* elementItem multiplierValue default value 0 doesn't work for Index Income field, which is an issue but will be fixed later. For now default value is 1 again
* Hid "Save failed" log messages

**0.16**

* ResourcePool samples could be retrieved without authorization now
* CopySampleDataAsync in UserStore also copies sample field index values
* createEntity cases implemented for userResourcePool, userElementCell and userElementFieldIndex entities
* Paypal logo update

**0.15**

* Twitter, Facebook, GitHub, LinkedIn, Google Plus, Youtube Channel, Disqus, Flattr, Gratipay accounts were created
* MIT License was added
* It's Open Source & Encourage Us contents were updated / added
* Google Analytics was added

**0.14.18**

* Content updates etc.

**0.14.17**

* Transferred to forCrowd

**0.14.16**

* bootstrap panel for resourcePoolEditor
* Content updates
* summary.html, contribute.html, feedback.html were added

**0.14.15**

* Bug fixes

**0.14.14**

* One item in the element index income fix
* Text updates

**0.14.13**

* Index income calculation fixes
* Text and sample updates
* ResourcePoolEditor currentElement fullSize property to determine the place of chart (on top or left side of the items)

**0.14.12**

* CMRP Rate is back
* CMRP Rate sample was added
* Aggressive Rating method was introduced; now the organizations with the lowest rating don't get any share from the pool.
Related issue with 'Total Cost Index - New Model' sample was fixed
* Knowledge Index sample charts fix
* Samples minor updates
* chapter0 content blocks are now separate html files and called from home.html by using ng-include. chapter0 was removed.
* highcharts scripts were copied to local
* resourcePoolEditor layout updates

**0.14.11**

* Indexes Pie
* resourcePoolEditor layout updates
* resourcePoolEditor.css was created and both .css & .html files moved under 'directives' folder
* Web - SecurityConfig, debug auth was disabled due to conflict with Bearer token auth. - Will be checked later

**0.14.10**

* Total Cost Index was updated
* Fair Share Index was added

**0.14.9**

* UserElementCell table has now BooleanValue, IntegerValue, DecimalValue, DateTimeValue like ElementCell. Rating column was dropped
* ResourcePoolIndex was changed to ElementFieldIndex
* Multiplier cell value is now on user level (UserElementCell) instead of a fixed value (ElementCell)
* ElementFieldIndex is now on User level, instead of UserResourcePool
* SortOrder field was added to ElementField
* resourcePoolEditor angular directive
* InitialValue on ResourcePool class
* sessionStorage was replaced with localStorage to keep "access_token"
* Azure websites is back again; http://wealth.azurewebsites.net
* Register for error messages fix
* editView.tt 
** Both nullable and non-nullable boolean type will be rendered as radio input
** 'Cancel' type was changed to 'button' type instead of 'submit' and service.cancelChanges() method was removed
* LazyLoading was disabled
* breeze RowVersion property issue was fixed
* Extending the breeze's entities, instead of DTOs from WebApi, WebApi DTOs were removed
* Element drill up & down for ResourcePoolEditor directive
* Web - CustomAuthentication filter with debug user (for OData query tests)
* DataObjects - DropCreateAlways & MigrateToLatest combo db initializer
* DataObjects - Multitenancy;
http://xabikos.com/multitenant/application%20design/software%20as%20a%20service/2014/11/17/create-a-multitenant-application-with-entity-framework-code-first---part-1.html
* Old chapters were removed, chapter0 became home page for now

**0.14.8**

* BusinessObjects.Tests project was created
* Framework.Tests project was created - TypeExtensionsTests & ValidationTests classes were added
* More fluent interface
* Business Objects, constructors with parameters
* TotalCostIndex sample fix

**0.14.7**

* Clean-up
 * ElementItemElementField was renamed to ElementCell
 * Long property names were shortened
* Package updates & breeze - Microsoft AspNet WebApi OData 5.3.x conflict fix
* Warm-up script was converted to PowerShell + gitignore was modified for WarmUpResult.txt
* Version number fix; 0.14.6.1 -> 0.14.7
* Exception handling & Elmah
* IdentityUser & User classes merge
* Switched to SQL Server 2014 Express LocalDB
* Cookie authentication was disabled and bearer token is now the only method
* tt files were updated with Identity
* ValidationErrors on client-side
* Mvc general & 404 error handling
* Azure websites; http://wealth.azurewebsites.net
* Local Restore Database sql script (experimental)
* Unit testing improvements
* Bit of fluent interface
* Part of the initial sample data was updated according to the latest updates
* Chapters visible again, although some one the pages still need to be updated

**0.14.6**

* Clean-up; Organization and related parts were removed

**0.14.5**

* Element parent - child structure was partially added

**0.14.4**

* IsMainElement field was added to Element table
* ResourcePool and Multiplier field types were added; Element table was replaced Organization table

**0.14.3**

* ProductionCost field was removed from Organization table

**0.14.2**

* Element Fields feature was added with string, boolean, int32, decimal, datetime types & highest to lowest, lowest to highest sort options
* TotalCostIndex, DynamicOrganizationIndex and DynamicElementIndex types were removed since it's possible to handle them with DynamicFieldIndex now

**0.14.1**

* Clean-up

**0.14**

* Elements feature was added
* Knowledge Index & License combo was replaced with Element & ElementItem & DynamicElementIndex
* Sector Index & Sector combo was replaced with Dynamic(Organization)Index
* Web - manageScripts.js + manageMenu.js
* Total Cost + Dynamic Element index tests were added

**0.13.7**

* Clean-up

**0.13.6**

* Sector + Knowledge + Total Cost indexes were moved under ResourcePoolIndex

**0.13.5**

* IndexIncome calculation was modified
* WeightedAverage -> Percentage
* NumberOfSalesPercentage was added

**0.13.4**

* Quality + Employee + Custom static indexes were removed
* accountEditController - id route parameter was replaced with using userService.getUserInfo
* README.md fine-tuning

**0.13.3**

* Web - UserResourcePool custom list + view

**0.13.2**

* Web - angular route was simplified + folder & file name structure was updated

**0.13.1**

* DistanceIndex field was removed from UserResourcePool
* Nuget auto package restore
* Sample data creation order was changed; Sector, Knowledge, TotalCost, Quality, Employee, Customer
* Chapter4 + Chapter5 fixes
* login error fix

**0.13**

* Introduction to Dynamic Indexes
* DistanceIndex was removed in from calculations, field will be removed later on
* IndexShare property calculation bug fixed
* Property naming updates
* SectorChart page was removed

**0.12.4**

* BusinessObjects minor revisions

**0.12.3**

* UserResourcePool unique index on UserId + ResourcePoolId
* appveyor.yml

**0.12.2**

* BusinessObjects and Metadata classes merge

**0.12.1**

* BusinessObjects revisions
* UserResourcePool ResourcePoolType was removed

**0.12**

* Chapters - Since it's not good enough, it's hidden in the menu
* TotalCostIndex calculation is now based on Sales Price again, instead of Profit

**0.11.12**

* Text updates

**0.11.11**

* AccountEdit page instead of using the generic user edit, to be able customize it like removing cancel button etc.
* Reset sample data function added

**0.11.10**

* Replace metadata.xml with EdmBuilder CodeFirst output
** WealthEconomyContext moved under BusinessObjects
* IsSample field to ResourcePool object, SampleUserId to Web\web.config and UserUnitOfWork now uses these parameters to copy the sample data

**0.11.9**

* TotalCostIndex calculation is now based on Profit, instead of Sales Price
* Sample data values were updated (.25 vs .75)
* All in One sample was re-enabled
* Sample user was created and sample data moved under this account
* UserResourcePool pages subtotals were fixed
* ODataController.tt fine-tuning
* User - AspNetUserId required

**0.11.8**

* UserResurcePoolCustom api controller was created and special methods moved to this controller from OData
* New UserResourcePool save failed issue was fixed

**0.11.7**

* UnitOfWork methods are now saving the changes at the end. Save method is not public any more
* DecreaseNumberOfSales method was implemented
* SectorChart page only shows Sector resource pool related data + negative values fix
* DataObjects.Tests project was removed
* tt output files were removed from Web project's publish output

**0.11.6**

* Cascade delete option enabled
* Sample child records will be added when creating a new ResourcePool, Sector, License, Organization, User ResourcePool entities

**0.11.5**

* Database seed method was updated to add sample records
* UserUnitOfWork insert method was synced with latest updates
* Initial admin password updated

**0.11.4**

* 'Definition controllers are only accessible to admins' rule didn't work, removed. Check this later on.

**0.11.3**

* UserResourcePoolEdit page fix

**0.11.2**

* ResourcePoolId field was removed from Organization table

**0.11.1**

* README.md and Release Notes.txt files merged

**0.11**

* HighCharts implementation: SectorChart page

**0.10.9**

* T4 files update to use IdentityContext
 * Dependencies folder was created under Framework - T4 folder, that contains IdentityContext libraries
* EntityFramework.dll + EntityFramework.SqlServer.dll files under  
C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE folder  
were replaced with Entity Framework 6.1 versions.

**0.10.8**

* MSBuild and IISExpress script files were created
* UserAccountType.cs file and its references were removed
* WealthEconomyContext and AspNetIdentityContext were merged
* Initial admin role + user + password

**0.10.7**

* breeze.js - metadataReady method in dataContext

**0.10.6**

* Concurrency check - RowVersion field was added to all entities and in ODataController it does a concurrency check for Patch operation

**0.10.5**

* routing fixes
 * if it's supported, angular html5Mode is on
 * href fixes
 * mvc routing always goes to HomeController, so angular can handle the requests

**0.10.4**

* glimpse nuget package - only for development environment for now
* Thanks to glimpse, <clear /> line was added to connectionstrings section in config files

**0.10.3**

* Nuget package updates

**0.10.2**

* Register + ChangePassword pages

**0.10.1**

* Session state related files + codes were removed
* Password, UserAccountTypeId fields were removed from User table
* Alterations folder was removed from SolutionItems
* Authorization filter was added to all Api controllers, Register action in AccountController was set to AllowAnonymous
* Administrator role was introduced - All definition Controller were put under "Administrator" role except "User" controller
* BaseController was created and ODataController.tt was modified to create BaseEntityControllers
* CodeTemplates folder was removed

**0.10.0**

* Asp.Net Identity

**0.9.2**

* BusinessObjects
 * Merge generated and custom classes
 * BaseEntity class
 * Clean up + fine-tuning
* Framework - T4 files fixes

**0.9.1**

* BusinessObjects - StringLength attributes

**0.9**

* Application
 * Converted to Code First approach from Database First
     * T4 files were updated to read from Code First metadata
     * EF6.Utility.cs was moved to the solution
 * Switched to LocalDb instead of SQL Server 2008 R2
 * T4 include files are now under Framework\T4 folder

**0.8.1**

* Web - Cleaning up the old mvc controllers + views etc.

**0.8**

* Database
 * ResourcePool table became the main container for Organization, License and Sector tables
 * UserResourcePoolOrganization was dropped and UserOrganization was introduced

**0.7**

* SPA with OData + AngularJS + Breeze.js + toastr.js
* Database - Sector table Id field switched to smallint from byte
* Solution - Refactoring tt files
* Solution - nuget package updates

**0.6.3**

* Web - Overview text update

**0.6.2**

* Web - Overview text update

**0.6.1**

* BusinessObjects - Required attribute for Dto classes

**0.6**

* Facade - UnitOfWork fine-tuning
* General - Password for User table + basic authentication
* Web - Controller.tt was created

**0.5**

* SolutionItems - Local_UpdateDatabase.sql was updated to remove doktrosizlar db items
* Business + DataObjects
 * To support tables with multiple primary key, IEntity interface Id property was replaced with IsNew
* Web - Controllers fine-tuning

**0.4.2**.2

* General - Missing files were restored - attempt #2

**0.4.2**.1

* General - Missing files were restored

**0.4.2**

* General - github repo merge

**0.4.1**

* General - Release Notes.txt was updated

**0.4**

* DataObjects
 * Utility.ttinclude: Common code blocks from t4 files were moved to this file
 * Repositories were updated
* BusinessObjects
 * Metadata.t4 was moved under "Generated" folder and was modified to generated the files for once.
* Facade
 * UnitOfWork classes were created for each entity
* Web
 * Repositories + UnitOfWork updates
* General
 * config files connectionstrings were updated
 * github repository reset

**0.3**

* BusinessObjects
 * OrganizationGroupType was renamed to UserResourcePoolType
 * UserDistributionIndexRatingAverage class was merged into UserResourcePool
 * BusinessObjectsDto.t4 was add to be able create Dto classes
 * OrganizationGroupType was renamed to UserResourcePoolType
* Web
 * Number of ratings info was added to CMRP views
 * Create / Edit operations were modified to use Dto classes
* Database + General
 * UserResourcePool table ResourcePoolRate field percentage update - values were divided to 100

**0.2**

* Database + General
 * ResourcePool + ResourcePoolOrganization + UserResourcePool + UserResourcePoolOrganization tables were added
 * User table ResourcePoolRate was removed
 * UserDistributionIndexRating table was removed
 * UserOrganizationRating table was removed
* General - Versioning method was updated: Minor version number will be increased in every update

**0.1.9**.1 - 06 Mar '14

* Web + SolutionItems - Minor description text update

**0.1.9** - 06 Mar '14

* SolutionItems - Maintenance scripts
* Database
 * Organization table UserId + NumberOfSales fields were removed
 * UserOrganizationRating table NumberOfSales field was added
 * All tables CreatedOn + ModifiedOn default values
* Web
 * Quality Private + Public views
 * Sector Private + Public views
 * Employee Satisfaction Private + Public views
 * Customer Satisfaction Private + Public views
 * All in One Private + Public views

**0.1.8** - 04 Mar '14

* General - User Notes field
* General - User account type + web menu items visibility based on the type
* Web - ServerMode + DevelopmentModeConfig for auto login
* Web - Knowledge Index Private + Public views

**0.1.6** - 19 Feb '14

* Database - Organization table UserId field: To solve "Increase + Reset Number of Sales" issue, organizations are now under users
* Web - UserController Create method generates sample data for the new user
* Web - ResourcePool views are now listing user's organizations

**0.1.5** - 01 Feb '14

* Web - Distance Index
* Web - Edit user back button fix
* Minor fixes + updates

**0.1.4** - 31 Jan '14

* Database - User table ResourcePoolRate field
* Web - Login + logout + edit user
* Web - All In One view

**0.1.3** - 29 Jan '14

* Web - CMRP Reports
* Web - Menu update

**0.1.2** - 28 Jan '14

* DataObjects - Organization - NumberOfSales field added
* Web - CMRPReport + Total Cost Index calculations
* Web - Home + menu updates

**0.1.1** - 24 Jan '14

* .gittattributes file
* Initial solution commit
* Update README.md
* Initial commit
