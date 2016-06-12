describe('ng Sanity', function () {

    beforeEach(function () {
    });

    it('Pure', function () {

        expect(0).toBe(0);

    });

    it('Experimental', function () {

        // Just experimental
        var number = 1000000000000000000000000000000000;
        var total = number * number;
        expect(total).toBe(total);

    });
});
