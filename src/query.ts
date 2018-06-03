// Dependencies:
import { Node } from 'typescript';
import { match } from './match';
import { parse } from './parse';
import { TSQueryNode } from './tsquery-types';

export function query <T extends Node = Node> (ast: Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>> {
    return match<T>(ast, parse(selector));
}
