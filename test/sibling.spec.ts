// Test Utilities:
import { expect } from './index';

// Dependencies:
import { FunctionDeclaration, ParameterDeclaration } from 'typescript';
import { siblings, simpleProgram } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - sibling:', () => {
        it('should find a node that is a subsequent sibling of another node', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, 'VariableStatement ~ IfStatement');

            expect(result).to.deep.equal([
                ast.statements[3]
            ]);
        });

        it('should find a node that is a subsequent sibling of another node, including when visiting out of band nodes', () => {
            const ast = tsquery.ast(siblings);
            const result = tsquery(ast, 'Identifier[name="d"] ~ AnyKeyword', { visitAllChildren: true });

            expect(result).to.deep.equal([
                ((ast.statements[2] as FunctionDeclaration).parameters[0] as ParameterDeclaration).type
            ]);
        });

        it('should find a function declaration that is the next sibling of another function declaration', () => {
            const ast = tsquery.ast(siblings);
            const result = tsquery(ast, 'FunctionDeclaration + FunctionDeclaration');

            expect(result).to.deep.equal([
                ast.statements[1],
                ast.statements[2]
            ]);
        });

        it('should find a parameter that is the next sibling of another parameter', () => {
            const ast = tsquery.ast(siblings);
            const result = tsquery(ast, 'Parameter + Parameter');

            expect(result).to.deep.equal([
                (ast.statements[2] as FunctionDeclaration).parameters[1]
            ]);
        });
    });
});
