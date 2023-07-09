import type {
  BinaryExpression,
  Block,
  CallExpression,
  ExpressionStatement,
  FunctionDeclaration,
  IfStatement,
  JSDoc,
  JSDocParameterTag,
  Node,
  VariableStatement
} from 'typescript';

import { conditional, simpleFunction, simpleProgram } from './fixtures';

import { factory } from 'typescript';
import { tsquery, ast, query } from '../src/index';
import { getProperties } from '../src/traverse';

describe('tsquery:', () => {
  describe('tsquery - attribute:', () => {
    it('should find any nodes with a property with a value that matches a specific value', () => {
      const tree = ast(conditional);
      const result = query(tree, '[name="x"]');

      expect(result).toEqual([
        ((tree.statements[0] as IfStatement).expression as BinaryExpression)
          .left,
        (
          (
            ((tree.statements[0] as IfStatement).elseStatement as Block)
              .statements[0] as ExpressionStatement
          ).expression as BinaryExpression
        ).left,
        (
          (
            ((tree.statements[1] as IfStatement).expression as BinaryExpression)
              .left as BinaryExpression
          ).left as BinaryExpression
        ).left,
        ((tree.statements[1] as IfStatement).expression as BinaryExpression)
          .right
      ]);
    });

    it('should find any nodes with a property with a value that does not match a specific value', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[name!="x"]');

      expect(result).toEqual([
        (
          (
            ((ast.statements[0] as IfStatement).thenStatement as Block)
              .statements[0] as ExpressionStatement
          ).expression as CallExpression
        ).expression,
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

    it('should find any nodes with a nested property with a specific value', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[expression.name="foo"]');

      expect(result).toEqual([
        (
          ((ast.statements[0] as IfStatement).thenStatement as Block)
            .statements[0] as ExpressionStatement
        ).expression
      ]);
    });

    it('should find any nodes with a nested properties including array values', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(
        ast,
        'FunctionDeclaration[parameters.0.name.name="x"]'
      );

      expect(result).toEqual([ast.statements[0]]);
    });

    it('should find any nodes with a specific property', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[thenStatement]');

      expect(result).toEqual([
        ast.statements[0],
        ast.statements[1],
        (ast.statements[1] as IfStatement).elseStatement as IfStatement
      ]);
    });

    it('should support synthesized nodes', () => {
      const ast = factory.createVariableStatement(undefined, [
        factory.createVariableDeclaration(
          'answer',
          undefined,
          factory.createLiteralTypeNode(factory.createNumericLiteral(42))
        )
      ]);
      const result = tsquery(ast, '[text="answer"]');

      expect(result).toEqual([ast.declarationList.declarations[0].name]);
    });
  });

  describe('tsquery - attribute operators:', () => {
    it('should find any nodes with an attribute with a value that matches a RegExp', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, '[name=/x|foo/]');

      const [statement] = ast.statements;

      expect(result).toEqual([
        hasJSDoc(statement) &&
          (statement.jsDoc[0].tags?.[0] as JSDocParameterTag).name,
        (statement as FunctionDeclaration).name,
        (statement as FunctionDeclaration).parameters[0].name,
        (
          (
            ((statement as FunctionDeclaration).body as Block)
              .statements[0] as VariableStatement
          ).declarationList.declarations[0].initializer as BinaryExpression
        ).left
      ]);
    });

    it('should find any nodes with an attribute with a value that does not match a RegExp', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, '[name!=/x|y|z/]');

      const [statement] = ast.statements;

      expect(result).toEqual(
        hasJSDoc(statement) && [
          statement.jsDoc[0].tags?.[0].tagName,
          statement.jsDoc[0].tags?.[1].tagName,
          (ast.statements[0] as FunctionDeclaration).name
        ]
      );
    });

    it('should find any nodes with an attribute with a value that is greater than or equal to a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length>=4]');

      expect(result).toEqual([ast]);
    });

    it('should find any nodes with an attribute with a value that is greater than a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length>3]');

      expect(result).toEqual([ast]);
    });

    it('should find any nodes with an attribute with a value that is less than or equal to a value', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[statements.length<=1]');

      expect(result).toEqual([
        (ast.statements[3] as IfStatement).thenStatement
      ]);
    });

    it('should find any nodes with an attribute with a value that is a specific type', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, '[value=type(boolean)]');

      expect(result).toEqual([
        (
          ((ast.statements[1] as IfStatement).expression as BinaryExpression)
            .left as BinaryExpression
        ).right,
        ((ast.statements[1] as IfStatement).elseStatement as IfStatement)
          .expression
      ]);
      expect(
        result.every((node) => typeof getProperties(node).value === 'boolean')
      ).toEqual(true);
    });

    it('should find any nodes with an attribute with a value that is not a specific type', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, '[value!=type(string)]');

      expect(result).toEqual([
        (ast.statements[0] as VariableStatement).declarationList.declarations[0]
          .initializer,
        (
          (
            (ast.statements[2] as ExpressionStatement)
              .expression as BinaryExpression
          ).right as BinaryExpression
        ).right
      ]);
      expect(
        result.every((node) => typeof getProperties(node).value !== 'string')
      ).toEqual(true);
    });
  });
});

type WithJSDoc = { jsDoc: Array<JSDoc> };
function hasJSDoc(node: unknown): node is Node & WithJSDoc {
  return !!(node as WithJSDoc).jsDoc;
}
