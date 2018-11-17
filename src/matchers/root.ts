import { Node } from "typescript";

export function  root ({}: any, {}: any, ancestry: Array<Node>): boolean {
    return ancestry.length === 0;
}
