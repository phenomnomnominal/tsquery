// Test Utilities:
import { expect } from './index';

// Dependencies:
import { Identifier, SyntaxKind } from 'typescript';
import { conditional } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - child:', () => {
        it('should find any nodes that are a direct child of another node', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery<Identifier>(ast, 'BinaryExpression > Identifier');

            expect(result.every(node => {
                return node.kind === SyntaxKind.Identifier &&
                    !!node.parent && node.parent.kind === SyntaxKind.BinaryExpression;
            })).to.equal(true);
        });

        it('should find any nodes that are a direct child of another node which is the direct child of another node', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery<Identifier>(ast, 'IfStatement > BinaryExpression > Identifier');

            expect(result.every(node => {
                return node.kind === SyntaxKind.Identifier &&
                    !!node.parent && node.parent.kind === SyntaxKind.BinaryExpression &&
                    !!node.parent.parent && node.parent.parent.kind === SyntaxKind.IfStatement;
            })).to.equal(true);
        });
    });
});
