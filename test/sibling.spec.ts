import type { FunctionDeclaration } from 'typescript';

import { siblings, simpleProgram } from './fixtures';

import { ast, query } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - sibling:', () => {
    it('should find a node that is a subsequent sibling of another node', () => {
      const parsed = ast(simpleProgram);
      const result = query(parsed, 'VariableStatement ~ IfStatement');

      expect(result).toEqual([parsed.statements[3]]);
    });

    it('should find a node that is a subsequent sibling of another node, including when visiting out of band nodes', () => {
      const parsed = ast(siblings);
      const result = query(parsed, 'Identifier[name="d"] ~ AnyKeyword');

      expect(result).toEqual([
        (parsed.statements[2] as FunctionDeclaration).parameters[0].type
      ]);
    });

    it('should find a function declaration that is the next sibling of another function declaration', () => {
      const parsed = ast(siblings);
      const result = query(parsed, 'FunctionDeclaration + FunctionDeclaration');

      expect(result).toEqual([parsed.statements[1], parsed.statements[2]]);
    });

    it('should find a parameter that is the next sibling of another parameter', () => {
      const parsed = ast(siblings);
      const result = query(parsed, 'Parameter + Parameter');

      expect(result).toEqual([
        (parsed.statements[2] as FunctionDeclaration).parameters[1]
      ]);
    });

    it('should work with a SourceFile', () => {
      const parsed = ast(siblings);
      const result = query(parsed, 'SourceFile + Identifier');

      expect(result).toEqual([]);
    });
  });
});
