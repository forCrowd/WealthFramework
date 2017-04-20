import { RatingMode, ResourcePool } from "./resource-pool";
import { UserResourcePool } from "./user-resource-pool";
import { TestHelpers } from "./test-helpers";

describe("main/app-entity-manager/entities/resource-pool", () => {

    it("Key: if not set, should be equal to Name", () => {

        var resourcePool = TestHelpers.getResourcePool();

        resourcePool.Name = "name";

        expect(resourcePool.Key).toBe("name");
    });

    it("Key: if set, should stay as it is", () => {

        var resourcePool = TestHelpers.getResourcePool();

        resourcePool.Key = "key";
        resourcePool.Name = "name";

        expect(resourcePool.Key).toBe("key");
    });

    // TODO: UseFixedResourcePoolRate? this.setResourcePoolRate()?

    // TODO: RatingMode - related items calculations!

    // TODO: _init ?

    it("currentUserResourcePool: initially should be null", () => {

        var resourcePool = TestHelpers.getResourcePool();

        expect(resourcePool.currentUserResourcePool()).toBe(null);
    });

    it("currentUserResourcePool: should return first (and only) UserResourcePoolSet item", () => {

        var resourcePool = TestHelpers.getResourcePool();
        var userResourcePool = new UserResourcePool();

        resourcePool.UserResourcePoolSet.push(userResourcePool);

        expect(resourcePool.currentUserResourcePool()).toBe(userResourcePool);
    });

    // TODO: currentUserResourcePoolRate

    it("toggleRatingMode: RatingMode should be 'All Users' after first call", () => {

        var resourcePool = TestHelpers.getResourcePool();

        resourcePool.toggleRatingMode();

        expect(resourcePool.RatingMode).toBe(RatingMode.AllUsers);
    });

    it("toggleRatingMode: RatingMode should be 'Your Ratings' after second call", () => {

        var resourcePool = TestHelpers.getResourcePool();

        resourcePool.toggleRatingMode();
        resourcePool.toggleRatingMode();

        expect(resourcePool.RatingMode).toBe(RatingMode.YourRatings);
    });

    // TODO: Check all these tests below one more time

    it("currentUserResourcePoolRate", () => {

        var resourcePool = TestHelpers.getResourcePool();

        // Case 1: Default value
        expect(resourcePool.currentUserResourcePoolRate()).toBe(10);

        // Case 2: Add new userResourcePool
        resourcePool.UseFixedResourcePoolRate = false;

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool;
        userResourcePool1.ResourcePoolRate = 20;
        resourcePool.UserResourcePoolSet.push(userResourcePool1);

        // TODO Manually update?!
        resourcePool.setCurrentUserResourcePoolRate();

        expect(resourcePool.currentUserResourcePoolRate()).toBe(20);

        // TODO Case 3: Remove userResourcePool

    });

    it("otherUsersResourcePoolRateTotal", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Default value
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(0);

        // Without userResourcePool
        resourcePool1.ResourcePoolRateTotal = 30;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateTotal();

        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

        // With userResourcePool
        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 10;
        resourcePool1.UserResourcePoolSet = [userResourcePool1];

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateTotal();

        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(20);

    });

    it("otherUsersResourcePoolRateCount", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Default value
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(0);

        // Without userResourcePool
        resourcePool1.ResourcePoolRateCount = 2;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateCount();

        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);

        // With userResourcePool
        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 10;
        resourcePool1.UserResourcePoolSet = [userResourcePool1];

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateCount();

        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(1);

    });

    it("resourcePoolRateTotal", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Case 1: Initial value
        expect(resourcePool1.resourcePoolRateTotal()).toBe(10);

        // Case 2: Use fixed cmrp rate true; the value should come from the server (ResourcePoolRateTotal)
        // but it's not defined yet, so total is 0
        resourcePool1.UseFixedResourcePoolRate = true;

        expect(resourcePool1.resourcePoolRateTotal()).toBe(0);

        // Case 3: Define server-side variables
        resourcePool1.ResourcePoolRateTotal = 30;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateTotal();

        expect(resourcePool1.resourcePoolRateTotal()).toBe(30);

        // Case 4: Use fixed cmrp rate false; means the current user also will have a value
        resourcePool1.UseFixedResourcePoolRate = false;

        expect(resourcePool1.resourcePoolRateTotal()).toBe(40);

    });

    it("resourcePoolRateCount", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Case 1: Initial value
        expect(resourcePool1.resourcePoolRateCount()).toBe(1);

        // Case 2: Use fixed cmrp rate true; the value should come from the server (ResourcePoolRateCount)
        // but it's not defined yet, so count is 0
        resourcePool1.UseFixedResourcePoolRate = true;

        expect(resourcePool1.resourcePoolRateCount()).toBe(0);

        // Case 3: Define server-side variables
        resourcePool1.ResourcePoolRateTotal = 30;
        resourcePool1.ResourcePoolRateCount = 2;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateCount();

        expect(resourcePool1.resourcePoolRateCount()).toBe(2);

        // Case 4: Use fixed cmrp rate false; means the current user also will have a value
        resourcePool1.UseFixedResourcePoolRate = false;

        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it("resourcePoolRateAverage", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Case 1: Initial value
        expect(resourcePool1.resourcePoolRateAverage()).toBe(10);

        // Case 2: With server-side variables
        resourcePool1.ResourcePoolRateTotal = 20;
        resourcePool1.ResourcePoolRateCount = 1;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateTotal();
        resourcePool1.setOtherUsersResourcePoolRateCount();

        expect(resourcePool1.resourcePoolRateAverage()).toBe(15);

    });

    it("resourcePoolRate", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        // Case 1: Initial values
        // a. UseFixedResourcePoolRate: false
        // b. RatingMode: 1
        // c. No server variables
        // expect currentUsers' default value: 10
        expect(resourcePool1.resourcePoolRate()).toBe(10);

        // Case 1: UseFixedResourcePoolRate
        // a. UseFixedResourcePoolRate: true
        // b. RatingMode: 1
        // c. No server variables
        // expect 0, since there are no server variables yet
        resourcePool1.UseFixedResourcePoolRate = true;

        expect(resourcePool1.resourcePoolRate()).toBe(0);

        // Case 3: RatingMode
        // a. UseFixedResourcePoolRate: false
        // b. RatingMode: 2
        // c. With server variables
        // expect 20 + 10 (current user's default) / 2
        resourcePool1.ResourcePoolRateTotal = 20;
        resourcePool1.ResourcePoolRateCount = 1;

        // TODO Manually update?!
        resourcePool1.setOtherUsersResourcePoolRateTotal();
        resourcePool1.setOtherUsersResourcePoolRateCount();
        resourcePool1.toggleRatingMode();
        resourcePool1.UseFixedResourcePoolRate = false;

        expect(resourcePool1.resourcePoolRate()).toBe(15);

    });

    it("resourcePoolRatePercentage", () => {

        var resourcePool1 = TestHelpers.getResourcePool();

        expect(resourcePool1.resourcePoolRatePercentage()).toBe(0.1);

    });

});
