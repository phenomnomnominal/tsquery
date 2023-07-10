import type { Identifier } from 'typescript';

import { SyntaxKind } from 'typescript';
import { conditional } from './fixtures';

import { tsquery, ast, query } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - child:', () => {
    it('should find any nodes that are a direct child of another node', () => {
      const tree = ast(conditional);
      const result = query<Identifier>(tree, 'BinaryExpression > Identifier');

      expect(
        result.every((node) => {
          return (
            node.kind === SyntaxKind.Identifier &&
            !!node.parent &&
            node.parent.kind === SyntaxKind.BinaryExpression
          );
        })
      ).toEqual(true);
    });

    it('should find any nodes that are a direct child of another node which is the direct child of another node', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery<Identifier>(
        ast,
        'IfStatement > BinaryExpression > Identifier'
      );

      expect(
        result.every((node) => {
          return (
            node.kind === SyntaxKind.Identifier &&
            !!node.parent &&
            node.parent.kind === SyntaxKind.BinaryExpression &&
            !!node.parent.parent &&
            node.parent.parent.kind === SyntaxKind.IfStatement
          );
        })
      ).toEqual(true);
    });
  });
});
