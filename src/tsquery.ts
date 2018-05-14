// Dependencies:
import * as esquery from 'esquery';
import { Node, SourceFile } from 'typescript';
import { match } from './match';
import { TSQueryNode, TSQuerySelectorNode } from './tsquery-types';

export function parse (selector: string): TSQuerySelectorNode {
    return esquery.parse(selector);
}

export function query<T extends Node = Node> (ast: SourceFile, selector: string): Array<TSQueryNode<T>> {
    return match(ast, parse(selector));
}
