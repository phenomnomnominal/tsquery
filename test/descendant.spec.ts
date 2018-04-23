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
    describe('tsquery - descendant:', () => {
        it('should find any nodes that are a descendant of another node', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'SourceFile IfStatement');

            expect(result).to.deep.equal([
                ast.statements[0],
                ast.statements[1],
                (ast.statements[1] as IfStatement).elseStatement
            ]);
        });
    });
});
