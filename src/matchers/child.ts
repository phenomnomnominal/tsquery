import type { Child } from 'esquery';
import type { Node } from 'typescript/ast';

import { findMatches } from '../traverse.js';

export function child(
  node: Node,
  selector: Child,
  ancestors: Array<Node>
): boolean {
  if (findMatches(node, selector.right, ancestors)) {
    return findMatches(ancestors[0], selector.left, ancestors.slice(1));
  }
  return false;
}
