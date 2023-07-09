import type { MultiSelector } from 'esquery';
import type { Node } from 'typescript';

import { findMatches } from '../traverse';

export function not(
  node: Node,
  selector: MultiSelector,
  ancestors: Array<Node>
): boolean {
  return !selector.selectors.some((childSelector) =>
    findMatches(node, childSelector, ancestors)
  );
}
