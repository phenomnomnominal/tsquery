// Test Utilities:
import { expect } from './index';

// Dependencies:
import { simpleProgram } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - sibling:', () => {
        it('should find any nodes that is a subsequent sibling of another node', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, 'VariableStatement ~ IfStatement');

            expect(result).to.deep.equal([
                ast.statements[3]
            ]);
        });
    });
});
