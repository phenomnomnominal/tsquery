// Dependencies:
import { simpleProgram } from './fixtures';

// Under test:
import { Block, IfStatement, VariableStatement } from 'typescript';
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - class:', () => {
    it('should find any statements', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, ':statement');

      expect(result).toEqual([
        ast.statements[0],
        (ast.statements[0] as VariableStatement).declarationList
          .declarations[0],
        ast.statements[1],
        (ast.statements[1] as VariableStatement).declarationList
          .declarations[0],
        ast.statements[2],
        ast.statements[3],
        ((ast.statements[3] as IfStatement).thenStatement as Block)
          .statements[0]
      ]);
    });
  });
});
