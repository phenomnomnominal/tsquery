import type { Class, Selector } from 'esquery';
import type { Node } from 'typescript';
import type { Properties } from '../types';

import { getProperties } from '../traverse';

type ClassMatcher = (
  node: Node,
  properties: Properties,
  selector: Selector,
  ancestors: Array<Node>
) => boolean;
export type ClassMatchers = {
  [Key in Class['name']]: ClassMatcher;
};

const CLASS_MATCHERS: ClassMatchers = {
  declaration,
  expression,
  function: functionMatcher,
  pattern,
  statement
};

export function classMatcher(
  node: Node,
  selector: Class,
  ancestors: Array<Node>
): boolean {
  const properties = getProperties(node);
  if (!properties.kindName) {
    return false;
  }

  const matcher = CLASS_MATCHERS[selector.name];
  if (matcher) {
    return matcher(node, properties, selector, ancestors);
  }

  throw new SyntaxError(`Unknown class name: "${selector.name}"`);
}

function declaration(_: Node, properties: Properties): boolean {
  return properties.kindName.endsWith('Declaration');
}

function expression(node: Node, properties: Properties): boolean {
  const { kindName } = properties;
  return (
    kindName.endsWith('Expression') ||
    kindName.endsWith('Literal') ||
    (kindName === 'Identifier' &&
      !!node.parent &&
      getProperties(node.parent).kindName !== 'MetaProperty') ||
    kindName === 'MetaProperty'
  );
}

function functionMatcher(_: Node, properties: Properties): boolean {
  const { kindName } = properties;
  return (
    kindName.startsWith('Function') ||
    kindName === 'ArrowFunction' ||
    kindName === 'MethodDeclaration'
  );
}

function pattern(node: Node, properties: Properties): boolean {
  return (
    properties.kindName.endsWith('Pattern') || expression(node, properties)
  );
}

function statement(node: Node, properties: Properties): boolean {
  return (
    properties.kindName.endsWith('Statement') || declaration(node, properties)
  );
}
