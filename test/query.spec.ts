import type { Selector } from '../src/index.js';
import type { Block, FunctionDeclaration } from 'typescript/ast';

import { simpleFunction } from './fixtures/index.js';

import { ast, parse, match, tsquery } from '../src/index.js';

describe('tsquery:', () => {
  describe('tsquery.query:', () => {
    it('should work on the result of another query', () => {
      const ast = tsquery.ast(simpleFunction);
      const [firstResult] = tsquery(ast, 'FunctionDeclaration');

      const result = tsquery(firstResult, 'ReturnStatement');

      expect(result).toEqual([
        ((ast.statements[0] as FunctionDeclaration).body as Block).statements[2]
      ]);
    });

    it('should work on malformed ASTs', () => {
      const ast = tsquery.ast('function () {}');

      const result = tsquery(ast, 'FunctionDeclaration');

      expect(result).toEqual([ast.statements[0]]);
    });

    it('should throw with new SyntaxKind Nodes', () => {
      const ast = tsquery.ast('function () {}');

      const [statement] = ast.statements;
      const fakeNewNode = new Proxy(statement, {
        get(target, key) {
          return key === 'kind' ? 10000 : Reflect.get(target, key, target);
        }
      });

      let throws = false;
      try {
        tsquery(fakeNewNode, 'Identifier');
        tsquery(fakeNewNode, ':declaration');
        tsquery(fakeNewNode, ':expression');
        tsquery(fakeNewNode, ':function');
        tsquery(fakeNewNode, ':pattern');
        tsquery(fakeNewNode, ':statement');
      } catch {
        throws = true;
      }

      expect(throws).toBe(false);
    });

    it('should throw with new Selector Nodes', () => {
      const selector = parse.ensure('Identifier');
      const tree = ast('function () {}');

      const fakeNewSelector = selector as unknown as { type: string };
      fakeNewSelector.type = 'new';

      let throws = false;
      try {
        match(tree, fakeNewSelector as Selector);
      } catch {
        throws = true;
      }

      expect(throws).toBe(true);
    });
  });
});
