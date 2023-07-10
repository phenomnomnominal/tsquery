import type { Node, Selector } from './index';
import type { Matcher } from './matchers';
import type { Properties } from './types';

import { SyntaxKind } from 'typescript';
import { syntaxKindName } from './syntax-kind';
import { MATCHERS } from './matchers';

const LITERAL_KINDS: Array<SyntaxKind> = [
  SyntaxKind.FalseKeyword,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.NullKeyword,
  SyntaxKind.NumericLiteral,
  SyntaxKind.RegularExpressionLiteral,
  SyntaxKind.StringLiteral,
  SyntaxKind.TrueKeyword
];

const PARSERS: { [key: number]: (properties: Properties) => unknown } = {
  [SyntaxKind.FalseKeyword]: () => false,
  [SyntaxKind.NoSubstitutionTemplateLiteral]: (properties: Properties) =>
    properties.text,
  [SyntaxKind.NullKeyword]: () => null,
  [SyntaxKind.NumericLiteral]: (properties: Properties) => +properties.text,
  [SyntaxKind.RegularExpressionLiteral]: (properties: Properties) =>
    new RegExp(properties.text),
  [SyntaxKind.StringLiteral]: (properties: Properties) => properties.text,
  [SyntaxKind.TrueKeyword]: () => true
};

export function findMatches(
  node: Node,
  selector: Selector,
  ancestors: Array<Node> = []
): boolean {
  const matcher = MATCHERS[selector.type] as Matcher<Selector>;
  if (matcher) {
    return matcher(node, selector, ancestors);
  }

  throw new SyntaxError(`Unknown selector type: ${selector.type}`);
}

export function traverse(
  node: Node,
  iterator: (node: Node, ancestors: Array<Node>) => void,
  ancestors: Array<Node> = []
): void {
  if (node.parent != null) {
    ancestors.unshift(node.parent);
  }
  iterator(node, ancestors);
  let children: Array<Node> = [];
  try {
    // We need to use `getChildren()` to traverse JSDoc nodes
    children = node.getChildren();
  } catch {
    // but it will fail for synthetic nodes, in which case we fall back:
    node.forEachChild((child) => traverse(child, iterator, ancestors));
  }
  children.forEach((child) => traverse(child, iterator, ancestors));
  ancestors.shift();
}

const propertiesMap = new WeakMap<Node, Properties>();

export function getProperties(node: Node): Properties {
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
  return properties;
}

function hasKey<
  Property extends string,
  K extends { [Key in Property]: string }
>(node: unknown, property: Property): node is K {
  return (node as K)[property as keyof typeof node] != null;
}

function getTextIfNotSynthesized(node: Node): string {
  // getText cannot be called on synthesized nodes - those created using
  // TypeScript's createXxx functions - because its implementation relies
  // upon a node's position. See:
  // https://github.com/microsoft/TypeScript/blob/a8bea77d1efe4984e573760770b78486a5488366/src/services/services.ts#L81-L87
  // https://github.com/microsoft/TypeScript/blob/a685ac426c168a9d8734cac69202afc7cb022408/src/compiler/utilities.ts#L8169-L8173
  return !(node.pos >= 0) ? '' : node.getText();
}
