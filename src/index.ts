// Dependencies:
import { createAST } from './ast';
import { map } from './map';
import { match } from './match';
import { parse } from './parse';
import { project, projectFiles } from './project';
import { query } from './query';
import { replace } from './replace';
import { syntaxKindName } from './syntax-kind';
import { TSQueryApi } from './tsquery-types';

const api = <TSQueryApi>query;
api.ast = createAST;
api.map = map;
api.match = match;
api.parse = parse;
api.project = project;
api.projectFiles = projectFiles;
api.query = query;
api.replace = replace;
api.syntaxKindName = syntaxKindName;

export const tsquery = api;
