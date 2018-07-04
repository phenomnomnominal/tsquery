// Test Utilities:
import { expect } from './index';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.replace:', () => {
        it('should replace individual AST nodes:', () => {
            const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
            const result = tsquery.replace(text, 'Identifier[name="console"]', () => 'logger');
            expect(result.trim()).to.equal(`

logger.log('foo');
logger.log('bar');
// console.log('baz');

            `.trim());
        });

        it('should replace multiple AST nodes:', () => {
            const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
            const result = tsquery.replace(text, 'Identifier[name="console"]', () => 'this.logger');
            expect(result.trim()).to.equal(`

this.logger.log('foo');
this.logger.log('bar');
// console.log('baz');

            `.trim());
        });

        it('should handle a noop transformer', () => {
            const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
            const result = tsquery.replace(text, 'Identifier[name="console"]', () => null);
            expect(result.trim()).to.equal(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
        });
    });
});
