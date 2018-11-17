import { Node } from "typescript";
import { TSQuerySelectorNode } from "../tsquery-types";

export function  scope (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>): boolean {
    return ancestry.length === 0;
}
