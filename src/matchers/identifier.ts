// Dependencies:
import { syntaxKindName } from '../syntax-kind';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function identifier (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    return syntaxKindName(node.kind).toLowerCase() === (selector.value as string).toLowerCase();
}
