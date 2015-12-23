content for editor? new content or new resourcepool - content in a content? or page as a new entity?
url structure:
/[username]/articles/[article name] - prevents duplicate article name - readable, but too long?
/article/[articleId] - universal, short but unreadable?

facebook - /[username]/videos/[videoid]
twitter - /[username]/statuc/[tweetid]
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

Sector index -> priority index!

social media login?

save anon user to db?

---
angular 1.5 component?

before sending any email to user, check whether it's confirmed?

confirmEmail etc. pages should be behind authorization? handle it in a generic way? the user should access these pages without logging in?

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
