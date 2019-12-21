// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { traverseChildren } from '../traverse';
import { TSQueryOptions, TSQuerySelectorNode } from '../tsquery-types';

export function has(
  node: Node,
  selector: TSQuerySelectorNode,
  _: Array<Node>,
  options: TSQueryOptions
): boolean {
  const collector: Array<Node> = [];
  selector.selectors.forEach(childSelector => {
    traverseChildren(
      node,
      (childNode: Node, ancestry: Array<Node>) => {
        if (findMatches(childNode, childSelector, ancestry)) {
          collector.push(childNode);
        }
      },
      options
    );
  });
  return collector.length > 0;
}
