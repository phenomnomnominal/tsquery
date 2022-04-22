// Dependencies:
import {
  ExpressionStatement,
  NoSubstitutionTemplateLiteral,
  TaggedTemplateExpression
} from 'typescript';

// Under test:
import { tsquery } from '../src/index';
import { getProperties } from '../src/traverse';

describe('tsquery:', () => {
  describe('tsquery - types:', () => {
    it('should correctly cast a String', () => {
      const ast = tsquery.ast('"hello";');
      const [result] = tsquery(ast, 'StringLiteral');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual('hello');
    });

    it('should not try to cast a RegExp from inside a String', () => {
      const ast = tsquery.ast('"/t(/";');
      const [result] = tsquery(ast, 'StringLiteral');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual('/t(/');
    });

    it('should not try to cast a RegExp from inside a Template Literal', () => {
      const ast = tsquery.ast('`/fo(o/`;');
      const [result] = tsquery(ast, 'NoSubstitutionTemplateLiteral');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual('/fo(o/');
    });

    it('should not try to cast a RegExp from inside a Tagged Template Literal', () => {
      const ast = tsquery.ast('tag`/fo(o/`;');
      const [result] = tsquery<TaggedTemplateExpression>(
        ast,
        'TaggedTemplateExpression'
      );

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect((result.template as NoSubstitutionTemplateLiteral).text).toEqual(
        '/fo(o/'
      );
    });

    it('should correctly cast a boolean false', () => {
      const ast = tsquery.ast('false;');
      const [result] = tsquery(ast, 'FalseKeyword');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual(false);
    });

    it('should correctly cast a boolean true', () => {
      const ast = tsquery.ast('true;');
      const [result] = tsquery(ast, 'TrueKeyword');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual(true);
    });

    it('should correctly cast a null', () => {
      const ast = tsquery.ast('null;');
      const [result] = tsquery(ast, 'NullKeyword');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual(null);
    });

    it('should correctly cast a number', () => {
      const ast = tsquery.ast('3.3;');
      const [result] = tsquery(ast, 'NumericLiteral');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value).toEqual(3.3);
    });

    it('should correctly cast a RegExp', () => {
      const ast = tsquery.ast('/^foo$/;');
      const [result] = tsquery(ast, 'RegularExpressionLiteral');

      expect(result).toEqual(
        (ast.statements[0] as ExpressionStatement).expression
      );
      expect(getProperties(result).value instanceof RegExp).toEqual(true);
    });
  });
});
