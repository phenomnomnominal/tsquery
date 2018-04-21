// Dependencies:
import { findMatches } from '../match';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function child (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    if (findMatches(node, selector.right, ancestry)) {
        return findMatches(ancestry[0], selector.left, ancestry.slice(1));
    }
    return false;
}
