import type {
  BinaryExpression,
  Block,
  CallExpression,
  ExpressionStatement,
  IfStatement,
  JSDoc,
  JSDocParameterTag,
  Node
} from 'typescript';

import { SyntaxKind } from 'typescript';
import { conditional, simpleFunction } from './fixtures';

import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - identifier:', () => {
    it('should find any nodes of a specific SyntaxKind', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'Identifier');

      expect(result[0].kind).toEqual(SyntaxKind.Identifier);
      expect(result).toEqual([
        ((ast.statements[0] as IfStatement).expression as BinaryExpression)
          .left,
        (
          (
            ((ast.statements[0] as IfStatement).thenStatement as Block)
              .statements[0] as ExpressionStatement
          ).expression as CallExpression
        ).expression,
        (
          (
            ((ast.statements[0] as IfStatement).elseStatement as Block)
              .statements[0] as ExpressionStatement
          ).expression as BinaryExpression
        ).left,
        (
          (
            ((ast.statements[1] as IfStatement).expression as BinaryExpression)
              .left as BinaryExpression
          ).left as BinaryExpression
        ).left,
        ((ast.statements[1] as IfStatement).expression as BinaryExpression)
          .right,
        (
          (
            ((ast.statements[1] as IfStatement).thenStatement as Block)
              .statements[0] as ExpressionStatement
          ).expression as BinaryExpression
        ).left,
        (
          (
            (
              ((ast.statements[1] as IfStatement).elseStatement as IfStatement)
                .thenStatement as Block
            ).statements[0] as ExpressionStatement
          ).expression as BinaryExpression
        ).left
      ]);
    });

    it('should work with JSDoc contents', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, 'FunctionDeclaration JSDocParameterTag');

      expect(result[0].kind).toEqual(SyntaxKind.JSDocParameterTag);

      const [statement] = ast.statements;

      expect(result).toEqual(
        hasJSDoc(statement) && [
          statement.jsDoc[0].tags?.[0] as JSDocParameterTag,
          statement.jsDoc[0].tags?.[1] as JSDocParameterTag
        ]
      );
    });

    it('should throw if an invalid SyntaxKind is used', () => {
      const ast = tsquery.ast(conditional);

      expect(() => {
        tsquery(ast, 'FooBar');
      }).toThrow('"FooBar" is not a valid TypeScript Node kind.');
    });
  });
});

type WithJSDoc = { jsDoc: Array<JSDoc> };
function hasJSDoc(node: unknown): node is Node & WithJSDoc {
  return !!(node as WithJSDoc).jsDoc;
}
