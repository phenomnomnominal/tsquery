// Dependencies:
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';
import { getPath } from '../utils';

export function attribute (node: TSQueryNode, selector: TSQuerySelectorNode): boolean {
    const obj: any = getPath(node, selector.name);
    const value = selector.value as TSQuerySelectorNode;
    switch (selector.operator) {
        case null:
        case undefined:
            return obj != null;
        case '=':
            switch (value.type) {
                case 'regexp': return typeof obj === 'string' && (value.value as RegExp).test(obj);
                case 'literal': return `${value.value}` === `${obj}`;
                case 'type': return value.value === typeof obj;
            }
            break;
        case '!=':
            switch (value.type) {
                case 'regexp': return !(value.value as RegExp).test(obj);
                case 'literal': return `${value.value}` !== `${obj}`;
                case 'type': return value.value !== typeof obj;
            }
            break;
        case '<=': return obj <= value.value;
        case '<': return obj < value.value;
        case '>': return obj > value.value;
        case '>=': return obj >= value.value;
    }
    return false;
}
