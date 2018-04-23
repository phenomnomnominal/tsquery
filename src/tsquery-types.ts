// Dependencies:
import { Node, SourceFile } from 'typescript';

export type TSQueryApi = {
   (ast: SourceFile, selector: string): Array<TSQueryNode>;
   ast (text: string, fileName?: string): SourceFile;
   match (ast: SourceFile, selector: TSQuerySelectorNode): Array<TSQueryNode>;
   matches (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;
   parse (selector: string): TSQuerySelectorNode;
   query (ast: SourceFile, selector: string): Array<TSQueryNode>;
};

export type TSQueryMatcher = (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>) => boolean;
export type TSQueryMatchers = {
    [key: string]: TSQueryMatcher;
};

export type TSQueryNode = Node & {
    // We convert the `kind` property to its string name from the `SyntaxKind` enum:
    kindName: string;
    // We add a "name" property to `Node`s with `type` `SyntaxKind.Identifier`:
    name?: string;
    // We automatically call `getText()` so it can be selected on:
    text: string;
};

export type TSQuerySelectorNode = {
    [key: string]: TSQuerySelectorNode | Array<TSQuerySelectorNode> | RegExp | boolean | number | string;
    index: TSQuerySelectorNode;
    left: TSQuerySelectorNode;
    name: string;
    operator: '=' | '!=' | '<=' | '<' | '>=' | '>';
    right: TSQuerySelectorNode;
    selectors: Array<TSQuerySelectorNode>;
    subject: boolean;
    type: string;
    value: TSQuerySelectorNode | RegExp | number | string;
};

export type TSQueryTraverseOptions = {
    enter: (node: TSQueryNode, parent: TSQueryNode | null) => void;
    leave: (node: TSQueryNode, parent: TSQueryNode | null) => void;
};
