/// <reference path="Commons.js" />

describe('ng-tests ElementItem', function () {

    var $rootScope, ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');

            registerPrototypes($injector);

        });
    });

    it('elementCellIndexSet', function () {

        var resourcePool1 = new ResourcePool();

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // Should have no elements
        expect(item1.elementCellIndexSet().length === 0);

        // Field 1
        var field1 = new ElementField();
        field1.Element = element1;
        field1.IndexEnabled = false;
        element1.ElementFieldSet = [field1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        // Still...
        expect(item1.elementCellIndexSet().length === 0);

        // Field 2
        var field2 = new ElementField();
        field2.Element = element1;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        element1.ElementFieldSet = [field2];

        // Cell 2
        var cell2 = new ElementCell();
        cell2.ElementField = field2;
        cell2.ElementItem = item1;
        field2.ElementCellSet = [cell2];
        item1.ElementCellSet = [cell2];

        // And now 1 item
        expect(item1.elementCellIndexSet().length === 1);
    });

    it('directIncomeCell & directIncome', function () {

        var resourcePool1 = new ResourcePool();

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // Should have no directIncomeCell() and 0 value
        expect(item1.directIncomeCell()).toBe(null);
        expect(item1.directIncome()).toBe(0);

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Now should have the cell
        expect(item1.directIncomeCell()).not.toBe(null);
        expect(item1.directIncome()).toBe(50);

        // TODO Remove case!
    });

    it('multiplierCell & multiplier', function () {

        var resourcePool1 = new ResourcePool();

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // Should have no multiplierCell() and "1" as the default value
        expect(item1.multiplierCell()).toBe(null);
        expect(item1.multiplier()).toBe(1);

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet = [multiplierField];

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        // multiplierCell.NumericValue = 50;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet = [multiplierCell];

        item1.setMultiplier(); // TODO Manually update?!

        // Now should have the cell and value "0" as the default value
        expect(item1.multiplierCell()).not.toBe(null);
        expect(item1.multiplier()).toBe(0);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 2;
        multiplierCell.UserElementCellSet = [userCell];

        item1.setMultiplier(); // TODO Manually update?!

        // Now should have the cell and value "0" as the default value
        expect(item1.multiplierCell()).not.toBe(null);
        expect(item1.multiplier()).toBe(2);

        // TODO Remove case!

    });

    it('totalDirectIncome', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 25;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        expect(item1.totalDirectIncome()).toBe(75);

    });

    it('resourcePoolAmount', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Assert
        expect(item1.resourcePoolAmount()).toBe(5);

    });

    it('totalResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        expect(item1.totalResourcePoolAmount()).toBe(15);

    });

    it('directIncomeIncludingResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Assert
        expect(item1.directIncomeIncludingResourcePoolAmount()).toBe(55);

    });

    it('totalDirectIncomeIncludingResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        expect(item1.totalDirectIncomeIncludingResourcePoolAmount()).toBe(165);

    });

    it('totalResourcePoolIncome', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();
        resourcePool1.InitialValue = 0;

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRating = 100;
        directIncomeField.IndexRatingCount = 1;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        // TODO Actually there is 15 amount in the pool and this item should get them all but because there is no other item,
        // (probably) aggressiveRating calculation fails and it gets 0 amount from the pool.
        // Fix it later / SH - 24 Jul. '15
        expect(item1.totalResourcePoolIncome()).toBe(15);

    });

    it('totalIncome', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();
        resourcePool1.InitialValue = 0;

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRating = 100;
        directIncomeField.IndexRatingCount = 1;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        // TODO Actually there is 15 amount in the pool and this item should get them all but because there is no other item,
        // (probably) aggressiveRating calculation fails and it gets 0 amount from the pool.
        // Fix it later / SH - 24 Jul. '15
        expect(item1.totalIncome()).toBe(165);

    });

    it('incomeStatus', function () {

        // ResourcePool
        var resourcePool1 = new ResourcePool();
        resourcePool1.InitialValue = 0;

        // Element
        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRating = 100;
        directIncomeField.IndexRatingCount = 1;
        element1.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element1;
        multiplierField.ElementFieldType = 12;
        element1.ElementFieldSet = [multiplierField];

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet = [multiplierCell];

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userCell];

        // Assert
        expect(item1.incomeStatus()).toBe('average');

    });

});
