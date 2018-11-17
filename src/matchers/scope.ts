import { Node } from 'typescript';

export function  scope ({}: any, {}: any, ancestry: Array<Node>): boolean {
    return ancestry.length === 0;
}
