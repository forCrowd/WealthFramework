(function () {
    'use strict';

    var factoryId = 'ResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', resourcePoolFactory]);

    function resourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(ResourcePool.prototype, 'Name', {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.backingFields._name;
            },
            set: function (value) {

                var oldStripped = this.stripInvalidChars(this.backingFields._name);

                if (this.backingFields._name !== value) {
                    this.backingFields._name = value;

                    // If 'Key' is not a custom value (generated through Name), then keep updating it
                    if (this.Key === oldStripped) {
                        this.Key = value;
                    }
                }
            }
        });

        Object.defineProperty(ResourcePool.prototype, 'Key', {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.backingFields._key;
            },
            set: function (value) {

                var newValue = this.stripInvalidChars(value);

                if (this.backingFields._key !== newValue) {
                    this.backingFields._key = newValue;
                }
            }
        });

        Object.defineProperty(ResourcePool.prototype, 'UseFixedResourcePoolRate', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._useFixedResourcePoolRate; },
            set: function (value) {

                if (this.backingFields._useFixedResourcePoolRate !== value) {
                    this.backingFields._useFixedResourcePoolRate = value;

                    this.setResourcePoolRate();
                }
            }
        });

        // Client-side properties
        Object.defineProperty(ResourcePool.prototype, 'RatingMode', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._ratingMode; },
            set: function (value) {
                if (this.backingFields._ratingMode !== value) {
                    this.backingFields._ratingMode = value;

                    this.setResourcePoolRate();

                    this.ElementSet.forEach(function (element) {

                        element.ElementFieldSet.forEach(function (field) {

                            // Field calculations
                            if (field.IndexEnabled) {
                                field.setIndexRating();
                            }

                            if (!field.UseFixedValue) {
                                field.ElementCellSet.forEach(function (cell) {

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
                }
            }
        });

        // Return
        return ResourcePool;

        function ResourcePool() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.UserId = 0;
            self.InitialValue = 0;
            self.ResourcePoolRateTotal = 0; // Computed value - Used in: setOtherUsersResourcePoolRateTotal
            self.ResourcePoolRateCount = 0; // Computed value - Used in: setOtherUsersResourcePoolRateCount
            self.RatingCount = 0; // Computed value - Used in: resourcePoolEditor.html
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.User = null;
            //self.ElementSet = [];
            //self.UserResourcePoolSet = [];

            // Local variables
            self.backingFields = {
                _currentUserResourcePoolRate: null,
                _isAdded: false,
                _name: '',
                _key: '',
                _otherUsersResourcePoolRateTotal: null,
                _otherUsersResourcePoolRateCount: null,
                _ratingMode: 1, // Only my ratings vs. All users' ratings
                _resourcePoolRate: null,
                _resourcePoolRatePercentage: null,
                _selectedElement: null,
                _useFixedResourcePoolRate: false
            };
            // TODO Move this to field.js?
            self.displayMultiplierFunctions = true; // In some cases, it's not necessary for the user to change multiplier

            // Functions
            self._init = _init;
            self.currentUserResourcePool = currentUserResourcePool;
            self.currentUserResourcePoolRate = currentUserResourcePoolRate;
            self.displayResourcePoolDetails = displayResourcePoolDetails;
            self.displayRatingMode = displayRatingMode;
            self.mainElement = mainElement;
            self.name = name;
            self.otherUsersResourcePoolRateCount = otherUsersResourcePoolRateCount;
            self.otherUsersResourcePoolRateTotal = otherUsersResourcePoolRateTotal;
            self.resourcePoolRate = resourcePoolRate;
            self.resourcePoolRateAverage = resourcePoolRateAverage;
            self.resourcePoolRateCount = resourcePoolRateCount;
            self.resourcePoolRatePercentage = resourcePoolRatePercentage;
            self.resourcePoolRateTotal = resourcePoolRateTotal;
            self.selectedElement = selectedElement;
            self.setCurrentUserResourcePoolRate = setCurrentUserResourcePoolRate;
            self.setOtherUsersResourcePoolRateCount = setOtherUsersResourcePoolRateCount;
            self.setOtherUsersResourcePoolRateTotal = setOtherUsersResourcePoolRateTotal;
            self.setResourcePoolRate = setResourcePoolRate;
            self.setResourcePoolRatePercentage = setResourcePoolRatePercentage;
            self.stripInvalidChars = stripInvalidChars;
            self.toggleRatingMode = toggleRatingMode;
            self.updateCache = updateCache;
            self.urlEdit = urlEdit;
            self.urlView = urlView;

            /*** Implementations ***/

            // Should be called after createEntity or retrieving it from server
            function _init(setComputedFields) {
                setComputedFields = typeof setComputedFields !== 'undefined' ? setComputedFields : false;

                // Set initial values of computed fields
                if (setComputedFields) {

                    var userRatings = [];

                    // ResourcePool
                    self.UserResourcePoolSet.forEach(function (userResourcePool) {
                        self.ResourcePoolRateTotal += userResourcePool.ResourcePoolRate;
                        self.ResourcePoolRateCount += 1;

                        if (userRatings.indexOf(userResourcePool.UserId) === -1) {
                            userRatings.push(userResourcePool.UserId);
                        }
                    });

                    // Fields
                    self.ElementSet.forEach(function (element) {
                        element.ElementFieldSet.forEach(function (elementField) {
                            elementField.UserElementFieldSet.forEach(function (userElementField) {
                                elementField.IndexRatingTotal += userElementField.IndexRating;
                                elementField.IndexRatingCount += 1;

                                if (userRatings.indexOf(userElementField.UserId) === -1) {
                                    userRatings.push(userElementField.UserId);
                                }
                            });

                            // Cells
                            elementField.ElementCellSet.forEach(function (elementCell) {
                                elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                    elementCell.StringValue = ''; // TODO ?
                                    elementCell.NumericValueTotal += userElementCell.DecimalValue; // TODO Correct approach?
                                    elementCell.NumericValueCount += 1;

                                    if (elementField.IndexEnabled) {
                                        if (userRatings.indexOf(userElementCell.UserId) === -1) {
                                            userRatings.push(userElementCell.UserId);
                                        }
                                    }
                                });
                            });
                        });
                    });

                    // Rating count
                    self.RatingCount = userRatings.length;
                }

                // Set otherUsers' data
                self.setOtherUsersResourcePoolRateTotal();
                self.setOtherUsersResourcePoolRateCount();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    self.ElementSet.forEach(function (element) {

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            element.ElementFieldSet.forEach(function (field) {

                                field.setOtherUsersIndexRatingTotal();
                                field.setOtherUsersIndexRatingCount();

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    field.ElementCellSet.forEach(function (cell) {

                                        cell.setOtherUsersNumericValueTotal();
                                        cell.setOtherUsersNumericValueCount();
                                    });
                                }
                            });
                        }
                    });
                }

                updateCache();
            }

            function currentUserResourcePool() {
                return self.UserResourcePoolSet.length > 0 ?
                    self.UserResourcePoolSet[0] :
                    null;
            }

            function currentUserResourcePoolRate() {

                if (self.backingFields._currentUserResourcePoolRate === null) {
                    self.setCurrentUserResourcePoolRate(false);
                }

                return self.backingFields._currentUserResourcePoolRate;
            }

            function displayResourcePoolDetails() {
                return self.selectedElement().directIncomeField() !== null &&
                    self.selectedElement().elementFieldIndexSet().length > 0;
            }

            // Checks whether resource pool has any item that can be rateable
            // Obsolete: Replaced with RatingCount > 0 / coni2k - 21 Feb. '16
            function displayRatingMode() {

                // Check resource pool level first
                if (!self.UseFixedResourcePoolRate) {
                    return true;
                }

                // Field index level
                for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                    var element = self.ElementSet[elementIndex];

                    // If there are multiple indexes, then the users can set index rating
                    if (element.elementFieldIndexSet().length > 1) {
                        return true;
                    }

                    // If there is an index without a fixed value
                    if (element.elementFieldIndexSet().length > 0 && !element.elementFieldIndexSet()[0].UseFixedValue) {
                        return true;
                    }
                }

                return false;
            }

            function mainElement() {
                var result = self.ElementSet.filter(function (element) {
                    return element.IsMainElement;
                });

                return result.length > 0 ? result[0] : null;
            }

            // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersResourcePoolRateCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateCount === null) {
                    self.setOtherUsersResourcePoolRateCount();
                }

                return self.backingFields._otherUsersResourcePoolRateCount;
            }

            // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersResourcePoolRateTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateTotal === null) {
                    self.setOtherUsersResourcePoolRateTotal();
                }

                return self.backingFields._otherUsersResourcePoolRateTotal;
            }

            function resourcePoolRate() {

                if (self.backingFields._resourcePoolRate === null) {
                    self.setResourcePoolRate(false);
                }

                return self.backingFields._resourcePoolRate;
            }

            function resourcePoolRateAverage() {

                if (self.resourcePoolRateCount() === null) {
                    return null;
                }

                return self.resourcePoolRateCount() === 0 ?
                    0 :
                    self.resourcePoolRateTotal() / self.resourcePoolRateCount();
            }

            function resourcePoolRateCount() {
                return self.UseFixedResourcePoolRate ?
                    self.currentUserResourcePool() !== null && self.currentUserResourcePool().UserId === self.UserId ? // If it belongs to current user
                    1 :
                    self.otherUsersResourcePoolRateCount() :
                    self.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
            }

            function resourcePoolRatePercentage() {

                if (self.backingFields._resourcePoolRatePercentage === null) {
                    self.setResourcePoolRatePercentage(false);
                }

                return self.backingFields._resourcePoolRatePercentage;
            }

            function resourcePoolRateTotal() {
                return self.UseFixedResourcePoolRate ?
                    self.currentUserResourcePool() !== null && self.currentUserResourcePool().UserId === self.UserId ? // If it belongs to current user
                    self.currentUserResourcePoolRate() :
                    self.otherUsersResourcePoolRateTotal() :
                    self.otherUsersResourcePoolRateTotal() + self.currentUserResourcePoolRate();
            }

            function selectedElement(value) {

                // Set new value
                if (typeof value !== 'undefined' && self.backingFields._selectedElement !== value) {
                    self.backingFields._selectedElement = value;
                }

                // If there is no existing value (initial state), use mainElement() as the selected
                if (self.backingFields._selectedElement === null && self.mainElement()) {
                    self.backingFields._selectedElement = self.mainElement();
                }

                return self.backingFields._selectedElement;
            }

            function setCurrentUserResourcePoolRate(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserResourcePool() !== null ?
                    self.currentUserResourcePool().ResourcePoolRate :
                    10; // Default value?

                if (self.backingFields._currentUserResourcePoolRate !== value) {
                    self.backingFields._currentUserResourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRate();
                    }
                }
            }

            function setOtherUsersResourcePoolRateCount() {

                self.backingFields._otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateCount--;
                }
            }

            function setOtherUsersResourcePoolRateTotal() {
                self.backingFields._otherUsersResourcePoolRateTotal = self.ResourcePoolRateTotal !== null ?
                    self.ResourcePoolRateTotal :
                    0;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateTotal -= self.currentUserResourcePool().ResourcePoolRate;
                }
            }

            function setResourcePoolRate(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (self.UseFixedResourcePoolRate) {
                    value = self.resourcePoolRateAverage();
                } else {
                    switch (self.RatingMode) {
                        case 1: { value = self.currentUserResourcePoolRate(); break; } // Current user's
                        case 2: { value = self.resourcePoolRateAverage(); break; } // All
                    }
                }

                if (self.backingFields._resourcePoolRate !== value) {
                    self.backingFields._resourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRatePercentage();
                    }
                }
            }

            function setResourcePoolRatePercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolRate() === 0 ?
                    0 :
                    self.resourcePoolRate() / 100;

                if (self.backingFields._resourcePoolRatePercentage !== value) {
                    self.backingFields._resourcePoolRatePercentage = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementSet.forEach(function (element) {

                            element.ElementItemSet.forEach(function (item) {
                                item.setResourcePoolAmount();
                            });
                        });
                    }
                }
            }

            function stripInvalidChars(value) {

                // Trim, remove special chars and replace space with dash
                if (value !== null) {
                    value = value.trim()
                        .replace(/[^-\w\s]/gi, '')
                        .replace(/\s+/g, '-');
                }

                return value;
            }

            function toggleRatingMode() {
                self.RatingMode = self.RatingMode === 1 ? 2 : 1;
            }

            // TODO Most of these functions are related with userService.js - updateX functions
            // Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
            function updateCache() {

                var isUnchanged = false;

                self.setCurrentUserResourcePoolRate();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    self.ElementSet.forEach(function (element) {

                        // TODO Review this later / SH - 24 Nov. '15
                        element.setElementFieldIndexSet();

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            element.ElementFieldSet.forEach(function (field) {

                                if (field.IndexEnabled) {
                                    // TODO Actually index rating can't be set through resourcePoolEdit page and no need to update this cache
                                    // But still keep it as a reminder? / SH - 29 Nov. '15
                                    field.setCurrentUserIndexRating();
                                }

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    field.ElementCellSet.forEach(function (cell) {

                                        switch (cell.ElementField.DataType) {
                                            case 1: {
                                                // TODO Again what a mess!
                                                // StringValue is a computed value, it should normally come from the server
                                                // But in case resource pool was just created, then it should be directly set like this.
                                                // Otherwise, it doesn't show its value on editor.
                                                // And on top of it, since it changes, breeze thinks that 'cell' is modified and tries to send it server
                                                // which results an error. So that's why modified check & acceptChanges parts were added.
                                                // SH - 01 Dec. '15
                                                if (cell.UserElementCellSet.length > 0) {
                                                    isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                    cell.StringValue = cell.UserElementCellSet[0].StringValue;
                                                    if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                                }
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
                                                    // Which is actually not correct but till that its fixed, update it like this / SH - 29 Nov. '15
                                                    // Also check 'What a mess' of StringValue
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

            function urlEdit() {
                return self.urlView() + '/edit';
            }

            function urlView() {
                return '/' + self.User.UserName + '/' + self.Key;
            }
        }
    }
})();