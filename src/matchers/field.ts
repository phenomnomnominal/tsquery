// Dependencies:
import { TSQueryNode, TSQuerySelectorNode } from '../tsquery-types';
import { inPath } from '../utils';

export function field (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean {
    const path = selector.name.split('.');
    const ancestor = ancestry[path.length - 1];
    return inPath(node, ancestor, path);
}
