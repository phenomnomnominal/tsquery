// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { TSQuerySelectorNode } from '../tsquery-types';

export function descendant (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
    if (findMatches(node, selector.right, ancestry, scope)) {
        return ancestry.some((ancestor, index) => {
            return findMatches(ancestor, selector.left, ancestry.slice(index + 1), scope);
        });
    }
    return false;
}
