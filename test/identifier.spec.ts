// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { BinaryExpression, Block, CallExpression, ExpressionStatement, IfStatement, SyntaxKind } from 'typescript';
import { conditional } from './fixtures';

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
    });
});
