// Dependencies:
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

// Constants:
const LEFT = 'left';
const RIGHT = 'right';

export function adjacent (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findAdjacent(node, selector.left, ancestry, LEFT) ||
        selector.right.subject &&
        findMatches(node, selector.left, ancestry) &&
        findAdjacent(node, selector.right, ancestry, RIGHT);
}

function findAdjacent (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>, side: string): boolean {
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

            if (side === LEFT && index > 0 && findMatches(prop[index - 1], selector, ancestry)) {
                return true;
            }
            if (side === RIGHT && index < prop.length - 1 && findMatches(prop[index + 1], selector, ancestry)) {
                return true;
            }
        }
        return false;
    });
}
