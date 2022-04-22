// Dependencies:
import { VariableStatement } from 'typescript';
import {
  conditional,
  forLoop,
  simpleFunction,
  simpleProgram,
  statement
} from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - wildcard:', () => {
    it('should find all nodes (conditional)', () => {
      const result = tsquery(tsquery.ast(conditional), '*');

      expect(result.length).toEqual(43);
    });

    it('should find all nodes (for loop)', () => {
      const result = tsquery(tsquery.ast(forLoop), '*');

      expect(result.length).toEqual(21);
    });

    it('should find all nodes (simple function)', () => {
      const result = tsquery(tsquery.ast(simpleFunction), '*');

      expect(result.length).toEqual(22);
    });

    it('should find all nodes (simple program)', () => {
      const result = tsquery(tsquery.ast(simpleProgram), '*');

      expect(result.length).toEqual(28);
    });

    it('should find all nodes (statement)', () => {
      const ast = tsquery.ast(statement);
      const result = tsquery(ast, '*');

      expect(result).toEqual([
        ast,
        ast.statements[0],
        (ast.statements[0] as VariableStatement).declarationList,
        (ast.statements[0] as VariableStatement).declarationList
          .declarations[0],
        (ast.statements[0] as VariableStatement).declarationList.declarations[0]
          .name,
        (ast.statements[0] as VariableStatement).declarationList.declarations[0]
          .initializer,
        ast.endOfFileToken
      ]);
    });
  });
});
