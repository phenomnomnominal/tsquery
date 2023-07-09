import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery.replace:', () => {
    it('should replace individual AST nodes:', () => {
      const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
      const result = tsquery.replace(
        text,
        'Identifier[name="console"]',
        () => 'logger'
      );
      expect(result.trim()).toEqual(
        `

logger.log('foo');
logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle lists of AST nodes:', () => {
      const text = `

console.log('foo', 'bar');

            `.trim();
      const result = tsquery.replace(
        text,
        'StringLiteral[value="foo"]',
        () => ''
      );
      expect(result.trim()).toEqual(
        `

console.log('bar');

            `.trim()
      );
    });

    it('should replace multiple AST nodes:', () => {
      const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
      const result = tsquery.replace(
        text,
        'Identifier[name="console"]',
        () => 'this.logger'
      );
      expect(result.trim()).toEqual(
        `

this.logger.log('foo');
this.logger.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should handle a noop transformer', () => {
      const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
      const result = tsquery.replace(
        text,
        'Identifier[name="console"]',
        () => null
      );
      expect(result.trim()).toEqual(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
    });

    it('should replace with an empty string', () => {
      const text = `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim();
      const result = tsquery.replace(
        text,
        'ExpressionStatement:has(Identifier[name="console"])',
        () => ''
      );
      expect(result.trim()).toEqual(
        `



// console.log('baz');

            `.trim()
      );
    });
  });
});
