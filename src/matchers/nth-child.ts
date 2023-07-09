import type {
  BinarySelector,
  SubjectSelector,
  NthChild,
  NthLastChild
} from 'esquery';
import type { Node } from 'typescript';

import { findMatches } from '../traverse';

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

  const children = node.parent.getChildren();
  return children.indexOf(node) === getIndex(children.length);
}
