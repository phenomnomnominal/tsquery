// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { TSQuerySelectorNode } from '../tsquery-types';

export function not (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>): boolean {
    return !selector.selectors.some(childSelector => {
        return findMatches(node, childSelector, ancestry);
    });
}
