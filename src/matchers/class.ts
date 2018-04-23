// Dependencies:
import { TSQueryMatchers, TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';

// Constants:
const CLASS_MATCHERS: TSQueryMatchers = {
    declaration,
    expression,
    'function': fn,
    pattern,
    statement
};

export function classs (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    if (!node.kindName) {
        return false;
    }

    const matcher = CLASS_MATCHERS[selector.name.toLowerCase()];
    if (matcher) {
        return matcher(node, selector, ancestry);
    }

    throw new Error(`Unknown class name: ${selector.name}`);
}

function declaration (node: TSQueryNode): boolean {
    return node.kindName.endsWith('Declaration');
}

function expression (node: TSQueryNode): boolean {
    const { kindName } = node;
    return kindName.endsWith('Expression') ||
        kindName.endsWith('Literal') ||
        (kindName === 'Identifier' && !!node.parent && (node.parent as TSQueryNode).kindName !== 'MetaProperty') ||
        kindName === 'MetaProperty';
}

function fn (node: TSQueryNode): boolean {
    const { kindName } = node;
    return kindName.startsWith('Function') ||
        kindName === 'ArrowFunction';
}

function pattern (node: TSQueryNode): boolean {
    return node.kindName.endsWith('Pattern') || expression(node);
}

function statement (node: TSQueryNode): boolean {
    return node.kindName.endsWith('Statement') || declaration(node);
}
