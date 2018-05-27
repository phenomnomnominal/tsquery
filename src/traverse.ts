// Dependencies:
import { Node, SyntaxKind } from 'typescript';
import { TSQueryNode, TSQueryTraverseOptions } from './tsquery-types';

// Constants:
const FILTERED_KEYS: Array<string> = ['parent'];
const LITERAL_KINDS: Array<SyntaxKind> = [
    SyntaxKind.FalseKeyword,
    SyntaxKind.NoSubstitutionTemplateLiteral,
    SyntaxKind.NullKeyword,
    SyntaxKind.NumericLiteral,
    SyntaxKind.RegularExpressionLiteral,
    SyntaxKind.StringLiteral,
    SyntaxKind.TrueKeyword
];
const PARSERS: { [key: number]: (node: TSQueryNode) => any } = {
    [SyntaxKind.FalseKeyword]: () => false,
    [SyntaxKind.NoSubstitutionTemplateLiteral]: (node: TSQueryNode) => node.text,
    [SyntaxKind.NullKeyword]: () => null,
    [SyntaxKind.NumericLiteral]: (node: TSQueryNode) => +node.text,
    [SyntaxKind.RegularExpressionLiteral]: (node: TSQueryNode) => new RegExp(node.text),
    [SyntaxKind.StringLiteral]: (node: TSQueryNode) => node.text,
    [SyntaxKind.TrueKeyword]: () => true
};

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
        node.value = PARSERS[node.kind](node);
    }
}

function isNotSet (object: any, property: string): boolean {
    return object[property] == null;
}
