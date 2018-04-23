// Dependencies:
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';
import { getPath } from '../utils';

// Constants:
const OPERATOR: { [key: string]: (obj: any, value: any, type: string) => boolean } = {
    '=': equal,
    '!=': notEqual,
    '<=': lessThanEqual,
    '<': lessThan,
    '>=': greaterThanEqual,
    '>': greaterThan
};

export function attribute (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    const obj: any = getPath(node, selector.name);

    // Bail on undefined but *not* if value is explicitly `null`:
    if (obj === undefined) {
        return false;
    }

    const { operator } = selector;

    if (operator == null) {
        return obj != null;
    }

    const { type, value } = selector.value as TSQuerySelectorNode;

    const matcher = OPERATOR[operator];
    if (matcher) {
        return matcher(obj, value, type);
    }
    return false;
}

function equal (obj: any, value: any, type: string): boolean {
    switch (type) {
        case 'regexp': return typeof obj === 'string' && (value as RegExp).test(obj);
        case 'literal': return `${value}` === `${obj}`;
        case 'type': return value === typeof obj;
    }
    return false;
}

function notEqual (obj: any, value: any, type: string): boolean {
    switch (type) {
        case 'regexp': return typeof obj === 'string' && !(value as RegExp).test(obj);
        case 'literal': return `${value}` !== `${obj}`;
        case 'type': return value !== typeof obj;
    }
    return false;
}

function lessThanEqual (obj: any, value: any): boolean {
    return obj <= value;
}

function lessThan (obj: any, value: any): boolean {
    return obj < value;
}

function greaterThanEqual (obj: any, value: any): boolean {
    return obj >= value;
}

function greaterThan (obj: any, value: any): boolean {
    return obj > value;
}
