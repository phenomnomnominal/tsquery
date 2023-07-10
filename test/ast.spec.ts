import { ScriptKind } from 'typescript';

import { simpleJsxCode } from './fixtures';

import { tsquery, ast } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - jsx:', () => {
    it('should get a correct AST from JSX code', () => {
      const ast = tsquery.ast(simpleJsxCode, '', ScriptKind.JSX);

      expect(ast.statements.length).toEqual(3);
    });

    it('should get a correct AST', () => {
      const tree = ast(simpleJsxCode);

      expect(tree.statements.length).toEqual(3);
    });
  });
});
