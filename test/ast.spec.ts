import { ScriptKind } from 'typescript';

// Test Utilities:
import { expect } from './index';

// Dependencies:
import { simpleJsxCode } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - jsx:', () => {
        it('should get a correct AST from jsx code', () => {
            const ast = tsquery.ast(simpleJsxCode, '', ScriptKind.JSX);

            expect(ast.statements.length).to.equal(3);
        });
    });
});
