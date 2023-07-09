import type { IfStatement } from 'typescript';

import { conditional } from './fixtures';

import { ast, query } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - compound:', () => {
    it('should find any nodes with two attributes', () => {
      const tree = ast(conditional);
      const result = query(tree, '[left.text="x"][right.text="1"]');

      expect(result).toEqual([(tree.statements[0] as IfStatement).expression]);
    });
  });
});
