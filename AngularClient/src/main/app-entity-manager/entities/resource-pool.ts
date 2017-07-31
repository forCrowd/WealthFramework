import { EventEmitter } from "@angular/core";

import { Element } from "./element";
import { ElementCell } from "./element-cell";
import { ElementField } from "./element-field";
import { EntityBase } from "./entity-base";
import { User } from "./user";
import { UserResourcePool } from "./user-resource-pool";
import { stripInvalidChars } from "../../utils";

export interface IUniqueKey {
    username: string;
    resourcePoolKey: string;
}

export enum RatingMode {
    CurrentUser = 1,
    AllUsers = 2
}

export class ResourcePool extends EntityBase {

    // Server-side
    Id: number = 0;
    User: User;

    get Name(): string {
        return this.fields.name;
    }
    set Name(value: string) {
        if (this.fields.name !== value) {
            var oldStripped = stripInvalidChars(this.fields.name);
            this.fields.name = value;

            if (this.initialized) {

                // If "Key" is not a custom value (generated through Name), then keep updating it
                if (this.Key === oldStripped) {
                    this.Key = value;
                }
            }
        }
    }

    get Key(): string {
        return this.fields.key;
    }
    set Key(value: string) {
        var newValue = stripInvalidChars(value);

        if (this.fields.key !== newValue) {
            this.fields.key = newValue;
        }
    }

    Description: string;
    InitialValue: number = 0;

    get UseFixedResourcePoolRate(): boolean {
        return this.fields.useFixedResourcePoolRate;
    }
    set UseFixedResourcePoolRate(value: boolean) {
        if (this.fields.useFixedResourcePoolRate !== value) {
            this.fields.useFixedResourcePoolRate = value;

            if (this.initialized) {
                this.setResourcePoolRate();
            }
        }
    }

    ResourcePoolRateTotal: number = 0; // Used in: setOtherUsersResourcePoolRateTotal
    ResourcePoolRateCount: number = 0; // Used in: setOtherUsersResourcePoolRateCount
    RatingCount: number = 0;
    ElementSet: Element[];
    UserResourcePoolSet: UserResourcePool[];

    // Client-side
    get RatingMode(): RatingMode {
        return this.fields.ratingMode;
    }
    set RatingMode(value: RatingMode) {

        if (this.fields.ratingMode !== value) {
            this.fields.ratingMode = value;

            this.setResourcePoolRate();

            this.ElementSet.forEach((element) => {

                element.ElementFieldSet.forEach((field) => {

                    // Field calculations
                    if (field.IndexEnabled) {
                        field.setIndexRating();
                    }

                    if (!field.UseFixedValue) {
                        field.ElementCellSet.forEach((cell) => {

                            // Cell calculations
                            switch (field.DataType) {
                                case 2:
                                case 3:
                                case 4:
                                // TODO 5 (DateTime?)
                                case 11:
                                case 12: {
                                    cell.setNumericValue();
                                    break;
                                }
                            }
                        });
                    }
                });
            });

            // Raise rating mode updated event
            this.ratingModeUpdated.emit(value);
        }
    }

    get uniqueKey(): IUniqueKey {

        if (!this.initialized) {
            return null;
        }

        return {
            username: this.User.UserName,
            resourcePoolKey: this.Key
        };
    }

    ratingModeUpdated: EventEmitter<RatingMode> = new EventEmitter<RatingMode>();

    private fields: {
        currentUserResourcePoolRate: number,
        isAdded: boolean,
        key: string,
        name: string,
        otherUsersResourcePoolRateTotal: number,
        otherUsersResourcePoolRateCount: number,
        ratingMode: number, // Only my ratings vs. All users" ratings
        resourcePoolRate: number,
        resourcePoolRatePercentage: number,
        selectedElement: Element,
        useFixedResourcePoolRate: boolean
    } = {
        currentUserResourcePoolRate: null,
        isAdded: false,
        key: "",
        name: "",
        otherUsersResourcePoolRateTotal: null,
        otherUsersResourcePoolRateCount: null,
        ratingMode: 1, // Only my ratings vs. All users" ratings
        resourcePoolRate: null,
        resourcePoolRatePercentage: null,
        selectedElement: null,
        useFixedResourcePoolRate: false
    };

