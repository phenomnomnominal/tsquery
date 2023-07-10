import type { MultiSelector } from 'esquery';
import type { Node } from 'typescript';

import { findMatches } from '../traverse';

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
