import type { Matches, Sequence, Selector } from 'esquery';
import type { Node } from 'typescript';

import { attribute } from './attribute';
import { child } from './child';
import { classMatcher } from './class';
import { descendant } from './descendant';
import { field } from './field';
import { has } from './has';
import { identifier } from './identifier';
import { matches } from './matches';
import { not } from './not';
import { nthChild, nthLastChild } from './nth-child';
import { adjacent, sibling } from './sibling';
import { type } from './type';
import { wildcard } from './wildcard';

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
