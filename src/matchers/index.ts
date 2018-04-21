// Dependencies:
import { TSQueryMatchers } from '../tsquery-types';

// Matches:
import { adjacent } from './adjacent';
import { attribute } from './attribute';
import { child } from './child';
import { classs } from './class';
import { compound } from './compound';
import { descendant } from './descendant';
import { field } from './field';
import { has } from './has';
import { identifier } from './identifier';
import { matches } from './matches';
import { not } from './not';
import { nthChild, nthLastChild } from './nth-child';
import { sibling } from './sibling';
import { wildcard } from './wildcard';

export const MATCHERS: TSQueryMatchers = {
    adjacent,
    attribute,
    child,
    compound,
    'class': classs,
    descendant,
    field,
    'nth-child': nthChild,
    'nth-last-child': nthLastChild,
    has,
    identifier,
    matches,
    not,
    sibling,
    wildcard
};
