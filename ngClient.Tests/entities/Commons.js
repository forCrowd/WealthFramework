/// <reference path="../../ngClient/js/lib/lib.js" />
/// <reference path="../../ngClient/bower_components/angular-mocks/angular-mocks.js" />
/// <reference path="../../ngClient/js/app/app.js" />
/// <reference path="../../ngClient/js/appSettings/appSettings.js" />

function registerPrototypes($injector) {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    ResourcePool = $injector.get('ResourcePool');
    ResourcePool.prototype.ElementSet = []; // *
    ResourcePool.prototype.UserResourcePoolSet = []; // *

    Element = $injector.get('Element');
    Element.prototype.ResourcePool = null;
    Element.prototype.ElementFieldSet = []; // *
    Element.prototype.ElementItemSet = []; // *
    Element.prototype.ParentFieldSet = []; // *

    ElementField = $injector.get('ElementField');
    ElementField.prototype.Element = null;
    ElementField.prototype.ElementCellSet = []; // *
    ElementField.prototype.UserElementFieldSet = []; // *

    ElementItem = $injector.get('ElementItem');
    ElementItem.prototype.Element = null;
    ElementItem.prototype.ElementCellSet = []; // *
    ElementItem.prototype.ParentCellSet = []; // *

    ElementCell = $injector.get('ElementCell');
    ElementCell.prototype.ElementField = null;
    ElementCell.prototype.ElementItem = null;
    ElementCell.prototype.UserElementCellSet = []; // *

    // * A friendly reminder for a while;
    // With this prototype definition, array is a shared prop between the objects
    // Set a new array before using it, instead of push()
}

function UserResourcePool() {
    var self = this;
    self.ResourcePool = null;
    self.ResourcePoolRate = 0;
}

function UserElementField() {
    var self = this;
    self.Element = null;
    self.Rating = 0;
}
