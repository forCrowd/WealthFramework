continue with resourcepoolratetotal + count + rating count initial / update scenarios
then field indexratingtotal, count
then cell stringvalue, numericvaluetotal, numericvaluecount

test resourcepool init

fix newly added cmrp edit + cancel case!
1. create a temp user and actually save the stuff?
2. use acceptChanges() + if it's a new cmrp, before saving it, change it to 'added'

continue with saveElementCell() - resourcePoolEditController.js

anon version - stringvalue etc. computed fields fail!-
if this will be okay, no need to retrieve resource pool from server (and remove saved resource pool from cache)

refresh on these;
http://localhost:15001/resourcePool/-2
http://localhost:15001/resourcePool/-2/edit

updateCache & init() functions may ignore field(index), since there is no way of updating it in resourcePoolEdit?

and last (?!!??!?!) check this;

                        // TODO Why this needs to be done, it's not clear
                        // but without it (even if the resource pool will be retrieved from the server), elementFieldIndexSet() can have detached fields
                        // Check it later / SH - 24 Nov. '15
                        // TODO This actually is in init(), but should it be here?
                        //element.setElementFieldIndexSet();

and laastt (?!) - do this better pls?
        function elementFieldIndexEnabledChanged() {
            vm.elementField.IndexCalculationType = vm.elementField.IndexEnabled ? 1 : 0;
            vm.elementField.IndexSortType = vm.elementField.IndexEnabled ? 1 : 0;
        }

use createEntity in addX cases!

db update!
merge with master!

---
// TODO Most of these functions are related with userService.js - updateX functions
// Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
function updateCache() {

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

. Alpha team review!

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
