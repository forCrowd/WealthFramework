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

    incomeUpdated$ = new EventEmitter<number>();

    // Client-side
    private fields: {
        income: number,
    } = {
        income: 0,
    };

    elementCellIndexSet() {
        return this.getElementCellIndexSet(this);
    }

    elementCell(fieldName: string): ElementCell {

        let cell: ElementCell = null;

        for (let elementCellIndex = 0; elementCellIndex < this.ElementCellSet.length; elementCellIndex++) {
            cell = this.ElementCellSet[elementCellIndex];

            if (cell.ElementField.Name === fieldName) {
                break;
            }
        }

        return cell;
    }

    getElementCellSetSorted(): ElementCell[] {
        return this.ElementCellSet.sort((a, b) => (a.ElementField.SortOrder - b.ElementField.SortOrder));
    }

    income() {
        return this.fields.income;
    }

    incomeStatus() {

        const income = +(this.income().toFixed(2));
        const averageIncome = +((this.Element.income() / this.Element.ElementItemSet.length).toFixed(2));

        if (income < averageIncome) {
            return "low";
        } else if (income > averageIncome) {
            return "high";
        }
        return "average";
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Cells
        this.ElementCellSet.forEach(cell => {
            cell.initialize();
        });

        return true;
    }

    rejectChanges(): void {

        // Related cells
        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {
            elementCell.rejectChanges();
        });

        this.entityAspect.rejectChanges();
    }

    remove() {

        const element = this.Element;

        const elementCellSet = this.ElementCellSet.slice();
        elementCellSet.forEach(elementCell => {

            // User element cell
            if (elementCell.UserElementCellSet[0]) {
                elementCell.UserElementCellSet[0].entityAspect.setDeleted();
            }

            // Cell
            elementCell.entityAspect.setDeleted();
        });

        this.entityAspect.setDeleted();

        // Update related
        element.ElementFieldSet.forEach(field => {
            field.setNumericValue();
        });
    }

    setIncome(): void {
        var value = 0;

        this.ElementCellSet.forEach(cell => {
            value += cell.income();
        });

        if (this.fields.income !== value) {
            this.fields.income = value;

            // Update related
            // TODO Is this correct? It looks like it didn't affect anything?
            this.ParentCellSet.forEach(parentCell => {
                parentCell.setIncome();
            });

            this.Element.setIncome();

            this.incomeUpdated$.emit(this.fields.income);
        }
    }

    private getElementCellIndexSet(elementItem: ElementItem) {

        var indexSet: ElementCell[] = [];
        const sortedElementCellSet = elementItem.getElementCellSetSorted();

        sortedElementCellSet.forEach(cell => {

            if (cell.ElementField.IndexEnabled) {
                indexSet.push(cell);
            }

            if (cell.ElementField.DataType === ElementFieldDataType.Element && cell.SelectedElementItem !== null) {
                const childIndexSet = this.getElementCellIndexSet(cell.SelectedElementItem);

                if (childIndexSet.length > 0) {
                    indexSet.push(cell);
                }
            }
        });

        return indexSet;
    }
}
