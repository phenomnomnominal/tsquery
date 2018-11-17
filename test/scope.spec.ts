// Test Utilities:
import { expect } from './index';

// Dependencies:
import { nestedFunctions } from './fixtures';

// Under test:
import { FunctionDeclaration, SyntaxKind  } from 'typescript';
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - :scope:', () => {
        it('Should find the first function', () => {
            const ast = tsquery.ast(nestedFunctions);
            const result = tsquery(ast, ':scope > FunctionDeclaration');
            expect(result.length).to.equal(1);
            expect(result[0].kind).to.equal(SyntaxKind.FunctionDeclaration);
            expect((result[0] as FunctionDeclaration).name.text).to.eq('a');
        });

        it('Should find the first function of root level from a child', () => {
            const ast = tsquery.ast(nestedFunctions);
            // We need to move into a child of root
            const child = tsquery(ast, 'Block')[0];
            const result = tsquery(child, ':scope');
            expect(result.length).to.equal(1);
            expect(result[0].kind).to.equal(SyntaxKind.FunctionDeclaration);
            expect((result[0] as FunctionDeclaration).name.text).to.eq('b');
        });

        it('Should find all the function inside root level from a child', () => {
            const ast = tsquery.ast(nestedFunctions);
            // We need to move into a child of root
            const child = tsquery(ast, 'Block')[0];
            const result = tsquery(child, ':scope FunctionDeclaration');
            expect(result.length).to.equal(1);
            expect(result[0].kind).to.equal(SyntaxKind.FunctionDeclaration);
            expect((result[0] as FunctionDeclaration).name.text).to.eq('b');
        });
    });
});
