// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { TSQuerySelectorNode } from '../tsquery-types';

export function matches (modifier: 'some' | 'every'): (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node) => boolean {
    return function (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
        return selector.selectors[modifier](childSelector => {
            return findMatches(node, childSelector, ancestry, scope);
        });
    };
}
