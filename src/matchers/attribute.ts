import type { Attribute } from 'esquery';
import type { Node } from 'typescript';
import type { AttributeOperatorType } from '../types';

import { getPath } from '../utils';

const OPERATOR = {
  '=': equal,
  '!=': notEqual,
  '<=': lessThanEqual,
  '<': lessThan,
  '>=': greaterThanEqual,
  '>': greaterThan
};

export function attribute(node: Node, selector: Attribute): boolean {
  const obj: unknown = getPath(node, selector.name);

  // Bail on undefined but *not* if value is explicitly `null`:
  if (obj === undefined) {
    return false;
  }

  if (selector?.operator == null) {
    return obj != null;
  }

  const { operator } = selector;

  if (!selector?.value) {
    return false;
  }

  const { type, value } = selector.value;

  const matcher = OPERATOR[operator];
  if (matcher) {
    return matcher(obj, value, type);
  }
  return false;
}

function equal(
  obj: unknown,
  value: unknown,
  type: AttributeOperatorType
): boolean {
  switch (type) {
    case 'regexp':
      return typeof obj === 'string' && (value as RegExp).test(obj);
    case 'literal':
      return `${value as string}` === `${obj as string}`;
    case 'type':
      return value === typeof obj;
  }
}

function notEqual(
  obj: unknown,
  value: unknown,
  type: AttributeOperatorType
): boolean {
  switch (type) {
    case 'regexp':
      return typeof obj === 'string' && !(value as RegExp).test(obj);
    case 'literal':
      return `${value as string}` !== `${obj as string}`;
    case 'type':
      return value !== typeof obj;
  }
}

function lessThanEqual(obj: unknown, value: unknown): boolean {
  return (obj as number) <= (value as number);
}

function lessThan(obj: unknown, value: unknown): boolean {
  return (obj as number) < (value as number);
}

function greaterThanEqual(obj: unknown, value: unknown): boolean {
  return (obj as number) >= (value as number);
}

function greaterThan(obj: unknown, value: unknown): boolean {
  return (obj as number) > (value as number);
}
