// Dependencies:
import { Node, SyntaxKind } from 'typescript';
import { syntaxKindName } from './syntax-kind';
import {
  TSQueryOptions,
  TSQueryProperties,
  TSQueryTraverseOptions
} from './tsquery-types';

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
  [SyntaxKind.NoSubstitutionTemplateLiteral]: (properties: TSQueryProperties) =>
    properties.text,
  [SyntaxKind.NullKeyword]: () => null,
  [SyntaxKind.NumericLiteral]: (properties: TSQueryProperties) =>
    +properties.text,
  [SyntaxKind.RegularExpressionLiteral]: (properties: TSQueryProperties) =>
    new RegExp(properties.text),
  [SyntaxKind.StringLiteral]: (properties: TSQueryProperties) =>
    properties.text,
  [SyntaxKind.TrueKeyword]: () => true
};

export function traverseChildren(
  node: Node,
  iterator: (childNode: Node, ancestors: Array<Node>) => void,
  options: TSQueryOptions
): void {
  const ancestors: Array<Node> = [];
  traverse(node, {
    enter(childNode: Node, parentNode: Node | null): void {
      if (parentNode != null) {
        ancestors.unshift(parentNode);
      }
      iterator(childNode, ancestors);
    },
    leave(): void {
      ancestors.shift();
    },
    visitAllChildren: !!options.visitAllChildren
  });
}

function traverse(node: Node, traverseOptions: TSQueryTraverseOptions): void {
  traverseOptions.enter(node, node.parent || null);
  if (traverseOptions.visitAllChildren) {
    node.getChildren().forEach(child => traverse(child, traverseOptions));
  } else {
    node.forEachChild(child => traverse(child, traverseOptions));
  }
  traverseOptions.leave(node, node.parent || null);
}

export function getVisitorKeys(node: Node | null): Array<string> {
  return !!node
    ? Object.keys(node)
        .filter(key => !FILTERED_KEYS.includes(key))
        .filter(key => {
          const value = (node as any)[key];
          return Array.isArray(value) || typeof value === 'object';
        })
    : [];
}

const propertiesMap = new WeakMap<Node, TSQueryProperties>();

export function getProperties (node: Node): TSQueryProperties {
    let properties = propertiesMap.get(node);
    if (!properties) {
        properties = {
            kindName: syntaxKindName(node.kind),
            text: hasKey(node, 'text') ? node.text : getTextIfNotSynthesized(node)
        };
        if (node.kind === SyntaxKind.Identifier) {
            properties.name = hasKey(node, 'name') ? node.name : properties.text;
        }
        if (LITERAL_KINDS.includes(node.kind)) {
            properties.value = PARSERS[node.kind](properties);
        }
        propertiesMap.set(node, properties);
    }
    propertiesMap.set(node, properties);
  }
  return properties;
}

function hasKey<K extends { [key: string]: any }>(
  node: any,
  property: keyof K
): node is K {
  return node[property] != null;
}

function getTextIfNotSynthesized (node: Node): string {
    // getText cannot be called on synthesized nodes - those created using
    // TypeScript's createXxx functions - because its implementation relies
    // upon a node's position. See:
    // https://github.com/microsoft/TypeScript/blob/a8bea77d1efe4984e573760770b78486a5488366/src/services/services.ts#L81-L87
    // https://github.com/microsoft/TypeScript/blob/a685ac426c168a9d8734cac69202afc7cb022408/src/compiler/utilities.ts#L8169-L8173
    return !(node.pos >= 0) ? '' : node.getText();
}
