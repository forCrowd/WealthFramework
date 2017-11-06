import { RatingMode } from "./resource-pool";
import { TestHelpers } from "./test-helpers";

describe("main/app-entity-manager/entities/resource-pool", () => {

    it("Key: if not set, should be equal to Name", () => {

        var resourcePool = TestHelpers.createResourcePool();

        resourcePool.Name = "name";

        expect(resourcePool.Key).toBe("name");
    });

    it("Key: if set, should stay as it is", () => {

        var resourcePool = TestHelpers.createResourcePool();

        resourcePool.Key = "key";
        resourcePool.Name = "name";

        expect(resourcePool.Key).toBe("key");
    });

    it("toggleRatingMode: RatingMode should be 'All Users' after first call", () => {

        var resourcePool = TestHelpers.createResourcePool();

        resourcePool.toggleRatingMode();

        expect(resourcePool.RatingMode).toBe(RatingMode.AllUsers);
    });

    it("toggleRatingMode: RatingMode should be 'Current User' after second call", () => {

        var resourcePool = TestHelpers.createResourcePool();

        resourcePool.toggleRatingMode();
        resourcePool.toggleRatingMode();

        expect(resourcePool.RatingMode).toBe(RatingMode.CurrentUser);
    });
});
