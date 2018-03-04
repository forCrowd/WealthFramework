import { RatingMode } from "./project";
import { TestHelpers } from "./test-helpers";

describe("main/core/entities/resource-pool", () => {

    it("toggleRatingMode: RatingMode should be 'All Users' after first call", () => {

        var project = TestHelpers.createProject();

        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.AllUsers);
    });

    it("toggleRatingMode: RatingMode should be 'Current User' after second call", () => {

        var project = TestHelpers.createProject();

        project.toggleRatingMode();
        project.toggleRatingMode();

        expect(project.RatingMode).toBe(RatingMode.CurrentUser);
    });
});
