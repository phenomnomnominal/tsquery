// Dependencies:
import { Node } from 'typescript';
import { addProperties } from './traverse';
import { TSQueryNode } from './tsquery-types';

export function getPath (obj: any, path: string): any {
    const keys = path.split('.');

    for (const key of keys) {
        if (obj == null) {
            return obj;
        }

        // HACK: We need to make sure that the extra properties
        // have been added on nodes that haven't been fully traversed yet...
        if (['text', 'name', 'kindName'].includes(key)) {
            addProperties(obj as TSQueryNode);
        }

        obj = obj[key];
    }
    return obj;
}

export function inPath (node: Node, ancestor: Node, path: Array<string>): boolean {
    if (path.length === 0) {
        return node === ancestor;
    }
    if (ancestor == null) {
        return false;
    }

    const [first] = path;
    const field = (ancestor as any)[first];
    const remainingPath = path.slice(1);
    if (Array.isArray(field)) {
        return field.some(item => inPath(node, item, remainingPath));
    } else {
        return inPath(node, field, remainingPath);
    }
}
