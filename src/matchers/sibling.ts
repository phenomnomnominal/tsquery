import type { Adjacent, Sibling } from 'esquery';
import type { Node } from 'typescript/ast';

import { findMatches } from '../traverse.js';

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

  function siblingLeft(prop: ReadonlyArray<Node>, index: number): boolean {
    return prop
      .slice(0, index)
      .some((precedingSibling: Node) =>
        findMatches(precedingSibling, selector.left, ancestors)
      );
  }

  function siblingRight(prop: ReadonlyArray<Node>, index: number): boolean {
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

  function adjacentLeft(prop: ReadonlyArray<Node>, index: number): boolean {
    return index > 0 && findMatches(prop[index - 1], selector.left, ancestors);
  }

  function adjacentRight(prop: ReadonlyArray<Node>, index: number): boolean {
    return (
      index < prop.length - 1 &&
      findMatches(prop[index + 1], selector.right, ancestors)
    );
  }
}

function findSibling(
  node: Node,
  ancestors: Array<Node>,
  test: (prop: ReadonlyArray<Node>, index: number) => boolean
): boolean {
  const [parent] = ancestors;
  if (!parent) {
    return false;
  }

  return getChildLists(parent).some((prop) => {
    const index = prop.indexOf(node);
    return index >= 0 && test(prop, index);
  });
}

// Native AST child fields are prototype getters, not enumerable own properties.
export function getChildLists(node: Node | null): Array<ReadonlyArray<Node>> {
  if (!node) return [];
  const lists: Array<ReadonlyArray<Node>> = [];
  node.forEachChild(
    () => undefined,
    (list) => {
      lists.push(list);
      return undefined;
    }
  );
  try {
    lists.push(node.getChildren());
  } catch {
    // Synthesized nodes may not support token traversal.
  }
  return lists;
}
