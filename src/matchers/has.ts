// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { traverse } from '../traverse';
import { TSQueryOptions, TSQuerySelectorNode } from '../tsquery-types';

export function has (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, {}: Node, {}: TSQueryOptions): boolean {
    const collector: Array<Node> = [];
    const parent = ancestry[0];
    let a: Array<Node> = [];
    for (let i = 0; i < selector.selectors.length; ++i) {
        a = ancestry.slice(parent ? 1 : 0);
        traverse(parent || node, {
            enter (childNode: Node, parentNode: Node | null): void {
                if (parentNode == null) { return; }
                a.unshift(parentNode);
                if (findMatches(childNode, selector.selectors[i], a, node)) {
                collector.push(childNode);
                }
            },
            leave (): void { a.shift(); },
            visitAllChildren: false
        });
    }
    return collector.length !== 0;

}
