// Dependencies:
import { createPrinter, factory, NewLineKind } from 'typescript';

// Under test:
import { tsquery } from '../src/index';

const printerOptions = {
  newLine: NewLineKind.LineFeed
};

describe('tsquery:', () => {
  describe('tsquery.map:', () => {
    it('should replace individual AST nodes:', () => {
      const ast = tsquery.ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = tsquery.map(ast, 'Identifier[name="console"]', () =>
        factory.createIdentifier('logger')
      );
      const printer = createPrinter(printerOptions);
      expect(printer.printFile(result).trim()).toEqual(
        `

logger.log('foo');
logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should replace multiple AST nodes:', () => {
      const ast = tsquery.ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = tsquery.map(ast, 'Identifier[name="console"]', () =>
        factory.createPropertyAccessExpression(factory.createThis(), 'logger')
      );
      const printer = createPrinter(printerOptions);
      expect(printer.printFile(result).trim()).toEqual(
        `

this.logger.log('foo');
this.logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle a noop transformer', () => {
      const ast = tsquery.ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = tsquery.map(
        ast,
        'Identifier[name="console"]',
        (node) => node
      );
      const printer = createPrinter(printerOptions);
      expect(printer.printFile(result).trim()).toEqual(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle a removal transformer', () => {
      const ast = tsquery.ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      //@ts-ignore
      const result = tsquery.map(ast, 'StringLiteral', () => undefined);
      const printer = createPrinter(printerOptions);
      expect(printer.printFile(result).trim()).toEqual(
        `

console.log();
console.log();
// console.log('baz');

            `.trim()
      );
    });

    it('should visit child nodes whose ancestors also match the selector', () => {
      const ast = tsquery.ast('label1: label2: 1 + 1'.trim());
      let count = 0;
      tsquery.map(ast, 'LabeledStatement', (node) => {
        ++count;
        return node;
      });
      expect(count).toEqual(2);
    });

    it(`should't visit child nodes when an ancestor has been replaced`, () => {
      const ast = tsquery.ast('label1: label2: 1 + 1'.trim());
      let count = 0;
      //@ts-ignore
      tsquery.map(ast, 'LabeledStatement', () => {
        ++count;
        return undefined;
      });
      expect(count).toEqual(1);
    });
  });
});
