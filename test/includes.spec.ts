import { simpleFunction } from './fixtures';

import { ast, includes, query } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery.includes:', () => {
    it('should work on the result of another query', () => {
      const tree = ast(simpleFunction);
      const [firstResult] = query(tree, 'FunctionDeclaration');

      const result = includes(firstResult, 'ReturnStatement');

      expect(result).toEqual(true);
    });
  });
});
