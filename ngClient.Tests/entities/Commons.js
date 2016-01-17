/// <reference path="../../ngClient/bower_components/angular/angular.min.js" />
/// <reference path="../../ngClient/bower_components/angular-route/angular-route.min.js" />
/// <reference path="../../ngClient/bower_components/angular-sanitize/angular-sanitize.min.js" />
/// <reference path="../../ngClient/bower_components/angular-mocks/angular-mocks.js" />
/// <reference path="../../ngClient/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js" />
/// <reference path="../../ngClient/bower_components/breeze-client/build/breeze.min.js" />
/// <reference path="../../ngClient/bower_components/breeze-client/build/adapters/breeze.bridge.angular.js" />
/// <reference path="../../ngClient/bower_components/toastr/toastr.min.js" />
/// <reference path="../../ngClient/bower_components/highcharts/highcharts.js" />
/// <reference path="../../ngClient/bower_components/highcharts-ng/dist/highcharts-ng.min.js" />
/// <reference path="../../ngClient/app/main.js" />
/// <reference path="../../ngClient/app/logger.js" />
/// <reference path="../../ngClient/app/entities/Element.js" />
/// <reference path="../../ngClient/app/entities/ElementCell.js" />
/// <reference path="../../ngClient/app/entities/ElementField.js" />
/// <reference path="../../ngClient/app/entities/ElementItem.js" />
/// <reference path="../../ngClient/app/entities/ResourcePool.js" />
/// <reference path="../../ngClient/app/entities/UserElementCell.js" />

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
