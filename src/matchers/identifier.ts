// Dependencies:
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function identifier (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    return (selector.value as string).toLowerCase() === node.kindName.toLowerCase();
}
