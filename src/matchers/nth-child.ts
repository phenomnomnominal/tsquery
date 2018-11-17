// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQuerySelectorNode } from '../tsquery-types';

export function nthChild (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
    return findMatches(node, selector.right, ancestry, scope) &&
        findNthChild(node, ancestry, () => (selector.index.value as number) - 1);
}

export function nthLastChild (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
    return findMatches(node, selector.right, ancestry, scope) &&
        findNthChild(node, ancestry, (length: number) => length - (selector.index.value as number));
}

function findNthChild (node: Node, ancestry: Array<Node>, getIndex: (length: number) => number): boolean {
    const [parent] = ancestry;
    if (!parent) {
        return false;
    }
    const keys = getVisitorKeys(node.parent || null);
    return keys.some(key => {
        const prop = (node.parent as any)[key];
        if (Array.isArray(prop)) {
            const index = prop.indexOf(node);
            return index >= 0 && index === getIndex(prop.length);
        }
        return false;
    });
}
