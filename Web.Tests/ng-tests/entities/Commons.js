/// <reference path="../../../Web/Scripts/angular.js" />
/// <reference path="../../../Web/Scripts/angular-route.js" />
/// <reference path="../../../Web/Scripts/angular-sanitize.js" />
/// <reference path="../../../Web/Scripts/angular-mocks.js" />
/// <reference path="../../../Web/Scripts/breeze.debug.js" />
/// <reference path="../../../Web/Scripts/breeze.bridge.angular.js" />
/// <reference path="../../../Web/Scripts/toastr.js" />
/// <reference path="../../../Web/App/external/highcharts.js" />
/// <reference path="../../../Web/App/external/highcharts-ng.js" />
/// <reference path="../../../Web/App/external/ui-bootstrap-tpls-0.13.0.min.js" />
/// <reference path="../../../Web/App/main.js" />
/// <reference path="../../../Web/App/logger.js" />
/// <reference path="../../../Web/App/entities/Element.js" />
/// <reference path="../../../Web/App/entities/ElementCell.js" />
/// <reference path="../../../Web/App/entities/ElementField.js" />
/// <reference path="../../../Web/App/entities/ElementItem.js" />
/// <reference path="../../../Web/App/entities/ResourcePool.js" />
/// <reference path="../../../Web/App/entities/UserElementCell.js" />

function registerPrototypes($injector) {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    ResourcePool = $injector.get('ResourcePool');
    ResourcePool.prototype.InitialValue = 0;
    ResourcePool.prototype.ResourcePoolRateTotal = 0;
    ResourcePool.prototype.ResourcePoolRateCount = 0;
    ResourcePool.prototype.MainElement = null;
    ResourcePool.prototype.ElementSet = []; // *
    ResourcePool.prototype.UserResourcePoolSet = []; // *

    Element = $injector.get('Element');
    Element.prototype.ResourcePool = null;
    Element.prototype.ResourcePoolMainElementSubSet = []; // *
    Element.prototype.ElementFieldSet = []; // *
    Element.prototype.ElementItemSet = []; // *
    Element.prototype.ParentFieldSet = []; // *

    ElementField = $injector.get('ElementField');
    ElementField.prototype.UseFixedValue = false;
    ElementField.prototype.IndexRatingSortType = 1;
    ElementField.prototype.SortOrder = 0;
    ElementField.prototype.IndexRatingTotal = 0;
    ElementField.prototype.IndexRatingCount = 0;
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
    ElementCell.prototype.NumericValueTotal = 0;
    ElementCell.prototype.NumericValueCount = 0;
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
