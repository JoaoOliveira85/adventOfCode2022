const maxCalories = require('./calories');

describe('maxCalories', () => {
    test('should return 0 if the array is empty', (done) => {
        function callback(data) {
            expect(data).toBe(0);
            done();
        }

        callback(maxCalories([]));
    });

    test('should return 0 if the array is undefined', (done) => {
        function callback(data) {
            expect(data).toBe(0);
            done();
        }

        callback(maxCalories(undefined));
    });

    test('should return the max value in the array', (done) => {
        function callback(data) {
            expect(data).toBe(100);
            done();
        }

        callback(maxCalories([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]));
    });
});