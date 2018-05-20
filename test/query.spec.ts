// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

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
    });
});
