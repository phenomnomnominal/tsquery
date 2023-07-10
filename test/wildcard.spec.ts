import {
  conditional,
  forLoop,
  simpleFunction,
  simpleProgram,
  statement
} from './fixtures';

import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - wildcard:', () => {
    it('should find all nodes (conditional)', () => {
      const result = tsquery(tsquery.ast(conditional), '*');

      expect(result.length).toEqual(75);
    });

    it('should find all nodes (for loop)', () => {
      const result = tsquery(tsquery.ast(forLoop), '*');

      expect(result.length).toEqual(38);
    });

    it('should find all nodes (simple function)', () => {
      const result = tsquery(tsquery.ast(simpleFunction), '*');

      expect(result.length).toEqual(46);
    });

    it('should find all nodes (simple program)', () => {
      const result = tsquery(tsquery.ast(simpleProgram), '*');

      expect(result.length).toEqual(45);
    });

    it('should find all nodes (statement)', () => {
      const ast = tsquery.ast(statement);
      const result = tsquery(ast, '*');

      expect(result.length).toEqual(12);
    });
  });
});
