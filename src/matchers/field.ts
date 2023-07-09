import type { Field } from 'esquery';
import type { Node } from 'typescript';

import { inPath } from '../utils';

export function field(
  node: Node,
  selector: Field,
  ancestors: Array<Node>
): boolean {
  const path = selector.name.split('.');
  const ancestor = ancestors[path.length - 1];
  return inPath(node, ancestor, path);
}
