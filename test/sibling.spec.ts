// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

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
