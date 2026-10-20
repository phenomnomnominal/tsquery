import { SyntaxKind, TokenFlags } from 'typescript/ast';
import * as factory from 'typescript/ast/factory';

import { simpleFunction } from './fixtures/simple-function.js';

import { ast, print, query } from '../src/index.js';

describe('tsquery:', () => {
  describe('tsquery.print:', () => {
    it('should handle a SourceFile:', () => {
      const tree = ast(simpleFunction);

      expect(print(tree)).toEqual(`/**
 * @param x - the x
 * @param y - the y
 */
function foo(x, y) {
    var z = x + y;
    z++;
    return z;
}`);
    });

    it('should handle synthetic nodes', () => {
      expect(
        print(
          factory.createArrowFunction(
            [factory.createToken(SyntaxKind.AsyncKeyword)],
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                factory.createIdentifier('x'),
                undefined,
                factory.createKeywordTypeNode(SyntaxKind.NumberKeyword)
              )
            ],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock([])
          )
        )
      ).toEqual('async (x: number) => {\n}');
    });
  });

  it('should not delete strings', () => {
    const tree = ast(`console.log("hello world")`);
    const [str] = query(tree, 'StringLiteral');

    expect(print(str)).toEqual('"hello world"');
  });
});

describe('native printing', () => {
  it('preserves parsed comments and string contents', () => {
    const source = ast('// before\nexport const text = "hello"; // after');
    const output = print(source);
    expect(output).toContain('// before');
    expect(output).toContain('// after');
    expect(output).toContain('"hello"');
    expect(output).not.toContain('\r');
  });

  it('does not change the positions of a parsed subtree', () => {
    const source = ast('const value = "hello";');
    const node = query(source, 'StringLiteral')[0];
    const range = [node.pos, node.end];
    expect(print(node)).toEqual('"hello"');
    expect([node.pos, node.end]).toEqual(range);
    expect(node.getText()).toEqual('"hello"');
  });

  it('forwards supported native printer options', () => {
    const node = factory.createStringLiteral('é', TokenFlags.None);
    expect(print(node, { neverAsciiEscape: true })).toEqual('"é"');
  });

  it('rejects legacy options instead of silently ignoring them', () => {
    expect(() => {
      // @ts-expect-error TypeScript 7's printer does not support removeComments.
      print(ast('// comment\nconst value = 1;'), { removeComments: true });
    }).toThrow('Unsupported native printer option: removeComments');
  });
});
