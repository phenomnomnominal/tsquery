import { ScriptKind } from 'typescript/ast';

import { simpleJsxCode } from './fixtures/index.js';

import { tsquery, ast } from '../src/index.js';

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
