import type { IfStatement } from 'typescript/ast';

import { conditional } from './fixtures/index.js';

import { ast, query } from '../src/index.js';

describe('tsquery:', () => {
  describe('tsquery - compound:', () => {
    it('should find any nodes with two attributes', () => {
      const tree = ast(conditional);
      const result = query(tree, '[left.text="x"][right.text="1"]');

      expect(result).toEqual([(tree.statements[0] as IfStatement).expression]);
    });
  });
});
