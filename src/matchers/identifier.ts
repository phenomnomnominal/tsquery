// Dependencies:
import { Node } from 'typescript';
import { syntaxKindName } from '../syntax-kind';
import { TSQuerySelectorNode } from '../tsquery-types';

export function identifier (node: Node, selector: TSQuerySelectorNode): boolean {
    return syntaxKindName(node.kind).toLowerCase() === (selector.value as string).toLowerCase();
}
