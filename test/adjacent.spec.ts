import { simpleProgram } from './fixtures';

import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - adjacent:', () => {
    it('should find any nodes that is a directly after of another node', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery(ast, 'VariableStatement + ExpressionStatement');

      expect(result).toEqual([ast.statements[2]]);
    });
  });
});
