import { Subject } from "rxjs";

import { EntityBase } from "./entity-base";
import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { RatingMode } from "./project";
import { UserElementField } from "./user-element-field";

export enum ElementFieldDataType {

    // A field that holds string value.
    // Use StringValue property to set its value on ElementItem level.
    String = 1,

    // A field that holds decimal value.
    // Use DecimalValue property to set its value on ElementItem level.
    Decimal = 4,

    // A field that holds another defined Element object within the project.
    // Use SelectedElementItem property to set its value on ElementItem level.
    Element = 6,
}

export class ElementField extends EntityBase {

    // Server-side
    Id = 0;
    Element: Element;
    Name = "";
    DataType = ElementFieldDataType.String;
    SelectedElement: Element;
    UseFixedValue = false;
    RatingEnabled = false;
    SortOrder = 0;
    RatingTotal = 0;
    RatingCount = 0;
    ElementCellSet: ElementCell[];
    UserElementFieldSet: UserElementField[];

    // Client-side
    get DataTypeText(): string {

        let text = ElementFieldDataType[this.DataType];

        if (this.DataType === ElementFieldDataType.Element && this.SelectedElement) {
            text += ` - ${this.SelectedElement.Name}`;
        }

        return text;
    }

    otherUsersRatingTotal = 0;
    otherUsersRatingCount = 0;

    ratingUpdated = new Subject<number>();

    private fields: {
        currentUserRating: number,
        decimalValue: number,
        income: number,
        rating: number,
        ratingPercentage: number,
    } = {
        currentUserRating: 0,
        decimalValue: 0,
        income: 0,
        rating: 0,
        ratingPercentage: 0,
    };

    currentUserRating() {
        return this.fields.currentUserRating;
    }

    income() {
        return this.fields.income;
    }

    rating() {
        return this.fields.rating;
    }

    ratingAverage() { // a.k.a allUsersRating
        return this.ratingCount() === 0 ?
            0 :
            this.ratingTotal() / this.ratingCount();
    }

    ratingCount() {
        return this.otherUsersRatingCount + 1; // There is always default value, increase count by 1
    }

    ratingPercentage() {
        return this.fields.ratingPercentage;
    }

    ratingTotal() {
        return this.otherUsersRatingTotal + this.currentUserRating();
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        // Cells
        this.ElementCellSet.forEach(cell => {
            cell.initialize();
        });

        // Other users'
        this.otherUsersRatingTotal = this.RatingTotal;
        this.otherUsersRatingCount = this.RatingCount;

        // Exclude current user's
        if (this.UserElementFieldSet[0]) {
            this.otherUsersRatingTotal -= this.UserElementFieldSet[0].Rating;
            this.otherUsersRatingCount -= 1;
        }

        // User fields
        this.UserElementFieldSet.forEach(userField => {
            userField.initialize();
        });

        // Initial values
        this.setCurrentUserRating();

        // Event handlers
        this.Element.Project.ratingModeUpdated.subscribe(() => {
            this.setRating();
        });

        return true;
    }

    decimalValue() {
        return this.fields.decimalValue;
    }

    setCurrentUserRating() {

        const value = this.UserElementFieldSet[0]
            ? this.UserElementFieldSet[0].Rating
            : this.RatingEnabled
                ? 50 // Default value for RatingEnabled
                : 0; // Otherwise 0

        if (this.fields.currentUserRating !== value) {
            this.fields.currentUserRating = value;

            // Update related
            this.setRating();
        }
    }

    setIncome() {

        const value = this.Element.familyTree()[0].Project.initialValue * this.ratingPercentage();

        if (this.fields.income !== value) {
            this.fields.income = value;

            // Update related
            this.ElementCellSet.forEach(cell => {
                cell.setIncome();
            });
        }
    }

    setRating() {

        let value = 0; // Default value

        switch (this.Element.Project.RatingMode) {
            case RatingMode.CurrentUser: { value = this.currentUserRating(); break; }
            case RatingMode.AllUsers: { value = this.ratingAverage(); break; }
        }

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            // Update related
            //this.ratingPercentage(); - No need to call this one since element is going to update it anyway! / coni2k - 05 Nov. '17 
            this.Element.familyTree()[0].setRating();

            this.ratingUpdated.next(this.fields.rating);
        }
    }

    setRatingPercentage() {

        const elementRating = this.Element.familyTree()[0].rating();

        const value = elementRating === 0 ? 0 : this.rating() / elementRating;

        if (this.fields.ratingPercentage !== value) {
            this.fields.ratingPercentage = value;

            // Update related
            this.setIncome();
        }
    }

    setDecimalValue() {

        var value = 0;

        this.ElementCellSet.forEach(cell => {
            value += cell.decimalValue();
        });

        if (this.fields.decimalValue !== value) {
            this.fields.decimalValue = value;

            // Update related
            this.ElementCellSet.forEach(cell => {
                cell.setDecimalValuePercentage();
            });
        }
    }
}
