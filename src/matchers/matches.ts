// Dependencies:
import { findMatches } from '../match';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function matches (modifier: 'some' | 'every'): (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>) => boolean {
    return function (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
        return selector.selectors[modifier](childSelector => {
            return findMatches(node, childSelector, ancestry);
        });
    };
}
