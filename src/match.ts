// Dependencies:
import { Node, SourceFile } from 'typescript';
import { MATCHERS } from './matchers';
import { traverse } from './traverse';
import { TSQueryNode, TSQuerySelectorNode } from './tsquery-types';

export function match<T extends Node = Node> (ast: SourceFile, selector: TSQuerySelectorNode): Array<TSQueryNode<T>> {
    const ancestry: Array<TSQueryNode<T>> = [];
    const results: Array<TSQueryNode<T>> = [];
    if (!selector) {
        return results;
    }

    traverse(ast, {
        enter (node: TSQueryNode<T>, parent: TSQueryNode<T> | null): void {
            if (parent != null) {
                ancestry.unshift(parent);
            }
            if (findMatches(node, selector, ancestry)) {
                results.push(node);
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
