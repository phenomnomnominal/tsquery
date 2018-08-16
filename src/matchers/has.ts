// Dependencies:
import { findMatches } from '../match';
import { traverseChildren } from '../traverse';
import { TSQueryNode, TSQueryOptions, TSQuerySelectorNode } from '../tsquery-types';

export function has (node: TSQueryNode, selector: TSQuerySelectorNode, _: Array<TSQueryNode>, options: TSQueryOptions): boolean {
    const collector: Array<TSQueryNode> = [];
    selector.selectors.forEach(childSelector => {
        traverseChildren(node, (childNode: TSQueryNode, ancestry: Array<TSQueryNode>) => {
            if (findMatches(childNode, childSelector, ancestry)) {
                collector.push(childNode);
            }
        }, options);
    });
    return collector.length > 0;
}
