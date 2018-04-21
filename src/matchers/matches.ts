// Dependencies:
import { findMatches } from '../match';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function matches (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return selector.selectors.some(childSelector => {
        return findMatches(node, childSelector, ancestry);
    });
}
