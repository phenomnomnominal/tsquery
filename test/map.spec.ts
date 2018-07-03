// Test Utilities:
import { expect } from './index';

// Dependencies:
import { createIdentifier, createPrinter, createPropertyAccess, createThis } from 'typescript';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.map:', () => {
        it('should replace individual AST nodes:', () => {
            const ast = tsquery.ast(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
            const result = tsquery.map(ast, 'Identifier[name="console"]', () => createIdentifier('logger'));
            const printer = createPrinter();
            expect(printer.printFile(result).trim()).to.equal(`

logger.log('foo');
logger.log('bar');
// console.log('baz');

            `.trim());
        });

        it('should replace multiple AST nodes:', () => {
            const ast = tsquery.ast(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
            const result = tsquery.map(ast, 'Identifier[name="console"]', () => createPropertyAccess(createThis(), 'logger'));
            const printer = createPrinter();
            expect(printer.printFile(result).trim()).to.equal(`

this.logger.log('foo');
this.logger.log('bar');
// console.log('baz');

            `.trim());
        });

        it('should handle a noop transformer', () => {
            const ast = tsquery.ast(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
            const result = tsquery.map(ast, 'Identifier[name="console"]', () => null);
            const printer = createPrinter();
            expect(printer.printFile(result).trim()).to.equal(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
        });
    });
});
