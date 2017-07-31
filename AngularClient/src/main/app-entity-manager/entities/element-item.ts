import { EventEmitter } from "@angular/core";

import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { ElementFieldDataType } from "./element-field";

export class ElementItem extends EntityBase {

    // Server-side
    Id: number = 0;
    Element: Element;
    Name: string = "";
    ElementCellSet: ElementCell[];
    ParentCellSet: ElementCell[];

    totalIncomeUpdated$ = new EventEmitter<number>();

    private fields: {
        // Client-side
        elementCellIndexSet: ElementCell[],
        directIncome: number,
        multiplier: number,
        totalDirectIncome: number,
        resourcePoolAmount: number,
        totalIncome: number,
        totalResourcePoolAmount: number,
        totalResourcePoolIncome: number
    } = {
        // Client-side
        elementCellIndexSet: null,
        directIncome: null,
        multiplier: null,
        totalDirectIncome: null,
        resourcePoolAmount: null,
        totalIncome: 0,
        totalResourcePoolAmount: null,
        totalResourcePoolIncome: null
    };

    directIncome() {
        if (this.fields.directIncome === null) {
            this.setDirectIncome(false);
        }

        return this.fields.directIncome;
    }

    directIncomeIncludingResourcePoolAmount() { // A.k.a Sales Price incl. VAT
        return this.directIncome() + this.resourcePoolAmount();
    }

    elementCellIndexSet() {

        if (this.fields.elementCellIndexSet === null) {
            this.setElementCellIndexSet();
        }

        return this.fields.elementCellIndexSet;
    }

    elementCell(fieldName: string): ElementCell {

        var cell: ElementCell = null;

        for (var elementCellIndex = 0; elementCellIndex < this.ElementCellSet.length; elementCellIndex++) {
            cell = this.ElementCellSet[elementCellIndex];

            if (cell.ElementField.Name === fieldName) {
                break;
            }
        }

        return cell;
    }

    getElementCellIndexSet(elementItem: ElementItem) {

        var indexSet: ElementCell[] = [];
        var sortedElementCellSet = elementItem.getElementCellSetSorted();

        sortedElementCellSet.forEach((cell) => {

            if (cell.ElementField.IndexEnabled) {
                indexSet.push(cell);
            }

            if (cell.ElementField.DataType === ElementFieldDataType.Element && cell.SelectedElementItem !== null) {
                var childIndexSet = this.getElementCellIndexSet(cell.SelectedElementItem);

                if (childIndexSet.length > 0) {
                    indexSet.push(cell);
                }
            }
        });

        return indexSet;
    }

    getElementCellSetSorted(): ElementCell[] {
        return this.ElementCellSet.sort((a, b) => (a.ElementField.SortOrder - b.ElementField.SortOrder));
    }

    incomeStatus() {

        var totalIncome = this.totalIncome();
        // TODO Make rounding better, instead of toFixed + number
        var averageIncome = +this.Element.totalIncomeAverage().toFixed(2);

        if (totalIncome === averageIncome) {
            return "average";
        } else if (totalIncome < averageIncome) {
            return "low";
        } else if (totalIncome > averageIncome) {
            return "high";
        }
    }

    multiplier() {

        if (this.fields.multiplier === null) {
            this.setMultiplier(false);
        }

        return this.fields.multiplier;
    }

    rejectChanges(): void {

        // Related cells
        var elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach((elementCell) => {
            elementCell.rejectChanges();
        });

        this.entityAspect.rejectChanges();
    }

    remove() {

        // Related cells
        var elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach((elementCell) => {
            elementCell.remove();
        });

        this.entityAspect.setDeleted();
    }

    resourcePoolAmount() {

        if (this.fields.resourcePoolAmount === null) {
            this.setResourcePoolAmount(false);
        }

        return this.fields.resourcePoolAmount;
    }

    setDirectIncome(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        // First, find direct income cell
        var directIncomeCell: ElementCell = null;

        var result = this.ElementCellSet.filter((elementCell) => elementCell.ElementField.DataType === ElementFieldDataType.DirectIncome);

        if (result.length > 0) {
            directIncomeCell = result[0];
        }

        var value: number;
        if (directIncomeCell === null) {
            value = 0;
        } else {
            value = directIncomeCell.numericValue();
        }

        if (this.fields.directIncome !== value) {
            this.fields.directIncome = value;

            // Update related
            if (updateRelated) {
                this.setTotalDirectIncome();
                this.setResourcePoolAmount();
            }
        }
    }

    setElementCellIndexSet() {
        this.fields.elementCellIndexSet = this.getElementCellIndexSet(this);
    }

    setMultiplier(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        // First, find the multiplier cell
        var multiplierCell: ElementCell = null;

        var result = this.ElementCellSet.filter((elementCell) => elementCell.ElementField.DataType === ElementFieldDataType.Multiplier);

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
            } else { // Else, user's
                value = multiplierCell.currentUserCell().DecimalValue;
            }
        }

        if (this.fields.multiplier !== value) {
            this.fields.multiplier = value;

            // Update related
            this.setTotalDirectIncome();
            this.setTotalResourcePoolAmount();
        }
    }

    setResourcePoolAmount(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.directIncome() * this.Element.ResourcePool.resourcePoolRatePercentage();

        if (this.fields.resourcePoolAmount !== value) {
            this.fields.resourcePoolAmount = value;

            // TODO Update related
            if (updateRelated) {
                this.setTotalResourcePoolAmount();
            }
        }
    }

    setTotalDirectIncome(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.directIncome() * this.multiplier();

        if (this.fields.totalDirectIncome !== value) {
            this.fields.totalDirectIncome = value;

            // TODO Update related
            if (updateRelated) {

            }
        }
    }

    setTotalResourcePoolAmount(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.resourcePoolAmount() * this.multiplier();

        if (this.fields.totalResourcePoolAmount !== value) {
            this.fields.totalResourcePoolAmount = value;

            // TODO Update related
            if (updateRelated) {

            }
        }
    }

    totalDirectIncome() {

        if (this.fields.totalDirectIncome === null) {
            this.setTotalDirectIncome(false);
        }

        return this.fields.totalDirectIncome;
    }

    totalDirectIncomeIncludingResourcePoolAmount() { // A.k.a Total Sales Price incl. VAT
        return this.directIncomeIncludingResourcePoolAmount() * this.multiplier();
    }

    totalIncome() {

        // TODO Make rounding better, instead of toFixed + number
        var totalIncome = +(this.totalDirectIncome() + this.totalResourcePoolIncome()).toFixed(2);

        if (this.fields.totalIncome !== totalIncome) {
            this.fields.totalIncome = totalIncome;
            this.totalIncomeUpdated$.emit(this.fields.totalIncome);
        }

        return this.fields.totalIncome;
    }

    totalResourcePoolAmount() {

        if (this.fields.totalResourcePoolAmount === null) {
            this.setTotalResourcePoolAmount(false);
        }

        return this.fields.totalResourcePoolAmount;
    }

    // TODO This is out of pattern!
    totalResourcePoolIncome() {

        var value = 0;

        this.ElementCellSet.forEach((cell) => {
            value += cell.indexIncome();
        });

        if (this.fields.totalResourcePoolIncome !== value) {
            this.fields.totalResourcePoolIncome = value;

            // Update related
            // TODO Is this correct? It looks like it didn't affect anything?
            this.ParentCellSet.forEach((parentCell) => {
                parentCell.setIndexIncome();
            });
        }

        return value;
    }
}
