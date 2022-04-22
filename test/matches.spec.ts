// Dependencies:
import {
  BinaryExpression,
  Block,
  ExpressionStatement,
  ForStatement,
  FunctionDeclaration,
  IfStatement
} from 'typescript';
import {
  conditional,
  forLoop,
  simpleFunction,
  simpleProgram
} from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - matches:', () => {
    it('should find any nodes that match a SyntaxKind', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, ':matches(IfStatement)');

      expect(result).toEqual([
        ast.statements[0],
        ast.statements[1],
        (ast.statements[1] as IfStatement).elseStatement
      ]);
    });

    it('should find any nodes that matches one of several SyntaxKind', () => {
      const ast = tsquery.ast(forLoop);
      const result = tsquery(
        ast,
        ':matches(BinaryExpression, ExpressionStatement)'
      );

      expect(result).toEqual([
        (ast.statements[0] as ForStatement).initializer,
        (ast.statements[0] as ForStatement).condition,
        ((ast.statements[0] as ForStatement).statement as Block).statements[0]
      ]);
    });

    it('should find any nodes that match an attribute or a SyntaxKind', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, ':matches([name="foo"], ReturnStatement)');

      expect(result).toEqual([
        (ast.statements[0] as FunctionDeclaration).name,
        ((ast.statements[0] as FunctionDeclaration).body as Block).statements[2]
      ]);
    });

    it('should find any nodes that implicitly match one of several SyntaxKinds', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, 'BinaryExpression, VariableStatement');

      expect(result).toEqual([
        ast.statements[0],
        ast.statements[1],
        (ast.statements[2] as ExpressionStatement).expression,
        (
          (ast.statements[2] as ExpressionStatement)
            .expression as BinaryExpression
        ).right,
        (
          ((ast.statements[3] as IfStatement).thenStatement as Block)
            .statements[0] as ExpressionStatement
        ).expression
      ]);
    });
  });
});
