// Dependencies:
import { Node, SyntaxKind } from 'typescript';
import { syntaxKindName } from './syntax-kind';
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

export function traverse (node: Node | TSQueryNode, options: TSQueryTraverseOptions): void {
    addProperties(node as TSQueryNode);
    options.enter(node as TSQueryNode, node.parent as TSQueryNode || null);
    node.forEachChild(child => traverse(child as TSQueryNode, options));
    options.leave(node as TSQueryNode, node.parent as TSQueryNode || null);
}

export function traverseChildren (node: Node | TSQueryNode, iterator: (childNode: TSQueryNode, ancestors: Array<TSQueryNode>) => void): void {
    const ancestors: Array<TSQueryNode> = [];
    traverse(node, {
        enter (childNode: TSQueryNode, parentNode: TSQueryNode | null): void {
            if (parentNode != null) {
                ancestors.unshift(parentNode);
            }
            iterator(childNode, ancestors);
        },
        leave (): void {
            ancestors.shift();
        }
    });
}

export function getVisitorKeys (node: TSQueryNode | null): Array<string> {
    return !!node ? Object.keys(node)
    .filter(key => !FILTERED_KEYS.includes(key))
    .filter(key => {
        const value = (node as any)[key];
        return Array.isArray(value) || typeof value === 'object';
    }) : [];
}

export function addProperties (node: TSQueryNode): void {
    if (isNotSet(node, 'kindName')) {
        node.kindName = syntaxKindName(node.kind);
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
