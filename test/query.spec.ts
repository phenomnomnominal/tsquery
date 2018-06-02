// Test Utilities:
import { expect } from './index';

// Dependencies:
import { Block, FunctionDeclaration } from 'typescript';
import { simpleFunction } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.query:', () => {
        it('should work on the result of another query', () => {
            const ast = tsquery.ast(simpleFunction);
            const [firstResult] = tsquery(ast, 'FunctionDeclaration');

            const result = tsquery(firstResult, 'ReturnStatement');

            expect(result).to.deep.equal([
                ((ast.statements[0] as FunctionDeclaration).body as Block).statements[2]
            ]);
        });

        it('should work on malformed ASTs', () => {
            const ast = tsquery.ast('function () {}');

            const result = tsquery(ast, 'FunctionDeclaration');

            expect(result).to.deep.equal([
                (ast.statements[0])
            ]);
        });
    });
});
