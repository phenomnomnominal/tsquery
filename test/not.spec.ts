// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { SyntaxKind, VariableDeclaration, VariableDeclarationList, VariableStatement } from 'typescript';
import { conditional, forLoop, simpleFunction, simpleProgram, statement } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.query - :not:', () => {
        it('should find any nodes that are not a specific SyntaxKind', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, ':not(Identifier)');

            expect(result.length).to.equal(36);
            expect(result.every(node => node.kind !== SyntaxKind.Identifier)).to.equal(true);
        });

        it('should find any nodes that do not have a specific attribute', () => {
            const ast = tsquery.ast(forLoop);
            const result = tsquery(ast, ':not([name="x"])');

            expect(result.length).to.equal(21);
        });

        it('should handle an inverse wildcard query', () => {
            const ast = tsquery.ast(simpleFunction);
            const result = tsquery(ast, ':not(*)');

            expect(result.length).to.equal(0);
        });

        it('should find any notes that are not one of several SyntaxKind', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, ':not(Identifier, IfStatement)');

            expect(result.length).to.equal(21);
            expect(result.every(node => {
                const { kind } = node;
                return kind !== SyntaxKind.Identifier && kind !== SyntaxKind.IfStatement;
            })).to.equal(true);
        });

        it('should find any nodes that do not have an attribute', () => {
            const ast = tsquery.ast(statement);
            const result = tsquery(ast, ':not([text=1])');

            expect(result).to.deep.equal([
                ast,
                ast.statements[0],
                (ast.statements[0] as VariableStatement).declarationList,
                ((ast.statements[0] as VariableStatement).declarationList as VariableDeclarationList).declarations[0],
                (((ast.statements[0] as VariableStatement).declarationList as VariableDeclarationList).declarations[0] as VariableDeclaration).name,
                ast.endOfFileToken
            ]);
        });
    });
});
