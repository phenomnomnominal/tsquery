import type { Has } from 'esquery';
import type { Node } from 'typescript';

import { findMatches, traverse } from '../traverse';

export function has(node: Node, selector: Has): boolean {
  const collector: Array<Node> = [];
  selector.selectors.forEach((childSelector) => {
    traverse(node, (childNode: Node, ancestors: Array<Node>) => {
      if (findMatches(childNode, childSelector, ancestors)) {
        collector.push(childNode);
      }
    });
  });
  return collector.length > 0;
}
