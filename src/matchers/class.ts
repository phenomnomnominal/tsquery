// Dependencies:
import { Node } from 'typescript';
import { getProperties } from '../traverse';
import { TSQueryMatchers, TSQueryOptions, TSQuerySelectorNode } from '../tsquery-types';

// Constants:
const CLASS_MATCHERS: TSQueryMatchers = {
    declaration,
    expression,
    'function': fn,
    pattern,
    statement
};

export function classs (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, options: TSQueryOptions): boolean {
    if (!getProperties(node).kindName) {
        return false;
    }

    const matcher = CLASS_MATCHERS[selector.name.toLowerCase()];
    if (matcher) {
        return matcher(node, selector, ancestry, options);
    }

    throw new Error(`Unknown class name: ${selector.name}`);
}

function declaration (node: Node): boolean {
    return getProperties(node).kindName.endsWith('Declaration');
}

function expression (node: Node): boolean {
    const { kindName } = getProperties(node);
    return kindName.endsWith('Expression') ||
        kindName.endsWith('Literal') ||
        (kindName === 'Identifier' && !!node.parent && getProperties(node.parent).kindName !== 'MetaProperty') ||
        kindName === 'MetaProperty';
}

function fn (node: Node): boolean {
    const { kindName } = getProperties(node);
    return kindName.startsWith('Function') ||
        kindName === 'ArrowFunction';
}

function pattern (node: Node): boolean {
    return getProperties(node).kindName.endsWith('Pattern') || expression(node);
}

function statement (node: Node): boolean {
    return getProperties(node).kindName.endsWith('Statement') || declaration(node);
}
