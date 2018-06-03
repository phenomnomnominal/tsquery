// Dependencies:
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function identifier (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    return node.kindName.toLowerCase() === (selector.value as string).toLowerCase();
}
