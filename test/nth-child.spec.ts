// Dependencies:
import { Block, IfStatement } from 'typescript';
import { conditional } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - nth-child:', () => {
    it('should find any nodes that are the first-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, ':first-child');

      expect(result).toEqual([
        ast.statements[0],
        ((ast.statements[0] as IfStatement).thenStatement as Block)
          .statements[0],
        ((ast.statements[0] as IfStatement).elseStatement as Block)
          .statements[0],
        ((ast.statements[1] as IfStatement).thenStatement as Block)
          .statements[0],
        (
          ((ast.statements[1] as IfStatement).elseStatement as IfStatement)
            .thenStatement as Block
        ).statements[0]
      ]);
    });

    it('should find any nodes that are the last-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, ':last-child');

      expect(result).toEqual([
        ((ast.statements[0] as IfStatement).thenStatement as Block)
          .statements[0],
        ((ast.statements[0] as IfStatement).elseStatement as Block)
          .statements[0],
        ast.statements[1],
        ((ast.statements[1] as IfStatement).thenStatement as Block)
          .statements[0],
        (
          ((ast.statements[1] as IfStatement).elseStatement as IfStatement)
            .thenStatement as Block
        ).statements[0]
      ]);
    });

    it('should find any nodes that are the nth-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, ':nth-child(2)');

      expect(result).toEqual([ast.statements[1]]);
    });

    it('should find any nodes that are the nth-last-child of a list of nodes', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery(ast, ':nth-last-child(2)');

      expect(result).toEqual([ast.statements[0]]);
    });
  });
});
