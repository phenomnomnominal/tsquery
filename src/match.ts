// Dependencies:
import { Node } from 'typescript';
import { MATCHERS } from './matchers';
import { traverse } from './traverse';
import { TSQueryNode, TSQuerySelectorNode } from './tsquery-types';

export function match<T extends Node = Node> (node: Node | TSQueryNode<T>, selector: TSQuerySelectorNode): Array<TSQueryNode<T>> {
    const ancestry: Array<TSQueryNode<T>> = [];
    const results: Array<TSQueryNode<T>> = [];
    if (!selector) {
        return results;
    }

    traverse(node, {
        enter (child: TSQueryNode<T>, parent: TSQueryNode<T> | null): void {
            if (parent != null) {
                ancestry.unshift(parent);
            }
            if (findMatches(child, selector, ancestry)) {
                results.push(child);
            }
        },
        leave (): void {
            ancestry.shift();
        }
    });
    return results;
}

export function findMatches<T extends Node = Node> (node: TSQueryNode<T>, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode<T>> = []): boolean {
    if (!selector) {
        return true;
    }
    if (!node) {
        return false;
    }

    const matcher = MATCHERS[selector.type];
    if (matcher) {
        return matcher(node, selector, ancestry);
    }

    throw new Error(`Unknown selector type: ${selector.type}`);
}
