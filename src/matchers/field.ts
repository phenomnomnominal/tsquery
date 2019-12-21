// Dependencies:
import { Node } from 'typescript';
import { TSQuerySelectorNode } from '../tsquery-types';
import { inPath } from '../utils';

export function field(
  node: Node,
  selector: TSQuerySelectorNode,
  ancestry: Array<Node>
): boolean {
  const path = selector.name.split('.');
  const ancestor = ancestry[path.length - 1];
  return inPath(node, ancestor, path);
}
