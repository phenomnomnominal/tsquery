// Dependencies:
import esquery from 'esquery';
import { SyntaxKind } from 'typescript';
import { TSQuerySelectorNode } from './tsquery-types';

// Constants:
const IDENTIFIER_QUERY = 'identifier';

export function parse(selector: string): TSQuerySelectorNode {
  const cleanSelector = stripComments(stripNewLines(selector));
  return validateParse(esquery.parse(cleanSelector));
}

function stripComments(selector: string): string {
  return selector.replace(/\/\*[\w\W]*\*\//g, '');
}

function stripNewLines(selector: string): string {
  return selector.replace(/\n/g, '');
}

function validateParse(selector: TSQuerySelectorNode): TSQuerySelectorNode {
  if (!selector) {
    return selector;
  }

  if (selector.selectors) {
    selector.selectors.map(validateParse);
  }
  if (selector.left) {
    validateParse(selector.left);
  }
  if (selector.right) {
    validateParse(selector.right);
  }

  if ((selector.type as string) === IDENTIFIER_QUERY) {
    if (SyntaxKind[selector.value as any] == null) {
      throw SyntaxError(`"${selector.value}" is not a valid TypeScript Node kind.`);
    }
  }

  return selector;
}
