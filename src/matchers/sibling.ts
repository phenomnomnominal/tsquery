import type { Adjacent, Sibling } from 'esquery';
import type { Node } from 'typescript';

import { findMatches } from '../traverse';

export function sibling(
  node: Node,
  selector: Sibling,
  ancestors: Array<Node>
): boolean {
  return !!(
    (findMatches(node, selector.right, ancestors) &&
      findSibling(node, ancestors, siblingLeft)) ||
    (selector.left.subject &&
      findMatches(node, selector.left, ancestors) &&
      findSibling(node, ancestors, siblingRight))
  );

  function siblingLeft(prop: Array<Node>, index: number): boolean {
    return prop
      .slice(0, index)
      .some((precedingSibling: Node) =>
        findMatches(precedingSibling, selector.left, ancestors)
      );
  }

  function siblingRight(prop: Array<Node>, index: number): boolean {
    return prop
      .slice(index, prop.length)
      .some((followingSibling: Node) =>
        findMatches(followingSibling, selector.right, ancestors)
      );
  }
}

export function adjacent(
  node: Node,
  selector: Adjacent,
  ancestors: Array<Node>
): boolean {
  return !!(
    (findMatches(node, selector.right, ancestors) &&
      findSibling(node, ancestors, adjacentLeft)) ||
    (selector.right.subject &&
      findMatches(node, selector.left, ancestors) &&
      findSibling(node, ancestors, adjacentRight))
  );

  function adjacentLeft(prop: Array<Node>, index: number): boolean {
    return index > 0 && findMatches(prop[index - 1], selector.left, ancestors);
  }

  function adjacentRight(prop: Array<Node>, index: number): boolean {
    return (
      index < prop.length - 1 &&
      findMatches(prop[index + 1], selector.right, ancestors)
    );
  }
}

function findSibling(
  node: Node,
  ancestors: Array<Node>,
  test: (prop: Array<Node>, index: number) => boolean
): boolean {
  const [parent] = ancestors;
  if (!parent) {
    return false;
  }

  const keys = getVisitorKeys(node.parent || null);
  return keys.some((key) => {
    const prop = node.parent[key as keyof typeof node.parent];
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

const FILTERED_KEYS: Array<string> = ['parent'];

export function getVisitorKeys(node: Node | null): Array<string> {
  return node
    ? Object.keys(node)
        .filter((key) => !FILTERED_KEYS.includes(key))
        .filter((key) => {
          const value = node[key as keyof typeof node];
          return Array.isArray(value) || typeof value === 'object';
        })
    : [];
}
