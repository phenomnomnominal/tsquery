// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { Block, CallExpression, ExpressionStatement, IfStatement, VariableDeclaration, VariableDeclarationList, VariableStatement } from 'typescript';
import { conditional, simpleProgram } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.query - field:', () => {
        it('should find any nodes with a single field', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, '.expression');

            expect(result).to.deep.equal([
                (ast.statements[0] as IfStatement).expression,
                (((ast.statements[0] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression,
                ((((ast.statements[0] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression as CallExpression).expression,
                (((ast.statements[0] as IfStatement).elseStatement as Block).statements[0] as ExpressionStatement).expression,
                (ast.statements[1] as IfStatement).expression,
                (((ast.statements[1] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression,
                ((ast.statements[1] as IfStatement).elseStatement as IfStatement).expression,
                ((((ast.statements[1] as IfStatement).elseStatement as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression
            ]);
        });

        it('should find any nodes with a field sequence', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, '.declarations.initializer');

            expect(result).to.deep.equal([
                (((ast.statements[0] as VariableStatement).declarationList as VariableDeclarationList).declarations[0] as VariableDeclaration).initializer,
                (((ast.statements[1] as VariableStatement).declarationList as VariableDeclarationList).declarations[0] as VariableDeclaration).initializer
            ]);
        });
    });
});
