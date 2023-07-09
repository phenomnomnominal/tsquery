import type { Node, VisitResult } from './index';

export type NodeTransformer = (node: Node) => VisitResult<Node | undefined>;
export type StringTransformer = (node: Node) => string | null;

export type AttributeOperatorType = 'regexp' | 'literal' | 'type';
export type AttributeOperator = (
  obj: unknown,
  value: unknown,
  type: AttributeOperatorType
) => boolean;

export type Properties = {
  // We convert the `kind` property to its string name from the `SyntaxKind` enum:
  // Some nodes have more that one applicable `SyntaxKind`...
  kindName: string;
  // We add a 'name' property to `Node`s with `type` `SyntaxKind.Identifier`:
  name?: string;
  // We automatically call `getText()` so it can be selected on:
  text: string;
  // We parse the `text` to a `value` for all Literals:
  value?: unknown;
};
