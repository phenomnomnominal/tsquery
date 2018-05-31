// Dependencies:
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function sibling (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findSibling(node, ancestry, siblingLeft) ||
        selector.left.subject &&
        findMatches(node, selector.left, ancestry) &&
        findSibling(node, ancestry, siblingRight);

    function siblingLeft (prop: any, index: number): boolean {
        return prop.slice(0, index).some((precedingSibling: TSQueryNode) => {
            return findMatches(precedingSibling, selector.left, ancestry);
        });
    }

    function siblingRight (prop: any, index: number): boolean {
        return prop.slice(index, prop.length).some((followingSibling: TSQueryNode) => {
            return findMatches(followingSibling, selector.right, ancestry);
        });
    }
}

export function adjacent (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    return findMatches(node, selector.right, ancestry) &&
        findSibling(node, ancestry, adjacentLeft) ||
        selector.right.subject &&
        findMatches(node, selector.left, ancestry) &&
        findSibling(node, ancestry, adjacentRight);

    function adjacentLeft (prop: any, index: number): boolean {
        return index > 0 && findMatches(prop[index - 1], selector.left, ancestry);
    }

    function adjacentRight (prop: any, index: number): boolean {
        return index < prop.length - 1 && findMatches(prop[index + 1], selector.right, ancestry);
    }
}

function findSibling (node: TSQueryNode, ancestry: Array<TSQueryNode>, test: (prop: any, index: number) => boolean): boolean {
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
            return test(prop, index);
        }
        return false;
    });
}
