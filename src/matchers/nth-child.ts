import type {
  BinarySelector,
  SubjectSelector,
  NthChild,
  NthLastChild
} from 'esquery';
import type { Node } from 'typescript';

import { findMatches } from '../traverse';
import { getVisitorKeys } from './sibling';

export function nthChild(
  node: Node,
  selector: SubjectSelector,
  ancestors: Array<Node>
): boolean {
  const { right } = selector as BinarySelector;
  if (right && !findMatches(node, right, ancestors)) {
    return false;
  }
  return findNthChild(node, () => (selector as NthChild).index.value - 1);
}

export function nthLastChild(
  node: Node,
  selector: SubjectSelector,
  ancestors: Array<Node>
): boolean {
  const { right } = selector as BinarySelector;
  if (right && !findMatches(node, right, ancestors)) {
    return false;
  }
  return findNthChild(
    node,
    (length: number) => length - (selector as NthLastChild).index.value
  );
}

function findNthChild(
  node: Node,
  getIndex: (length: number) => number
): boolean {
  if (!node.parent) {
    return false;
  }

  const keys = getVisitorKeys(node.parent || null);
  return keys.some((key) => {
    const prop = node.parent[key as keyof Node];
    if (Array.isArray(prop)) {
      const index = prop.indexOf(node);
      return index >= 0 && index === getIndex(prop.length);
    }
    return false;
  });
}
