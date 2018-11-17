// Dependencies:
import { Node } from 'typescript';
import { MATCHERS } from './matchers';
import { traverseChildren } from './traverse';
import { TSQueryOptions, TSQuerySelectorNode } from './tsquery-types';

export function match <T extends Node = Node> (node: Node, selector: TSQuerySelectorNode, options: TSQueryOptions = {}): Array<T> {
    const results: Array<T> = [];
    if (!selector) {
        return results;
    }

    if (selector.left) {
        if (selector.left.type as any === 'root') {
            node = getRootNode(node);
        }
    }

    traverseChildren(node, (childNode: Node, ancestry: Array<Node>) => {
        if (findMatches(childNode, selector, ancestry, options)) {
            results.push(childNode as T);
        }
    }, options);

    return results;
}

export function findMatches (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node> = [], options: TSQueryOptions = {}): boolean {
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

function getRootNode(node: Node): Node {
    while (node.parent) {
        node = node.parent;
    }
    return node;
}
