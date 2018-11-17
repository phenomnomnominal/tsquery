import { Node } from 'typescript';

export function  scope (node: any, {}: any, ancestry: Array<Node>, _scope: Node): boolean {
    return _scope ? node === _scope : ancestry.length === 0;
}
