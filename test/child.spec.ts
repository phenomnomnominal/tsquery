// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { SyntaxKind } from 'typescript';
import { conditional } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.query - child:', () => {
        it('should find any nodes that are a direct child of another node', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'BinaryExpression > Identifier');

            expect(result.every(node => {
                return node.kind === SyntaxKind.Identifier && !!node.parent && node.parent.kind === SyntaxKind.BinaryExpression;
            })).to.equal(true);
        });
    });
});
