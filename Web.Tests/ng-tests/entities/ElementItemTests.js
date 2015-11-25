/// <reference path="Commons.js" />

describe('ng ElementItem', function () {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');
            UserElementCell = $injector.get('UserElementCell');

            registerPrototypes($injector);

        });
    });

    it('elementCellIndexSet', function () {

        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Should have no elements
        expect(item1.elementCellIndexSet().length === 0).toBe(true);

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.IndexEnabled = false;
        element.ElementFieldSet = [field1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        // Still...
        expect(item1.elementCellIndexSet().length === 0).toBe(true);

        // Field 2
        var field2 = new ElementField();
        field2.Element = element;
        field2.DataType = 4;
        field2.IndexEnabled = true;
        element.ElementFieldSet = [field2];

        // Cell 2
        var cell2 = new ElementCell();
        cell2.ElementField = field2;
        cell2.ElementItem = item1;
        field2.ElementCellSet = [cell2];
        item1.ElementCellSet = [cell2];

        // TODO Manually update?!
        item1.setElementCellIndexSet();

        // And now 1 item
        expect(item1.elementCellIndexSet().length === 1).toBe(true);
    });

    it('directIncome', function () {

        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Should have 0 value
        expect(item1.directIncome()).toBe(0);

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // TODO Manually update?!
        item1.setDirectIncome();

        expect(item1.directIncome()).toBe(50);

        // TODO Remove case!
    });

    it('multiplierCell & multiplier', function () {

        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Should have "1" as the default value
        expect(item1.multiplier()).toBe(1);

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet = [multiplierField];

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        // multiplierCell.NumericValueTotal = 50;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet = [multiplierCell];

        // TODO Manually update?!
        item1.setMultiplier();

        // Now should have "0" as the default value
        expect(item1.multiplier()).toBe(0);

        // User multiplier cell
        userCell = new UserElementCell();
        userCell.ElementCell = multiplierCell;
        userCell.DecimalValue = 2;
        multiplierCell.UserElementCellSet = [userCell];
        //multiplierCell.CurrentUserCell = userCell;

        // TODO Manually update?!
        item1.setMultiplier();

        // Now should "2" as the default value
        expect(item1.multiplier()).toBe(2);

        // TODO Remove case!

    });

    it('totalDirectIncome', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 25;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet.push(multiplierField);

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
        //multiplierCell.CurrentUserCell = userCell;

        // Assert
        expect(item1.totalDirectIncome()).toBe(75);

    });

    it('resourcePoolAmount', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Assert
        expect(item1.resourcePoolAmount()).toBe(5);

    });

    it('totalResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet.push(multiplierField);

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
        //multiplierCell.CurrentUserCell = userCell;

        // Assert
        expect(item1.totalResourcePoolAmount()).toBe(15);

    });

    it('directIncomeIncludingResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Assert
        expect(item1.directIncomeIncludingResourcePoolAmount()).toBe(55);

    });

    it('totalDirectIncomeIncludingResourcePoolAmount', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet.push(multiplierField);

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
        //multiplierCell.CurrentUserCell = userCell;

        // Assert
        expect(item1.totalDirectIncomeIncludingResourcePoolAmount()).toBe(165);

    });

    it('totalResourcePoolIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        expect(item1.totalResourcePoolIncome()).toBe(0);

        // Case 2: Add the fields and cells
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;
        element.ElementFieldSet = [directIncomeField];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell;
        userMultiplierCell1.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userMultiplierCell1];
        //multiplierCell.CurrentUserCell = userMultiplierCell1;

        // Assert
        expect(item1.totalResourcePoolIncome()).toBe(15);

    });

    it('totalIncome', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();
        resourcePool.InitialValue = 0;

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet.push(multiplierField);

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
        //multiplierCell.CurrentUserCell = userCell;

        // Assert
        expect(item1.totalIncome()).toBe(165);

    });

    it('incomeStatus', function () {

        // ResourcePool
        var resourcePool = new ResourcePool();
        resourcePool.InitialValue = 0;

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.DataType = 12;
        element.ElementFieldSet = [multiplierField];

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
        //multiplierCell.CurrentUserCell = userCell;

        // Assert
        expect(item1.incomeStatus()).toBe('average');

        // TODO Try this with a second item?

    });

});
