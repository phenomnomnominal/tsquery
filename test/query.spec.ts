import type { Selector } from '../src/index';
import type { Block, FunctionDeclaration } from 'typescript';

import { simpleFunction } from './fixtures';

import { ast, parse, match, tsquery } from '../src/index';

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
      const fakeNewNode = statement as unknown as { kind: number };
      fakeNewNode.kind = 10000;

      let throws = false;
      try {
        tsquery(ast, 'Identifier');
        tsquery(ast, ':declaration');
        tsquery(ast, ':expression');
        tsquery(ast, ':function');
        tsquery(ast, ':pattern');
        tsquery(ast, ':statement');
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
