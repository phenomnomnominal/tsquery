import { parse, type Node, type Selector } from './index';

import { findMatches, traverse } from './traverse';

/**
 * @public
 * Find AST `Nodes` within a given AST `Node` matching a `Selector`.
 *
 * @param node - the `Node` to be searched. This could be a TypeScript [`SourceFile`](https://github.com/microsoft/TypeScript/blob/main/src/services/types.ts#L159), or a `Node` from a previous query.
 * @param selector - a TSQuery `Selector` (using the [ESQuery selector syntax](https://github.com/estools/esquery)).
 * @returns an `Array` of `Nodes` which match the `Selector`.
 */
export function match<T extends Node = Node>(
  node: Node,
  selector: string | Selector
): Array<T> {
  const results: Array<T> = [];
  const parsedSelector = parse.ensure(selector);

  traverse(node, (childNode: Node, ancestry: Array<Node>) => {
    if (findMatches(childNode, parsedSelector, ancestry)) {
      results.push(childNode as T);
    }
  });

  return results;
}
