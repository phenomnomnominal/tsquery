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
    describe('tsquery - adjacent:', () => {
        it('should find any nodes that is a directly after of another node', () => {
            const ast = tsquery.ast(simpleProgram);
            const result = tsquery(ast, 'VariableStatement + ExpressionStatement');

            expect(result).to.deep.equal([
                ast.statements[2]
            ]);
        });
    });
});
