// Test Utilities:
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';

// Test setup:
const { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import { BinaryExpression, Block, IfStatement } from 'typescript';
import { conditional } from './fixtures';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery - :has:', () => {
        it('should find any nodes with multiple attributes', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'ExpressionStatement:has([name="foo"][kindName="Identifier"])');

            expect(result).to.deep.equal([
                ((ast.statements[0] as IfStatement).thenStatement as Block).statements[0]
            ]);
        });

        it('should find any nodes with one of multiple attributes', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'IfStatement:has(BinaryExpression [name="foo"], BinaryExpression [name="x"])');

            expect(result).to.deep.equal([
                ast.statements[0],
                ast.statements[1]
            ]);
        });

        it('should handle chained :has selectors', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'BinaryExpression:has(Identifier[name="x"]):has([text="test"])');

            expect(result).to.deep.equal([
                (ast.statements[1] as IfStatement).expression,
                ((ast.statements[1] as IfStatement).expression as BinaryExpression).left,
                (((ast.statements[1] as IfStatement).expression as BinaryExpression).left as BinaryExpression).left
            ]);
        });

        xit('should handle nested :has selectors', () => {
            const ast = tsquery.ast(conditional);
            const result = tsquery(ast, 'Program:has(IfStatement:has(Literal[value=true], Literal[value=false]))');

            expect(result).to.deep.equal([]);
        });
    });
});
