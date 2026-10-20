import * as factory from 'typescript/ast/factory';
import { NodeFlags, SyntaxKind } from 'typescript/ast';

import { ast, map } from '../src/index.js';
import { print } from '../src/print.js';
import { literal } from './fixtures/index.js';

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

    it('should can happen multiple times individual AST nodes:', () => {
      const tree = ast(
        `

console.log('foo');
console.log('bar');
// console.log('baz');

            `.trim()
      );
      const resultOne = map(tree, 'Identifier[name="console"]', () =>
        factory.createIdentifier('logger')
      );
      const resultTwo = map(resultOne, 'Identifier[name="logger"]', () =>
        factory.createIdentifier('log')
      );
      expect(print(resultTwo)).toEqual(
        `

log.log('foo');
log.log('bar');
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
        factory.createPropertyAccessExpression(
          factory.createKeywordExpression(SyntaxKind.ThisKeyword),
          undefined,
          factory.createIdentifier('logger'),
          NodeFlags.None
        )
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

describe('native node-list transformations', () => {
  it('expands replacements in an argument list', () => {
    const source = ast('console.log(first, last);');
    const result = map(source, 'Identifier[name="first"]', () => [
      factory.createIdentifier('one'),
      factory.createIdentifier('two')
    ]);
    expect(print(result)).toEqual('console.log(one, two, last);');
    expect(print(source)).toEqual('console.log(first, last);');
  });

  it('expands statement lists and preserves surrounding comments', () => {
    const source = ast('// before\nfirst();\nlast();');
    const replacements = ast('one(); two();').statements;
    const result = map(
      source,
      'ExpressionStatement:has(Identifier[name="first"])',
      () => replacements
    );
    expect(print(result)).toContain('// before');
    expect(print(result)).toContain('one();');
    expect(print(result)).toContain('two();');
    expect(print(result)).toContain('last();');
    expect(result.statements).toHaveLength(3);
  });

  it('rejects multiple nodes in a scalar child position', () => {
    expect(() =>
      map(ast('const value = first;'), 'Identifier[name="first"]', () => [
        factory.createIdentifier('one'),
        factory.createIdentifier('two')
      ])
    ).toThrow('Multiple replacements require a node list.');
  });
});

describe('native transformation text ranges', () => {
  it.each(['first', 'console'])(
    'preserves the leading comment when replacing %s',
    (name) => {
      const source = ast('// comment\nconsole.log(first);');
      const replacement = factory.createIdentifier('changed');
      const output = print(
        map(source, `Identifier[name="${name}"]`, () => replacement)
      );
      expect(output).toEqual(
        name === 'first'
          ? '// comment\nconsole.log(changed);'
          : '// comment\nchanged.log(first);'
      );
      expect(replacement.pos).toBe(-1);
      expect(print(source)).toEqual('// comment\nconsole.log(first);');
    }
  );

  it('does not duplicate comments when expanding synthesized arguments', () => {
    const source = ast('// comment\nconsole.log(first);');
    const result = map(source, 'Identifier[name="first"]', () => [
      factory.createIdentifier('one'),
      factory.createIdentifier('two')
    ]);
    expect(print(result)).toEqual('// comment\nconsole.log(one, two);');
  });
});
