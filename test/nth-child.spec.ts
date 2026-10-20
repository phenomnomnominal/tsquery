import { conditional, simpleFunction } from './fixtures/index.js';

import { ast, query, tsquery } from '../src/index.js';
import { JSDocParameterTag } from 'typescript/ast';

describe('tsquery:', () => {
  describe('tsquery - nth-child:', () => {
    it('should find any nodes that are the first-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'Identifier:first-child');

      expect(result.map((r) => r.getText())).toEqual([
        'x',
        'foo',
        'x',
        'x',
        'y',
        'y'
      ]);
    });

    it('should find any nodes that are the last-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'Identifier:last-child');

      expect(result.map((r) => r.getText())).toEqual(['x']);
    });

    it('should find any nodes that are the nth-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'Identifier:nth-child(1)');

      expect(result.map((r) => r.getText())).toEqual([
        'x',
        'foo',
        'x',
        'x',
        'y',
        'y'
      ]);
    });

    it('should find any nodes that are the nth-last-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, 'Identifier:nth-last-child(1)');

      expect(result.map((r) => r.getText())).toEqual(['x']);
    });

    it('should handle JSDoc', () => {
      const tree = ast(simpleFunction);
      const result = query<JSDocParameterTag>(
        tree,
        'JSDocParameterTag:first-child'
      );

      expect(
        result.map((r) =>
          typeof r.comment === 'string'
            ? r.comment
            : r.comment?.map((part) => part.text).join('')
        )
      ).toEqual(['- the x']);
    });

    it('should handle SourceFiles', () => {
      const tree = ast('');
      const result = query<JSDocParameterTag>(tree, 'SourceFile:first-child');

      expect(result).toEqual([]);
    });

    it('should handle edge indices', () => {
      const tree = ast('import { foo } from "@foo";');
      const [expected] = query(tree, 'ImportDeclaration');

      expect(query(tree, 'ImportDeclaration:nth-child(0)')[0]).toEqual(
        undefined
      );
      expect(query(tree, 'ImportDeclaration:nth-child(1)')[0]).toEqual(
        expected
      );
      expect(query(tree, 'ImportDeclaration:first-child')[0]).toEqual(expected);
      expect(query(tree, 'ImportDeclaration:last-child')[0]).toEqual(expected);
      expect(query(tree, 'ImportDeclaration:nth-last-child(1)')[0]).toEqual(
        expected
      );
      expect(query(tree, 'ImportDeclaration:nth-child(0)')[0]).toEqual(
        undefined
      );
    });
  });
});
