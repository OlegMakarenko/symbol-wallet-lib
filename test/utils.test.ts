import { isObject } from '../src/utils';

describe('isObject()', () => {
    it('returns true for object values', () => {
        // Arrange:
        class Foo {}
        const values = [new Foo(), {}, Promise.resolve(), new Error()];

        // Act & Assert:
        values.forEach((objectValue) => {
            expect(isObject(objectValue)).toBe(true);
        });
    });

    it('returns false for non-object values', () => {
        // Arrange:
        const values = [Symbol('foo'), [], () => undefined, Promise.resolve.bind(Promise), 1, null, undefined, 'a'];

        // Act & Assert:
        values.forEach((nonObjectValue) => {
            expect(isObject(nonObjectValue)).toBe(false);
        });
    });
});
