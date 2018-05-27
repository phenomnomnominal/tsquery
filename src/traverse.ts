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
    [SyntaxKind.FalseKeyword as number]: parseBooleanFalse,
    [SyntaxKind.NoSubstitutionTemplateLiteral as number]: parseString,
    [SyntaxKind.NullKeyword as number]: parseNull,
    [SyntaxKind.NumericLiteral as number]: parseNumber,
    [SyntaxKind.RegularExpressionLiteral as number]: parseRegExp,
    [SyntaxKind.StringLiteral as number]: parseString,
    [SyntaxKind.TrueKeyword as number]: parseBooleanTrue
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

function parseString (node: TSQueryNode): string {
    return node.text;
}

function parseBooleanFalse (_: TSQueryNode): boolean {
    return false;
}

function parseBooleanTrue (_: TSQueryNode): boolean {
    return true;
}

function parseNull (_: TSQueryNode): null {
    return null;
}

function parseNumber (node: TSQueryNode): number {
    return +node.text;
}

function parseRegExp (node: TSQueryNode): RegExp {
    return new RegExp(node.text);
}
