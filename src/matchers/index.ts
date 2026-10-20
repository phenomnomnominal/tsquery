import type { Matches, Sequence, Selector } from 'esquery';
import type { Node } from 'typescript/ast';

import { attribute } from './attribute.js';
import { child } from './child.js';
import { classMatcher } from './class.js';
import { descendant } from './descendant.js';
import { field } from './field.js';
import { has } from './has.js';
import { identifier } from './identifier.js';
import { matches } from './matches.js';
import { not } from './not.js';
import { nthChild, nthLastChild } from './nth-child.js';
import { adjacent, sibling } from './sibling.js';
import { type } from './type.js';
import { wildcard } from './wildcard.js';

export type Matcher<Selector> = (
  node: Node,
  selector: Selector,
  ancestors: Array<Node>
) => boolean;

type Matchers = {
  [Key in Selector['type']]: Matcher<Selector & { type: Key }>;
};

export const MATCHERS: Matchers = {
  adjacent,
  attribute,
  child,
  compound: matches<Sequence>('every'),
  class: classMatcher,
  descendant,
  field,
  'nth-child': nthChild,
  'nth-last-child': nthLastChild,
  has,
  identifier,
  matches: matches<Matches>('some'),
  not,
  sibling,
  type,
  wildcard
};
