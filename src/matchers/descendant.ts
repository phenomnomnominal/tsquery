// Dependencies:
import { findMatches } from '../match';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function descendant (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    if (findMatches(node, selector.right, ancestry)) {
        return ancestry.some((ancestor, index) => {
            return findMatches(ancestor, selector.left, ancestry.slice(index + 1));
        });
    }
    return false;
}
