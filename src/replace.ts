// Dependencies:
import { Node } from 'typescript';
import { query } from './query';
import { TSQueryNode, TSQueryStringTransformer } from './tsquery-types';

export function replace <T extends Node = Node> (text: string, selector: string, iterator: TSQueryStringTransformer<T>): string {
    const matches = query(text, selector);
    const replacements = matches.map(node => iterator(node as TSQueryNode));
    const reversedMatches = matches.reverse();
    const reversedReplacements = replacements.reverse();
    let result = text;
    reversedReplacements.forEach((replacement, index) => {
        if (replacement) {
            const match = reversedMatches[index];
            result = `${result.substr(0, match.getStart())}${replacement}${result.substr(match.getEnd())}`;
        }
    });
    return result;
}
