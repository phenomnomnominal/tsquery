// Dependencies:
import { Node, SyntaxKind } from 'typescript';
import { syntaxKindName } from './syntax-kind';
import { TSQueryNode, TSQueryOptions, TSQueryProperties, TSQueryTraverseOptions } from './tsquery-types';

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
const PARSERS: { [key: number]: (properties: TSQueryProperties) => any } = {
    [SyntaxKind.FalseKeyword]: () => false,
    [SyntaxKind.NoSubstitutionTemplateLiteral]: (properties: TSQueryProperties) => properties.text,
    [SyntaxKind.NullKeyword]: () => null,
    [SyntaxKind.NumericLiteral]: (properties: TSQueryProperties) => +properties.text,
    [SyntaxKind.RegularExpressionLiteral]: (properties: TSQueryProperties) => new RegExp(properties.text),
    [SyntaxKind.StringLiteral]: (properties: TSQueryProperties) => properties.text,
    [SyntaxKind.TrueKeyword]: () => true
};

export function traverseChildren (node: Node | TSQueryNode, iterator: (childNode: TSQueryNode, ancestors: Array<TSQueryNode>) => void, options: TSQueryOptions): void {
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
        },
        visitAllChildren: !!options.visitAllChildren
    });
}

function traverse (node: Node | TSQueryNode, traverseOptions: TSQueryTraverseOptions): void {
    traverseOptions.enter(node as TSQueryNode, node.parent as TSQueryNode || null);
    if (traverseOptions.visitAllChildren) {
        node.getChildren().forEach(child => traverse(child as TSQueryNode, traverseOptions));
    } else {
        node.forEachChild(child => traverse(child as TSQueryNode, traverseOptions));
    }
    traverseOptions.leave(node as TSQueryNode, node.parent as TSQueryNode || null);
}

export function getVisitorKeys (node: TSQueryNode | null): Array<string> {
    return !!node ? Object.keys(node)
    .filter(key => !FILTERED_KEYS.includes(key))
    .filter(key => {
        const value = (node as any)[key];
        return Array.isArray(value) || typeof value === 'object';
    }) : [];
}

const propertiesMap = new WeakMap<TSQueryNode, TSQueryProperties>();

export function getProperties (node: TSQueryNode): TSQueryProperties {
    let properties = propertiesMap.get(node);
    if (!properties) {
        properties = {
            kindName: syntaxKindName(node.kind),
            text: hasKey(node, 'text') ? node.text : node.getText()
        };
        if (node.kind === SyntaxKind.Identifier) {
            properties.name = hasKey(node, 'name') ? node.name : properties.text;
        }
        if (LITERAL_KINDS.includes(node.kind)) {
            properties.value = PARSERS[node.kind](properties);
        }
        propertiesMap.set(node, properties);
    }
    return properties;
}

function hasKey<K extends { [key: string]: any }> (node: any, property: keyof K): node is K {
    return node[property] != null;
}
