// Dependencies:
import { findMatches } from '../match';
import { traverse } from '../traverse';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function has (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    const collector: Array<TSQueryNode> = [];
    selector.selectors.forEach(childSelector => {
        const ancestors: Array<TSQueryNode> = [];
        traverse(node, {
            enter (childNode: TSQueryNode, parentNode: TSQueryNode | null): void {
                if (parentNode != null) {
                    ancestors.unshift(parentNode);
                }
                if (findMatches(childNode, childSelector, ancestors)) {
                  collector.push(childNode);
                }
            },
            leave (): void {
                ancestors.shift();
            }
        });
    });
    return collector.length > 0;
}
