import { SyntaxKind } from 'typescript';

// See https://github.com/Microsoft/TypeScript/issues/18062
// Code inspired by https://github.com/fkling/astexplorer/blob/master/website/src/parsers/js/typescript.js
const SYNTAX_KIND_MAP: Record<string, string> = {};

for (const name of Object.keys(SyntaxKind).filter((x) =>
  isNaN(parseInt(x, 10))
)) {
  const value = SyntaxKind[name as keyof typeof SyntaxKind];
  if (!SYNTAX_KIND_MAP[value]) {
    SYNTAX_KIND_MAP[value] = name;
  }
}

/**
 * @deprecated Will be removed in v7.
 *
 * @public
 * Transform AST `Nodes` within a given `Node` matching a `Selector`. Can be used to do `Node`-based replacement or removal of parts of the input AST.
 *
 * @param kind - a [`SyntaxKind`](https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L41) enum value.
 * @returns the name of the `SyntaxKind`.
 */
export function syntaxKindName(kind: SyntaxKind): string {
  return SYNTAX_KIND_MAP[kind];
}
