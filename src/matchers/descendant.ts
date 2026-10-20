import type { Descendant } from 'esquery';
import type { Node } from 'typescript/ast';

import { findMatches } from '../traverse.js';

export function descendant(
  node: Node,
  selector: Descendant,
  ancestors: Array<Node>
): boolean {
  if (findMatches(node, selector.right, ancestors)) {
    return ancestors.some((ancestor, index): boolean =>
      findMatches(ancestor, selector.left, ancestors.slice(index + 1))
    );
  }
  return false;
}
