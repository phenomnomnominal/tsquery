// Dependencies:
import { Node } from 'typescript';
import { createAST } from './ast';
import { match } from './match';
import { parse } from './parse';
import { TSQueryOptions } from './tsquery-types';

export function query <T extends Node = Node> (ast: string | Node, selector: string, options: TSQueryOptions = {}): Array<T> {
    if (typeof ast === 'string') {
        ast = createAST(ast);
    }
    return match<T>(ast, parse(selector), options);
}
