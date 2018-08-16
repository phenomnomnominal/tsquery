// Dependencies:
import { Node } from 'typescript';
import { MATCHERS } from './matchers';
import { traverseChildren } from './traverse';
import { TSQueryNode, TSQueryOptions, TSQuerySelectorNode } from './tsquery-types';

export function match <T extends Node = Node> (node: Node | TSQueryNode<T>, selector: TSQuerySelectorNode, options: TSQueryOptions = {}): Array<TSQueryNode<T>> {
    const results: Array<TSQueryNode<T>> = [];
    if (!selector) {
        return results;
    }

    traverseChildren(node, (childNode: TSQueryNode, ancestry: Array<TSQueryNode>) => {
        if (findMatches(childNode, selector, ancestry, options)) {
            results.push(childNode as TSQueryNode<T>);
        }
    }, options);

    return results;
}

export function findMatches (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode> = [], options: TSQueryOptions = {}): boolean {
    if (!selector) {
        return true;
    }
    if (!node) {
        return false;
    }

    const matcher = MATCHERS[selector.type];
    if (matcher) {
        return matcher(node, selector, ancestry, options);
    }

    throw new Error(`Unknown selector type: ${selector.type}`);
}
