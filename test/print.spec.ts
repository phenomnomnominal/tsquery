import { SyntaxKind, factory } from 'typescript';

import { simpleFunction } from './fixtures/simple-function';

import { ast, print, query } from '../src/index';

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
            [factory.createModifier(SyntaxKind.AsyncKeyword)],
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                'x',
                undefined,
                factory.createTypeReferenceNode('number')
              )
            ],
            undefined,
            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock([])
          )
        )
      ).toEqual('async (x: number) => { }');
    });
  });

  it('should not delete strings', () => {
    const tree = ast(`console.log("hello world")`);
    const [str] = query(tree, 'StringLiteral');

    expect(print(str)).toEqual('"hello world"');
  });
});
