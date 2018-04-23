// Dependencies:
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

// Constants:
const LEFT = 'left';
const RIGHT = 'right';

export function sibling (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findSibling(node, selector.left, ancestry, LEFT) ||
        selector.left.subject &&
        findMatches(node, selector.left, ancestry) &&
        findSibling(node, selector.right, ancestry, RIGHT);
}

function findSibling (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>, side: string): boolean {
    const [parent] = ancestry;
    if (!parent) {
        return false;
    }
    const keys = getVisitorKeys(node.parent as TSQueryNode || null);
    return keys.some(key => {
        const prop = (node.parent as any)[key];
        if (Array.isArray(prop)) {
            const index = prop.indexOf(node);
            if (index === -1) {
                return false;
            }

            if (side === LEFT) {
                return prop.slice(0, index).some(precedingSibling => {
                    return findMatches(precedingSibling, selector, ancestry);
                });
            }
            if (side === RIGHT) {
                return prop.slice(index, prop.length).some(followingSibling => {
                    return findMatches(followingSibling, selector, ancestry);
                });
            }
        }
        return false;
    });
}
