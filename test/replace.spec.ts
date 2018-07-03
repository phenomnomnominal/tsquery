// Test Utilities:
import { expect } from './index';

// Dependencies:
import { createPrinter } from 'typescript';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.replace:', () => {
        it('should replace individual AST nodes:', () => {
            const ast = tsquery.ast(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
            const result = tsquery.replace(ast, 'Identifier[name="console"]', () => 'logger');
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
            const result = tsquery.replace(ast, 'Identifier[name="console"]', () => 'this.logger');
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
            const result = tsquery.replace(ast, 'Identifier[name="console"]', () => null);
            const printer = createPrinter();
            expect(printer.printFile(result).trim()).to.equal(`

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim());
        });
    });
});