    _init() {

        // Set otherUsers" data
        this.setOtherUsersResourcePoolRateTotal();
        this.setOtherUsersResourcePoolRateCount();

        // Elements
        this.ElementSet.forEach((element: Element) => {

            // Fields
            element.ElementFieldSet.forEach((field: ElementField) => {

                field.setOtherUsersIndexRatingTotal();
                field.setOtherUsersIndexRatingCount();

                // Cells
                field.ElementCellSet.forEach((cell: ElementCell) => {

                    cell.setOtherUsersNumericValueTotal();
                    cell.setOtherUsersNumericValueCount();
                });
            });
        });

        this.updateCache();
    }

    currentUserResourcePool(): UserResourcePool {
        return this.UserResourcePoolSet.length > 0 ?
            this.UserResourcePoolSet[0] :
            null;
    }

    currentUserResourcePoolRate() {

        if (this.fields.currentUserResourcePoolRate === null) {
            this.setCurrentUserResourcePoolRate(false);
        }

        return this.fields.currentUserResourcePoolRate;
    }

    displayResourcePoolDetails() {
        return this.selectedElement().directIncomeField() !== null &&
            this.selectedElement().elementFieldIndexSet().length > 0;
    }

    mainElement(): Element {
        var result = this.ElementSet.filter((element: Element) => element.IsMainElement);

        return result.length > 0 ? result[0] : null;
    }

    // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersResourcePoolRateCount() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersResourcePoolRateCount === null) {
            this.setOtherUsersResourcePoolRateCount();
        }

        return this.fields.otherUsersResourcePoolRateCount;
    }

    // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersResourcePoolRateTotal() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersResourcePoolRateTotal === null) {
            this.setOtherUsersResourcePoolRateTotal();
        }

        return this.fields.otherUsersResourcePoolRateTotal;
    }

    remove() {

        // Related elements
        var elementSet = this.ElementSet.slice();
        elementSet.forEach((element) => {
            element.remove();
        });

        // Related user resource pools
        this.removeUserResourcePool();

        this.entityAspect.setDeleted();
    }

    removeUserResourcePool() {

        var currentUserResourcePool = this.currentUserResourcePool();

        if (currentUserResourcePool !== null) {
            currentUserResourcePool.entityAspect.setDeleted();

            // Update the cache
            this.setCurrentUserResourcePoolRate();
        }
    }

    resourcePoolRate() {

        if (this.fields.resourcePoolRate === null) {
            this.setResourcePoolRate(false);
        }

        return this.fields.resourcePoolRate;
    }

    resourcePoolRateAverage() {

        if (this.resourcePoolRateCount() === null) {
            return null;
        }

        return this.resourcePoolRateCount() === 0 ?
            0 :
            this.resourcePoolRateTotal() / this.resourcePoolRateCount();
    }

    resourcePoolRateCount() {
        return this.UseFixedResourcePoolRate ?
            this.currentUserResourcePool() !== null ? // If it belongs to current user
                1 :
                this.otherUsersResourcePoolRateCount() :
            this.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
    }

    resourcePoolRatePercentage() {

        if (this.fields.resourcePoolRatePercentage === null) {
            this.setResourcePoolRatePercentage(false);
        }

        return this.fields.resourcePoolRatePercentage;
    }

    resourcePoolRateTotal() {
        return this.UseFixedResourcePoolRate ?
            this.currentUserResourcePool() !== null ? // If it belongs to current user
                this.currentUserResourcePoolRate() :
                this.otherUsersResourcePoolRateTotal() :
            this.otherUsersResourcePoolRateTotal() + this.currentUserResourcePoolRate();
    }

    selectedElement(value?: Element) {

        // Set new value
        if (typeof value !== "undefined" && this.fields.selectedElement !== value) {
            this.fields.selectedElement = value;
        }

        // If there is no existing value (initial state), use mainElement() as the selected
        if (this.fields.selectedElement === null && this.mainElement()) {
            this.fields.selectedElement = this.mainElement();
        }

        return this.fields.selectedElement;
    }

    setCurrentUserResourcePoolRate(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.currentUserResourcePool() !== null ?
            this.currentUserResourcePool().ResourcePoolRate :
            10; // Default value?

        if (this.fields.currentUserResourcePoolRate !== value) {
            this.fields.currentUserResourcePoolRate = value;

            // Update related
            if (updateRelated) {
                this.setResourcePoolRate();
            }
        }
    }

    setOtherUsersResourcePoolRateCount() {

        this.fields.otherUsersResourcePoolRateCount = this.ResourcePoolRateCount;

        // Exclude current user's
        if (this.currentUserResourcePool() !== null) {
            this.fields.otherUsersResourcePoolRateCount--;
        }
    }

    setOtherUsersResourcePoolRateTotal() {
        this.fields.otherUsersResourcePoolRateTotal = this.ResourcePoolRateTotal !== null ?
            this.ResourcePoolRateTotal :
            0;

        // Exclude current user's
        if (this.currentUserResourcePool() !== null) {
            this.fields.otherUsersResourcePoolRateTotal -= this.currentUserResourcePool().ResourcePoolRate;
        }
    }

    setResourcePoolRate(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: number;

        if (this.UseFixedResourcePoolRate) {
            value = this.resourcePoolRateAverage();
        } else {
            switch (this.RatingMode) {
                case 1: { value = this.currentUserResourcePoolRate(); break; } // Current user's
                case 2: { value = this.resourcePoolRateAverage(); break; } // All
            }
        }

        if (this.fields.resourcePoolRate !== value) {
            this.fields.resourcePoolRate = value;

            // Update related
            if (updateRelated) {
                this.setResourcePoolRatePercentage();
            }
        }
    }

    setResourcePoolRatePercentage(updateRelated?: boolean) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.resourcePoolRate() === 0
            ? 0
            : this.resourcePoolRate() / 100;

        if (this.fields.resourcePoolRatePercentage !== value) {
            this.fields.resourcePoolRatePercentage = value;

            // Update related
            if (updateRelated) {
                this.ElementSet.forEach((element) => {
                    element.ElementItemSet.forEach((item) => {
                        item.setResourcePoolAmount();
                    });
                });
            }
        }
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === RatingMode.CurrentUser
            ? RatingMode.AllUsers
            : RatingMode.CurrentUser;
    }

    // TODO Most of these functions are related with userService.js - updateX functions
    // Try to merge these two - Actually try to handle these actions within the related entity / coni2k - 27 Nov. '15
    updateCache() {

        var isUnchanged = false;

        this.setCurrentUserResourcePoolRate();

        // Elements
        if (typeof this.ElementSet !== "undefined") {
            this.ElementSet.forEach((element) => {

                // TODO Review this later / coni2k - 24 Nov. '15
                element.setElementFieldIndexSet();

                // Fields
                if (typeof element.ElementFieldSet !== "undefined") {
                    element.ElementFieldSet.forEach((field) => {

                        if (field.IndexEnabled) {
                            // TODO Actually index rating can't be set through resourcePoolEdit page and no need to update this cache
                            // But still keep it as a reminder? / coni2k - 29 Nov. '15
                            field.setCurrentUserIndexRating();
                        }

                        // Cells
                        if (typeof field.ElementCellSet !== "undefined") {
                            field.ElementCellSet.forEach((cell) => {

                                switch (cell.ElementField.DataType) {
                                    case 1: {
                                        // TODO Again what a mess!
                                        // StringValue is a computed value, it should normally come from the server
                                        // But in case resource pool was just created, then it should be directly set like this.
                                        // Otherwise, it doesn't show its value on editor.
                                        // And on top of it, since it changes, breeze thinks that "cell" is modified and tries to send it server
                                        // which results an error. So that's why modified check & acceptChanges parts were added.
                                        // coni2k - 01 Dec. '15
                                        //if (cell.UserElementCellSet.length > 0) {
                                        //    isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                        //    cell.StringValue = cell.UserElementCellSet[0].StringValue;
                                        //    if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                        //}
                                        break;
                                    }
                                    case 2:
                                    case 3:
                                    case 4:
                                        // TODO DateTime?
                                        {
                                            cell.setCurrentUserNumericValue();
                                            break;
                                        }
                                    case 11:
                                        {
                                            // TODO DirectIncome is always calculated from NumericValueTotal
                                            // Which is actually not correct but till that its fixed, update it like this / coni2k - 29 Nov. '15
                                            // Also check "What a mess" of StringValue
                                            if (cell.UserElementCellSet.length > 0) {
                                                isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                cell.NumericValueTotal = cell.UserElementCellSet[0].DecimalValue;
                                                if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                            }

                                            cell.setCurrentUserNumericValue();
                                            break;
                                        }
                                    case 12:
                                        {
                                            cell.ElementItem.setMultiplier();

                                            if (cell.ElementField.IndexEnabled) {
                                                cell.setNumericValueMultiplied();
                                            }

                                            break;
                                        }
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}
