// Dependencies:
import * as esquery from 'esquery';
import { SyntaxKind } from 'typescript';
import { TSQuerySelectorNode } from './tsquery-types';

// Constants:
const IDENTIFIER_QUERY = 'identifier';

export function parse(selector: string): TSQuerySelectorNode {
  return validateParse(esquery.parse(selector));
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
      throw SyntaxError(
        `"${selector.value}" is not a valid TypeScript Node kind.`
      );
    }
  }

  return selector;
}
