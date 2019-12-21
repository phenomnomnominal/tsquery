// Dependencies:
import { Node } from 'typescript';
import { findMatches } from '../match';
import { TSQuerySelectorNode } from '../tsquery-types';

export function child(
  node: Node,
  selector: TSQuerySelectorNode,
  ancestry: Array<Node>
): boolean {
  if (findMatches(node, selector.right, ancestry)) {
    return findMatches(ancestry[0], selector.left, ancestry.slice(1));
  }
  return false;
}
