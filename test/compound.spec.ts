// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { IfStatement } from 'typescript';
import { conditional } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - compound:', () => {
        it('should find any nodes with two attributes', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, '[left.text="x"][right.text="1"]');

            expect(result).to.deep.equal([
                (ast.statements[0] as IfStatement).expression
            ]);
        });
    });
});
