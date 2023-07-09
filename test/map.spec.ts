import { factory } from 'typescript';

import { ast, map } from '../src/index';
import { print } from '../src/print';
import { literal } from './fixtures';

describe('tsquery:', () => {
  describe('tsquery.map:', () => {
    it('should replace individual AST nodes:', () => {
      const tree = ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = map(tree, 'Identifier[name="console"]', () =>
        factory.createIdentifier('logger')
      );
      expect(print(result)).toEqual(
        `

logger.log('foo');
logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should replace multiple AST nodes:', () => {
      const tree = ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = map(tree, 'Identifier[name="console"]', () =>
        factory.createPropertyAccessExpression(factory.createThis(), 'logger')
      );
      expect(print(result)).toEqual(
        `

this.logger.log('foo');
this.logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle a noop transformer', () => {
      const tree = ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = map(tree, 'Identifier[name="console"]', (node) => node);
      expect(print(result)).toEqual(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle a removal transformer', () => {
      const tree = ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const result = map(tree, 'StringLiteral', () => undefined);
      expect(print(result)).toEqual(
        `

console.log();
console.log();
// console.log('baz');

            `.trim()
      );
    });

    it(`shouldn't let you replace a SourceFile`, () => {
      const tree = ast(literal);
      const result = map(tree, 'SourceFile', () => undefined);
      expect(print(result)).toEqual(literal);
    });

    it('should visit child nodes whose ancestors also match the selector', () => {
      const tree = ast('label1: label2: 1 + 1'.trim());
      let count = 0;
      map(tree, 'LabeledStatement', (node) => {
        ++count;
        return node;
      });
      expect(count).toEqual(2);
    });

    it(`should't visit child nodes when an ancestor has been replaced`, () => {
      const tree = ast('label1: label2: 1 + 1'.trim());
      let count = 0;
      map(tree, 'LabeledStatement', () => {
        ++count;
        return undefined;
      });
      expect(count).toEqual(1);
    });
  });
});
