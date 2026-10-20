import type { MultiSelector } from 'esquery';
import type { Node } from 'typescript/ast';

import { findMatches } from '../traverse.js';

export function matches<Selector extends MultiSelector>(
  modifier: 'some' | 'every'
): (node: Node, selector: Selector, ancestors: Array<Node>) => boolean {
  return function (
    node: Node,
    selector: Selector,
    ancestors: Array<Node>
  ): boolean {
    return selector.selectors[modifier]((childSelector) =>
      findMatches(node, childSelector, ancestors)
    );
  };
}
