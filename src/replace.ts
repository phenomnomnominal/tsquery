// Dependencies:
import { query } from './query';
import { TSQueryOptions, TSQueryStringTransformer } from './tsquery-types';

export function replace (source: string, selector: string, stringTransformer: TSQueryStringTransformer, options: TSQueryOptions = {}): string {
    const matches = query(source, selector, options);
    const replacements = matches.map(node => stringTransformer(node));
    const reversedMatches = matches.reverse();
    const reversedReplacements = replacements.reverse();
    let result = source;
    reversedReplacements.forEach((replacement, index) => {
        if (replacement) {
            const match = reversedMatches[index];
            result = `${result.substr(0, match.getStart())}${replacement}${result.substr(match.getEnd())}`;
        }
    });
    return result;
}
