// Test Utilities:
import { expect } from './index';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.project:', () => {
        it('should process a tsconfig.json file', () => {
            const files = tsquery.project('./tsconfig.json');

            expect(files.length).to.equal(142);
        });

        it('should find a tsconfig.json file in a director', () => {
            const files = tsquery.project('./');

            expect(files.length).to.equal(142);
        });

        it(`should handle when a path doesn't exist`, () => {
            const files = tsquery.project('./boop');

            expect(files.length).to.equal(0);
        });
    });
});
