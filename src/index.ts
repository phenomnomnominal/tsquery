// Dependencies:
import { createAST } from './ast';
import { findMatches, match } from './match';
import { parse } from './parse';
import { query } from './query';
import { TSQueryApi } from './tsquery-types';

const api = <TSQueryApi>query;
api.ast = createAST;
api.match = match;
api.matches = findMatches;
api.parse = parse;
api.query = query;

export const tsquery = api;
