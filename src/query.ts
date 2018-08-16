// Dependencies:
import { Node } from 'typescript';
import { createAST } from './ast';
import { match } from './match';
import { parse } from './parse';
import { TSQueryNode, TSQueryOptions } from './tsquery-types';

export function query <T extends Node = Node> (ast: string | Node | TSQueryNode<T>, selector: string, options: TSQueryOptions = {}): Array<TSQueryNode<T>> {
    if (typeof ast === 'string') {
        ast = createAST(ast);
    }
    return match<T>(ast, parse(selector), options);
}
