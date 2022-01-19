// Test Utilities:
import { expect } from './index';

// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
    describe('tsquery.parse - null query:', () => {
        it('should parse an empty query', () => {
            const result = tsquery.parse('');

            expect(result).to.equal(undefined);
        });

        it('should parse a whitespace query', () => {
            const result = tsquery.parse('      ');

            expect(result).to.equal(undefined);
        });
    });

    describe('tsquery.parse - comments/new lines:', () => {
        it('should parse an empty comment', () => {
            const result = tsquery.parse('/**/');

            expect(result).to.equal(undefined);
        });

        it('should parse a whitespace comment', () => {
            const result = tsquery.parse('/*      */');

            expect(result).to.equal(undefined);
        });

        it('should parse a multi-line comment', () => {
            const result = tsquery.parse(`
/**
 * this
 * is
 * several
 * lines
 */
            `);

            expect(result).to.equal(undefined);
        });

        it('should parse a commented multi-line query', () => {
            const result = tsquery.parse(`
/* title attribute */
JsxAttribute[name.name=/title|label|alt/] StringLiteral,

/* JsxText which content is not only whitespace */
JsxText:not([text=/^\s+$/])
            `);

            expect(result.selectors).to.have.length(2);
        });
    });

    describe('tsquery.parse - queryies with surrounding whitespace:', () => {
        it('should parse a query with some leading whitespace', () => {
            const result = tsquery.parse(' Identifier');

            expect(result).to.not.equal(undefined);
        });

        it('should parse a query with lots of leading whitespace', () => {
            const result = tsquery.parse('     Identifier');

            expect(result).to.not.equal(undefined);
        });

        it('should parse a query with some trailing whitespace', () => {
            const result = tsquery.parse('Identifier ');

            expect(result).to.not.equal(undefined);
        });

        it('should parse a query with lots of trailing whitespace', () => {
            const result = tsquery.parse('Identifier     ');

            expect(result).to.not.equal(undefined);
        });

        it('should parse a query with some leading and trailing whitespace', () => {
            const result = tsquery.parse(' Identifier ');

            expect(result).to.not.equal(undefined);
        });

        it('should parse a query with lots of leading and trailing whitespace', () => {
            const result = tsquery.parse('     Identifier     ');

            expect(result).to.not.equal(undefined);
        });
    });
});
