/// <reference lib="esnext.disposable" preserve="true" />
import { ast } from './ast.js';
import { map } from './map.js';
import { match } from './match.js';
import { parse } from './parse.js';
import { project, files } from './project.js';
import { query } from './query.js';
import { replace } from './replace.js';
import { syntaxKindName } from './syntax-kind.js';

export type {
  Selector,
  Field,
  Type,
  Sequence,
  Identifier,
  Wildcard,
  Attribute,
  NthChild,
  NthLastChild,
  Descendant,
  Child,
  Sibling,
  Adjacent,
  Negation,
  Matches,
  Has,
  Class,
  MultiSelector,
  BinarySelector,
  NthSelector,
  SubjectSelector,
  StringLiteral,
  NumericLiteral,
  Literal
} from 'esquery';
export type { Node, SourceFile } from 'typescript/ast';
export type {
  NodeTransformer,
  StringTransformer,
  VisitResult
} from './types.js';

export { ScriptKind, SyntaxKind } from 'typescript/ast';

export { ast } from './ast.js';
export { print } from './print.js';
export type { PrinterOptions } from './print.js';

export { includes } from './includes.js';
export { match } from './match.js';
export { query } from './query.js';

export { parse } from './parse.js';

export { map } from './map.js';
export { replace } from './replace.js';

export { project, files } from './project.js';

export type API = typeof query & {
  ast: typeof ast;
  map: typeof map;
  match: typeof match;
  parse: typeof parse;
  project: typeof project;
  projectFiles: typeof files;
  query: typeof query;
  replace: typeof replace;
  syntaxKindName: typeof syntaxKindName;
};

/**
 * @deprecated Will be removed in v7. Use the directly exported functions instead:
 *
 * ```
 * // Use:
 * import { ast } from '@phenomnomnominal/tsquery';
 * ast('1 + 1')
 *
 * // Don't use:
 * import { tsquery } from '@phenomnomnominal/tsquery';
 * tsquery.ast('1 + 1')
 * ```
 */
const api = <API>query;
api.ast = ast;
api.map = map;
api.match = match;
api.parse = parse;
api.project = project;
api.projectFiles = files;
api.query = query;
api.replace = replace;
api.syntaxKindName = syntaxKindName;

export const tsquery = api;
