// Dependencies:
import { ast } from './ast';
import { findMatches, match } from './match';
import { parse, query } from './tsquery';
import { TSQueryApi } from './tsquery-types';

const api = <TSQueryApi>query;
api.ast = ast;
api.match = match;
api.matches = findMatches;
api.parse = parse;
api.query = query;

export const tsquery = api;
