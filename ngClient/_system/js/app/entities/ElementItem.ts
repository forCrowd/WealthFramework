//import { LoggerService } from "../ng2/services/logger";

export function elementItemFactory(logger: any) {

    // Return
    return ElementItem;

    function ElementItem() {

        var self = this;

        // Server-side
        self.Id = 0;
        self.ElementId = 0;
        self.Name = "";
        // TODO breezejs - Cannot assign a navigation property in an entity ctor
        //self.Element = null;
        //self.ElementCellSet = [];
        //self.ParentCellSet = [];

        // Local variables
        self.backingFields = {
            _elementCellIndexSet: null,
            _directIncome: null,
            _multiplier: null,
            _totalDirectIncome: null,
            _resourcePoolAmount: null,
            _totalResourcePoolAmount: null,
            _totalResourcePoolIncome: null
        };

        // Functions
        self.directIncome = directIncome;
        self.directIncomeIncludingResourcePoolAmount = directIncomeIncludingResourcePoolAmount;
        self.elementCellIndexSet = elementCellIndexSet;
        self.incomeStatus = incomeStatus;
        self.multiplier = multiplier;
        self.resourcePoolAmount = resourcePoolAmount;
        self.setDirectIncome = setDirectIncome;
        self.setElementCellIndexSet = setElementCellIndexSet;
        self.setMultiplier = setMultiplier;
        self.setResourcePoolAmount = setResourcePoolAmount;
        self.setTotalDirectIncome = setTotalDirectIncome;
        self.setTotalResourcePoolAmount = setTotalResourcePoolAmount;
        self.totalDirectIncome = totalDirectIncome;
        self.totalDirectIncomeIncludingResourcePoolAmount = totalDirectIncomeIncludingResourcePoolAmount;
        self.totalIncome = totalIncome;
        self.totalResourcePoolAmount = totalResourcePoolAmount;
        self.totalResourcePoolIncome = totalResourcePoolIncome;

        /*** Implementations ***/

        function directIncome() {

            if (self.backingFields._directIncome === null) {
                self.setDirectIncome(false);
            }

            return self.backingFields._directIncome;
        }

        function directIncomeIncludingResourcePoolAmount() { // A.k.a Sales Price incl. VAT
            return self.directIncome() + self.resourcePoolAmount();
        }

        function elementCellIndexSet() {

            if (self.backingFields._elementCellIndexSet === null) {
                self.setElementCellIndexSet();
            }

            return self.backingFields._elementCellIndexSet;
        }

        function getElementCellIndexSet(elementItem: any) {

            var indexSet = [];
            var sortedElementCellSet = elementItem.ElementCellSet.sort((a, b) => (a.ElementField.SortOrder - b.ElementField.SortOrder));

            sortedElementCellSet.forEach(cell => {

                if (cell.ElementField.IndexEnabled) {
                    indexSet.push(cell);
                }

                if (cell.ElementField.DataType === 6 && cell.SelectedElementItem !== null) {
                    var childIndexSet = getElementCellIndexSet(cell.SelectedElementItem);

                    if (childIndexSet.length > 0) {
                        indexSet.push(cell);
                    }
                }
            });

            return indexSet;
        }

        function incomeStatus() {

            var totalIncome = self.totalIncome();
            // TODO Make rounding better, instead of toFixed + number
            var averageIncome = Number(self.Element.totalIncomeAverage().toFixed(2));

            if (totalIncome === averageIncome) {
                return "average";
            } else if (totalIncome < averageIncome) {
                return "low";
            } else if (totalIncome > averageIncome) {
                return "high";
            }
        }

        function multiplier() {

            if (self.backingFields._multiplier === null) {
                self.setMultiplier(false);
            }

            return self.backingFields._multiplier;
        }

        function resourcePoolAmount() {

            if (self.backingFields._resourcePoolAmount === null) {
                self.setResourcePoolAmount(false);
            }

            return self.backingFields._resourcePoolAmount;
        }

        function setDirectIncome(updateRelated: any) {
            updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

            // First, find direct income cell
            var directIncomeCell = null;

            var result = self.ElementCellSet.filter(elementCell => (elementCell.ElementField.DataType === 11));

            if (result.length > 0) {
                directIncomeCell = result[0];
            }

            var value;
            if (directIncomeCell === null) {
                value = 0;
            } else {
                value = directIncomeCell.numericValue();
            }

            if (self.backingFields._directIncome !== value) {
                self.backingFields._directIncome = value;

                // Update related
                if (updateRelated) {
                    self.setTotalDirectIncome();
                    self.setResourcePoolAmount();
                }
            }
        }

        function setElementCellIndexSet() {
            self.backingFields._elementCellIndexSet = getElementCellIndexSet(self);
        }

        function setMultiplier(updateRelated: any) {
            updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

            // First, find the multiplier cell
            var multiplierCell = null;

            var result = self.ElementCellSet.filter(elementCell => (elementCell.ElementField.DataType === 12));

            if (result.length > 0) {
                multiplierCell = result[0];
            }

            var value = 0;

            // If there is no multiplier field defined on this element, return 1, so it can return calculate the income correctly
            // TODO Cover "add new multiplier field" case as well!
            if (multiplierCell === null) {
                value = 1;
            } else {

                // If there is a multiplier field on the element but user is not set any value, return 0 as the default value
                if (multiplierCell.currentUserCell() === null ||
                    multiplierCell.currentUserCell().DecimalValue === null) {
                    value = 0;
                } else { // Else, user"s
                    value = multiplierCell.currentUserCell().DecimalValue;
                }
            }

            if (self.backingFields._multiplier !== value) {
                self.backingFields._multiplier = value;

                // Update related
                self.setTotalDirectIncome();
                self.setTotalResourcePoolAmount();
            }
        }

        function setResourcePoolAmount(updateRelated: any) {
            updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

            var value = self.directIncome() * self.Element.ResourcePool.resourcePoolRatePercentage();

            if (self.backingFields._resourcePoolAmount !== value) {
                self.backingFields._resourcePoolAmount = value;

                // TODO Update related
                if (updateRelated) {
                    self.setTotalResourcePoolAmount();
                }
            }
        }

        function setTotalDirectIncome(updateRelated: any) {
            updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

            var value = self.directIncome() * self.multiplier();

            if (self.backingFields._totalDirectIncome !== value) {
                self.backingFields._totalDirectIncome = value;

                // TODO Update related
                if (updateRelated) {

                }
            }
        }

        function setTotalResourcePoolAmount(updateRelated: any) {
            updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

            var value = self.resourcePoolAmount() * self.multiplier();

            if (self.backingFields._totalResourcePoolAmount !== value) {
                self.backingFields._totalResourcePoolAmount = value;

                // TODO Update related
                if (updateRelated) {

                }
            }
        }

        function totalDirectIncome() {

            if (self.backingFields._totalDirectIncome === null) {
                self.setTotalDirectIncome(false);
            }

            return self.backingFields._totalDirectIncome;
        }

        function totalDirectIncomeIncludingResourcePoolAmount() { // A.k.a Total Sales Price incl. VAT
            return self.directIncomeIncludingResourcePoolAmount() * self.multiplier();
        }

        function totalIncome() {
            var totalIncome = self.totalDirectIncome() + self.totalResourcePoolIncome();
            // TODO Make rounding better, instead of toFixed + number
            return Number(totalIncome.toFixed(2));
        }

        function totalResourcePoolAmount() {

            if (self.backingFields._totalResourcePoolAmount === null) {
                self.setTotalResourcePoolAmount(false);
            }

            return self.backingFields._totalResourcePoolAmount;
        }

        // TODO This is out of pattern!
        function totalResourcePoolIncome() {

            var value = 0;

            self.ElementCellSet.forEach(cell => {
                value += cell.indexIncome();
            });

            if (self.backingFields._totalResourcePoolIncome !== value) {
                self.backingFields._totalResourcePoolIncome = value;

                // Update related
                // TODO Is this correct? It looks like it didn"t affect anything?
                self.ParentCellSet.forEach(parentCell => {
                    parentCell.setIndexIncome();
                });
            }

            return value;
        }

    }
}
