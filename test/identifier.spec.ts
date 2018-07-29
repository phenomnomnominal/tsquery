// Test Utilities:
import { expect } from './index';

// Dependencies:
import { BinaryExpression, Block, CallExpression, ExpressionStatement, IfStatement, JSDoc, JSDocParameterTag, SyntaxKind } from 'typescript';
import { conditional, simpleFunction } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - identifier:', () => {
        it('should find any nodes of a specific SyntaxKind', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'Identifier');

            expect(result[0].kind).to.equal(SyntaxKind.Identifier);
            expect(result).to.deep.equal([
                ((ast.statements[0] as IfStatement).expression as BinaryExpression).left,
                ((((ast.statements[0] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression as CallExpression).expression,
                ((((ast.statements[0] as IfStatement).elseStatement as Block).statements[0] as ExpressionStatement).expression as BinaryExpression).left,
                ((((ast.statements[1] as IfStatement).expression as BinaryExpression).left as BinaryExpression).left as BinaryExpression).left,
                ((ast.statements[1] as IfStatement).expression as BinaryExpression).right,
                ((((ast.statements[1] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression as BinaryExpression).left,
                (((((ast.statements[1] as IfStatement).elseStatement as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression as BinaryExpression).left
            ]);
        });

        it('should work with the `visitAllChildren` option', () => {
            const ast = tsquery.ast(simpleFunction);
            const result = tsquery(ast, 'FunctionDeclaration JSDocParameterTag', { visitAllChildren: true });

            expect(result[0].kind).to.equal(SyntaxKind.JSDocParameterTag);
            expect(result).to.deep.equal([
                ((ast.statements[0] as any).jsDoc as Array<JSDoc>)[0].tags![0] as JSDocParameterTag,
                ((ast.statements[0] as any).jsDoc as Array<JSDoc>)[0].tags![1] as JSDocParameterTag
            ]);
        });

        it('should throw if an invalid SyntaxKind is used', () => {
            const ast = tsquery.ast(conditional);

            expect(() => {
                tsquery(ast, 'FooBar');
            }).to.throw('"FooBar" is not a valid TypeScript Node kind.');
        });
    });
});
