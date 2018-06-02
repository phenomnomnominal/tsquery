// Dependencies:
import { SyntaxKind } from 'typescript';
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

export function identifier (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    if (SyntaxKind[selector.value as any] == null) {
        throw SyntaxError(`"${selector.value}" is not a valid TypeScript Node kind.`);
    }

    return node.kindName.toLowerCase() === (selector.value as string).toLowerCase();
}
