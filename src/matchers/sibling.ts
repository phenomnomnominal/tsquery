// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { getVisitorKeys } from '../traverse';
import { TSQuerySelectorNode } from '../tsquery-types';

export function sibling (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
    return findMatches(node, selector.right, ancestry, scope) &&
        findSibling(node, ancestry, siblingLeft) ||
        selector.left.subject &&
        findMatches(node, selector.left, ancestry, scope) &&
        findSibling(node, ancestry, siblingRight);

    function siblingLeft (prop: any, index: number): boolean {
        return prop.slice(0, index).some((precedingSibling: Node) => {
            return findMatches(precedingSibling, selector.left, ancestry, scope);
        });
    }

    function siblingRight (prop: any, index: number): boolean {
        return prop.slice(index, prop.length).some((followingSibling: Node) => {
            return findMatches(followingSibling, selector.right, ancestry, scope);
        });
    }
}

export function adjacent (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node): boolean {
    return findMatches(node, selector.right, ancestry, scope) &&
        findSibling(node, ancestry, adjacentLeft) ||
        selector.right.subject &&
        findMatches(node, selector.left, ancestry, scope) &&
        findSibling(node, ancestry, adjacentRight);

    function adjacentLeft (prop: any, index: number): boolean {
        return index > 0 && findMatches(prop[index - 1], selector.left, ancestry, scope);
    }

    function adjacentRight (prop: any, index: number): boolean {
        return index < prop.length - 1 && findMatches(prop[index + 1], selector.right, ancestry, scope);
    }
}

function findSibling (node: Node, ancestry: Array<Node>, test: (prop: any, index: number) => boolean): boolean {
    const [parent] = ancestry;
    if (!parent) {
        return false;
    }

    const keys = getVisitorKeys(node.parent || null);
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
