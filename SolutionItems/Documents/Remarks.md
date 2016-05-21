Remarks about the projects, external libraries etc.

* ng-show / if: if it will be on/off frequently (and takes time to render), use show
if it will be drawn once based on a certain condition and probably it will not change its state, use if?
* aspnet 5: It seems it's not ready or at least not easy to publish at the moment / coni2k - 28 Jan. '16
* webApi auth: Cookieauth was necessary to use browser to reach auth pages - elmah.axd for instance and /api/..
* google analytics: Apparently ignoring localhost + test filters only works for future visits?
* source-map: original position name & column props are null
* server-side controller: return Ok(string.Empty); With just Ok(), it return the response with no content-type. Apparetnly Firefox default for no content-type is xml and logs 'no element found' message on console.
* client-side entities: set initial values (userElementSet[] etc.) to prevent !== 'undefined' checks! - breeze doens't allow this
* breeze: dataContext.js - Don't forget to update these lines batches.push(manager.getEntities(['Element'], [breeze.EntityState.Deleted]));
* breeze: fetchEntityByKey 'User' - EntityQuery.from 'Users'
* breeze save queuing for concurrent saves http://www.getbreezenow.com/documentation/concurrent-saves
 tried this but should be improved. Before calling saveChanges function, we set each modified entities'
 RowVersion property in prepareSaveBatches function in dataContext.js. And this function is getting
 called before queuing operation, which means it stores outdated (invalid RowVersion) entities
 (normally after save operation it was updating local entity with RowVersion that comes from the server)
 and in the second call it returns 'Conflict' error message.
