// Dependencies:
import * as esquery from 'esquery';
import { SourceFile } from 'typescript';
import { match } from './match';
import { TSQueryNode, TSQuerySelectorNode } from './tsquery-types';

export function parse (selector: string): TSQuerySelectorNode {
    return esquery.parse(selector);
}

export function query (ast: SourceFile, selector: string): Array<TSQueryNode> {
    return match(ast, parse(selector));
}
