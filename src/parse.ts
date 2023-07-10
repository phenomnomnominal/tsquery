import type {
  Selector,
  MultiSelector,
  BinarySelector,
  Identifier
} from './index';

import * as esquery from 'esquery';
import { SyntaxKind } from 'typescript';

const IDENTIFIER_QUERY = 'identifier';

/**
 * @public
 * Parse a `string` into an ESQuery `Selector`.
 *
 * @param selector - a TSQuery `Selector` (using the [ESQuery selector syntax](https://github.com/estools/esquery)).
 * @returns a validated `Selector` or `null` if the input `string` is invalid.
 * @throws if the `Selector` is syntactically valid, but contains an invalid TypeScript Node kind.
 */
export function parse(selector: string): Selector | null {
  const cleanSelector = stripComments(stripNewLines(selector));
  return validate(esquery.parse(cleanSelector));
}

/**
 * @public
 * Ensure that an input is a parsed ESQuery `Selector`.
 *
 * @param selector - a TSQuery `Selector` (using the [ESQuery selector syntax](https://github.com/estools/esquery)).
 * @returns a validated `Selector`
 * @throws if the input `string` is invalid.
 */
parse.ensure = function ensure(selector: string | Selector): Selector {
  if (isSelector(selector)) {
    return selector;
  }
  const parsed = parse(selector);
  if (!parsed) {
    throw new SyntaxError(`"${selector}" is not a valid TSQuery Selector.`);
  }
  return parsed;
};

function isSelector(selector: string | Selector): selector is Selector {
  return typeof selector !== 'string';
}

function stripComments(input: string): string {
  return input.replace(/\/\*[\w\W]*\*\//g, '');
}

function stripNewLines(input: string): string {
  return input.replace(/\n/g, '');
}

function validate(selector: Selector): Selector | null {
  if (!selector) {
    return null;
  }

  const { selectors } = selector as MultiSelector;
  if (selectors) {
    selectors.map(validate);
  }
  const { left, right } = selector as BinarySelector;
  if (left) {
    validate(left);
  }
  if (right) {
    validate(right);
  }

  if ((selector.type as string) === IDENTIFIER_QUERY) {
    const { value } = selector as Identifier;
    if (SyntaxKind[value as keyof typeof SyntaxKind] == null) {
      throw new SyntaxError(`"${value}" is not a valid TypeScript Node kind.`);
    }
  }

  return selector;
}
