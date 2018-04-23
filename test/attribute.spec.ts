// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { BinaryExpression, Block, ExpressionStatement, FunctionDeclaration, IfStatement, VariableDeclaration, VariableStatement } from 'typescript';
import { conditional, simpleFunction, simpleProgram } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - attribute:', () => {
        it('should find any nodes with a property with a specific value', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, '[name="x"]');

            expect(result).to.deep.equal([
                ((ast.statements[0] as IfStatement).expression as BinaryExpression).left,
                ((((ast.statements[0] as IfStatement).elseStatement as Block).statements[0] as ExpressionStatement).expression as BinaryExpression).left,
                ((((ast.statements[1] as IfStatement).expression as BinaryExpression).left as BinaryExpression).left as BinaryExpression).left,
                ((ast.statements[1] as IfStatement).expression as BinaryExpression).right
            ]);
        });

        it('should find any nodes with a nested property with a specific value', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, '[expression.name="foo"]');

            expect(result).to.deep.equal([
                (((ast.statements[0] as IfStatement).thenStatement as Block).statements[0] as ExpressionStatement).expression
            ]);
        });

        it('should find any nodes with a nested properties including array values', () => {
            const ast = tsquery.ast(simpleFunction);
            const result = tsquery(ast, 'FunctionDeclaration[parameters.0.name.name="x"]');

            expect(result).to.deep.equal([
                ast.statements[0]
            ]);
        });

        it('should find any nodes with a specific property', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, '[thenStatement]');

            expect(result).to.deep.equal([
                ast.statements[0],
                ast.statements[1],
                (ast.statements[1] as IfStatement).elseStatement as IfStatement
            ]);
        });
    });

    describe('tsquery - attribute operators:', () => {
        it('should find any nodes with an attribute with a value that matches a RegExp', () => {
            const ast = tsquery.ast(simpleFunction);
            const result = tsquery(ast, '[name=/x|foo/]');

            expect(result).to.deep.equal([
                (ast.statements[0] as FunctionDeclaration).name,
                (ast.statements[0] as FunctionDeclaration).parameters[0].name,
                (((((ast.statements[0] as FunctionDeclaration).body as Block).statements[0] as VariableStatement).declarationList.declarations[0] as VariableDeclaration).initializer as BinaryExpression).left
            ]);
        });

        it('should find any nodes with an attribute with a value that does not match a RegExp', () => {
            const ast = tsquery.ast(simpleFunction);
            const result = tsquery(ast, '[name!=/x|y|z/]');

            expect(result).to.deep.equal([
                (ast.statements[0] as FunctionDeclaration).name
            ]);
        });

        it('should find any nodes with an attribute with a value that is greater than or equal to a value', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, '[statements.length>=4]');

            expect(result).to.deep.equal([
                ast
            ]);
        });

        it('should find any nodes with an attribute with a value that is greater than a value', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, '[statements.length>3]');

            expect(result).to.deep.equal([
                ast
            ]);
        });

        it('should find any nodes with an attribute with a value that is less than or equal to a value', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, '[statements.length<=1]');

            expect(result).to.deep.equal([
                (ast.statements[3] as IfStatement).thenStatement
            ]);
        });

        it('should find any nodes with an attribute with a value that is less than a value', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, '[statements.length<2]');

            expect(result).to.deep.equal([
                (ast.statements[3] as IfStatement).thenStatement
            ]);
        });
    });
});
