import { Node } from "typescript";
import { TSQuerySelectorNode } from "../tsquery-types";

export function  root (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>): boolean {
    return ancestry.length === 0;
}
