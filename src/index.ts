import { ast } from './ast';
import { map } from './map';
import { match } from './match';
import { parse } from './parse';
import { project, files } from './project';
import { query } from './query';
import { replace } from './replace';
import { syntaxKindName } from './syntax-kind';

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
export type { Node, SourceFile, VisitResult } from 'typescript';
export type { NodeTransformer, StringTransformer } from './types';

export { ScriptKind, SyntaxKind } from 'typescript';

export { ast } from './ast';

export { includes } from './includes';
export { match } from './match';
export { query } from './query';

export { parse } from './parse';

export { map } from './map';
export { replace } from './replace';

export { project, files } from './project';

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
