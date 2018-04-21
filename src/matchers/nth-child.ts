// Dependencies:
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function nthChild (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findNthChild(node, ancestry, () => (selector.index.value as number) - 1);
}

export function nthLastChild (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findNthChild(node, ancestry, (length: number) => length - (selector.index.value as number));
}

function findNthChild (node: TSQueryNode, ancestry: Array<TSQueryNode>, getIndex: (length: number) => number): boolean {
    const [parent] = ancestry;
    if (!parent) {
        return false;
    }
    const keys = getVisitorKeys(node.parent as TSQueryNode || null);
    return keys.some(key => {
        const prop = (node.parent as any)[key];
        if (Array.isArray(prop)) {
            const index = prop.indexOf(node);
            return index >= 0 && index === getIndex(prop.length);
        }
        return false;
    });
}
