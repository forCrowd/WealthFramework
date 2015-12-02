new cmrp + multiplier field + increase / decrease fails!

move saveElementField fixes under elementfield.js datatype prop!

updateAnonymous changes: if the logged in user has already those entities, it fails!

Alpha team review!

javascript error log

save anon user to db?

since addElementField calls createElementField, it creates related cells immediately, and since the initial type is 'string'
all related userelementcells will only have 'stringvalue' - either update the related cells based on fieldtype selection - create them in saveElementField?

use createEntity in addX cases!

THIS REQUIRES USERID TO BE USED AS WELL?
D:\Development\Projects\GitHub\forCrowd\WealthEconomy\Web\Controllers\OData\Generated\UserElementCellController.cs
if (MainUnitOfWork.Exists(userElementCell.ElementCellId))

// TODO Most of these functions are related with userService.js - updateX functions
// Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
function updateCache() {

also review init() method! - calculateOtherUsersData - isnt that the only thing at the moment? if false, no need to call?

UseFixedValue doesn't work at all! fix it!
also check resourcePool.UseFixedResourcePoolRate case!

objects vs entities

add newly created cmrps to fetchedList in cmrpfactory - and don't use newlyCreated flag

resourepool.currentelement - if null, get the main element from elementset

resourcepool - resourcepoolratetotal, count, ratingcount never null
elementfiel - indexratingtotal, count never null
elementcell - numericvaluecount never null - ONLY numericvaluetotal CAN BE NULL? which can be changed to NOT NULL!

rules
directincome type must use fixed value
multiplier cannot use fixed value

in js files, first list items; vm. - scope.
then implementations?

try to use enums + js entities in add functions + tests

move enums to their related class?

copy from an existing cmrp / template?
how to handle user level data - only copy computed ones?

currently saveChanges in datacontext (and in all factory.js) files, saves all changes, not one particular entity?!

check return conflict() blocks, there's something wrong with them!

replace logger with angular.$log?

content for editor? new content or new resourcepool - how to handle the urls?

. create tests for controllers

. elementfield - indexcalculationtype + indexsortype should have null value?

. field restrictions, one multiplier, one incomefield - server side validation?

. add constructor to client-side entities?
resourcePool.js -> self.ElementSet = []; ?

. info tooltips hover, won't work on mobiles?

. replace {{ with ng-bind?

. https://material.angularjs.org/latest/

. Find a designer! Ozgur's Ali

. Sector index -> priority index!

. asp.net 5?

. social media login?

. Better ratings UI
https://angular-ui.github.io/bootstrap/#/getting_started

. verification email?

. update google analytics on route changes

. url structure ?;
1. resourcePool /[id] -> resourcePool id
2. content /content(or /c)/[id] -> content id
3. account /account/xxx
4. generateds /generated/[entity]/[action]/[id] -> ...

how about users/ organizations/ ?

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
