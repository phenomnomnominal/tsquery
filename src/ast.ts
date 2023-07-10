import type { Node, SourceFile } from './index';

import { createSourceFile, ScriptTarget } from 'typescript';
import { ScriptKind } from './index';

/**
 * @public
 * Parse a string of code into an Abstract Syntax Tree which can then be queried with TSQuery Selectors.
 *
 * @param source - the code that should be parsed into a [`SourceFile`](https://github.com/microsoft/TypeScript/blob/main/src/services/types.ts#L159). A `SourceFile` is the TypeScript implementation of an Abstract Syntax Tree (with extra details).
 * @param fileName - a name (if known) for the `SourceFile`. Defaults to empty string.
 * @param scriptKind - the TypeScript [`ScriptKind`](https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L7305) of the code. Defaults to `ScriptKind.TSX`. Set this to `ScriptKind.TS` if your code uses the `<Type>` syntax for casting.
 * @returns a TypeScript `SourceFile`.
 */
export function ast(
  source: string,
  fileName = '',
  scriptKind = ScriptKind.TSX
): SourceFile {
  return createSourceFile(
    fileName || '',
    source,
    ScriptTarget.Latest,
    true,
    scriptKind
  );
}


/**
 * @public
 * Ensure that an input is a parsed TypeScript `Node`.
 *
 * @param code - the code that should be parsed into a [`SourceFile`](https://github.com/microsoft/TypeScript/blob/main/src/services/types.ts#L159).
 * @returns a parsed TypeScript `Node`
 */
function ensure(code: string, scriptKind: ScriptKind): Node;
function ensure(code: Node): Node;
function ensure(code: string | Node, scriptKind?: ScriptKind): Node {
  return isNode(code) ? code : ast(code, '', scriptKind);
}
ast.ensure = ensure;

function isNode(node: unknown): node is Node {
  return !!(node as Node).getSourceFile;
}
