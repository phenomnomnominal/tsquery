// Dependencies:
import { Node, SyntaxKind } from 'typescript';
import { TSQueryNode, TSQueryTraverseOptions } from './tsquery-types';

// Constants:
const FILTERED_KEYS: Array<string> = ['parent'];
const LITERAL_KINDS: Array<SyntaxKind> = [
    SyntaxKind.FirstLiteralToken,
    SyntaxKind.FalseKeyword,
    SyntaxKind.LastLiteralToken,
    SyntaxKind.NullKeyword,
    SyntaxKind.NumericLiteral,
    SyntaxKind.RegularExpressionLiteral,
    SyntaxKind.StringLiteral,
    SyntaxKind.TrueKeyword
];

export function traverse<T extends Node = Node> (node: Node | TSQueryNode<T>, options: TSQueryTraverseOptions<T>): void {
    addProperties(node as TSQueryNode<T>);
    options.enter(node as TSQueryNode<T>, node.parent as TSQueryNode<T> || null);
    node.forEachChild(child => traverse(child as TSQueryNode<T>, options));
    options.leave(node as TSQueryNode<T>, node.parent as TSQueryNode<T> || null);
}

export function getVisitorKeys<T extends Node = Node> (node: TSQueryNode<T> | null): Array<string> {
    return !!node ? Object.keys(node)
    .filter(key => !FILTERED_KEYS.includes(key))
    .filter(key => {
        const value = (node as any)[key];
        return Array.isArray(value) || typeof value === 'object';
    }) : [];
}

export function addProperties (node: TSQueryNode): void {
    if (isNotSet(node, 'kindName')) {
        node.kindName = SyntaxKind[node.kind];
    }

    if (isNotSet(node, 'text')) {
        node.text = node.getText();
    }

    if (node.kind === SyntaxKind.Identifier && isNotSet(node, 'name')) {
        node.name = node.text;
    }

    if (isNotSet(node, 'value') && LITERAL_KINDS.includes(node.kind)) {
        node.value = parseType(node);
    }
}

export function parseType (node: TSQueryNode): any {
    if (node.text === 'true') {
        return true;
    }
    if (node.text === 'false') {
        return false;
    }
    if (node.text === 'null') {
        return null;
    }
    if (!isNaN(+node.text)) {
        return +node.text;
    }
    if (node.text.startsWith('/') && node.text.endsWith('/')) {
        return new RegExp(node.text);
    }
    return node.text;
}

function isNotSet (object: any, property: string): boolean {
    return object[property] == null;
}
