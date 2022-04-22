// Dependencies:
import { SyntaxKind } from 'typescript';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - syntaxKindName:', () => {
    it('should return the string `NumericLiteral` for NumericLiteral syntax kind', () => {
      expect(tsquery.syntaxKindName(SyntaxKind.NumericLiteral)).toEqual(
        'NumericLiteral'
      );
    });

    it('should return the correct value for `NoSubstitutionTemplateLiteral` syntax kind', () => {
      expect(
        tsquery.syntaxKindName(SyntaxKind.NoSubstitutionTemplateLiteral)
      ).toEqual('NoSubstitutionTemplateLiteral');
    });
  });
});
