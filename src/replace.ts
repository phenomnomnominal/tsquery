// Dependencies:
import { Node, SourceFile } from 'typescript';
import { query } from './query';
import { TSQueryNode, TSQueryStringTransformer } from './tsquery-types';

export function replace <T extends Node = Node> (ast: SourceFile, selector: string, iterator: TSQueryStringTransformer<T>): SourceFile {
    const matches = query(ast, selector);
    const replacements = matches.map(node => iterator(node as TSQueryNode));
    const reversedMatches = matches.reverse();
    const reversedReplacements = replacements.reverse();
    reversedReplacements.forEach((replacement, index) => {
        if (replacement) {
            reversedMatches[index].text = replacement;
        }
    });
    return ast;
}
