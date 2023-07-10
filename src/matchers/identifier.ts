import type { Identifier } from 'esquery';
import type { Node } from 'typescript';

import { syntaxKindName } from '../syntax-kind';

export function identifier(node: Node, selector: Identifier): boolean {
  const name = syntaxKindName(node.kind);
  return !!name && name.toLowerCase() === selector.value.toLowerCase();
}
