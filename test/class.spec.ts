import type {
  BinaryExpression,
  Block,
  ExpressionStatement,
  IfStatement,
  VariableStatement
} from 'typescript';

import { expression, literal, simpleProgram } from './fixtures';

import { ast, query } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - class:', () => {
    it('should find any statements', () => {
      const tree = ast(simpleProgram);
      const result = query(tree, ':statement');

      expect(result).toEqual([
        tree.statements[0],
        (tree.statements[0] as VariableStatement).declarationList
          .declarations[0],
        tree.statements[1],
        (tree.statements[1] as VariableStatement).declarationList
          .declarations[0],
        tree.statements[2],
        tree.statements[3],
        ((tree.statements[3] as IfStatement).thenStatement as Block)
          .statements[0]
      ]);
    });

    it('should find any expression', () => {
      const tree = ast(expression);
      const result = query(tree, ':expression');

      const [statement] = tree.statements;
      const binary = (statement as ExpressionStatement)
        .expression as BinaryExpression;

      expect(result).toEqual([binary, binary.left, binary.right]);
    });

    it('should find any literal', () => {
      const tree = ast(literal);
      const result = query(tree, ':expression');

      const [statement] = tree.statements;
      const string = (statement as ExpressionStatement).expression;

      expect(result).toEqual([string]);
    });

    it('should throw with an invalid class name', () => {
      const tree = ast(expression);

      expect(() => {
        query(tree, ':foo');
      }).toThrow('Unknown class name: "foo"');
    });
  });
});
