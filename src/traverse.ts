// Dependencies:
import { SourceFile, SyntaxKind } from 'typescript';
import { TSQueryNode, TSQueryTraverseOptions } from './tsquery-types';

export function traverse (node: SourceFile | TSQueryNode, options: TSQueryTraverseOptions): void {
    (node as TSQueryNode).kindName = SyntaxKind[node.kind];
    if (!node.text) {
        node.text = node.getText();
    }

    if (node.kind === SyntaxKind.Identifier && !node.name) {
        node.name = node.text;
    }

    options.enter(node as TSQueryNode, node.parent as TSQueryNode || null);
    node.forEachChild(child => traverse(child as TSQueryNode, options));
    options.leave(node as TSQueryNode, node.parent as TSQueryNode || null);
}

export function getVisitorKeys (node: TSQueryNode | null): Array<string> {
    return !!node ? Object.keys(node).filter(key => {
        const value = (node as any)[key];
        return Array.isArray(value) || typeof value === 'object';
    }) : [];
}
