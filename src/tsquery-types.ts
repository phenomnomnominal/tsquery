// Dependencies:
import { Node, SourceFile } from 'typescript';

export type TSQueryApi = {
   <T extends Node = Node>(ast: Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>>;
   ast (text: string, fileName?: string): SourceFile;
   match<T extends Node = Node> (ast: Node | TSQueryNode<T>, selector: TSQuerySelectorNode): Array<TSQueryNode<T>>;
   matches (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>): boolean;
   parse (selector: string): TSQuerySelectorNode;
   query<T extends Node = Node> (ast: Node | TSQueryNode<T>, selector: string): Array<TSQueryNode<T>>;
};

export type TSQueryAttributeOperatorType = 'regexp' | 'literal' | 'type';
export type TSQueryAttributeOperator = (obj: any, value: any, type: TSQueryAttributeOperatorType) => boolean;
export type TSQueryAttributeOperators = {
    [key: string]: TSQueryAttributeOperator
};

export type TSQueryMatcher = (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>) => boolean;
export type TSQueryMatchers = {
    [key: string]: TSQueryMatcher;
};

export type TSQueryNode<T extends Node = Node> = T & {
    // We convert the `kind` property to its string name from the `SyntaxKind` enum:
    // Some nodes have more that one applicable `SyntaxKind`...
    kindName: string;
    // We add a "name" property to `Node`s with `type` `SyntaxKind.Identifier`:
    name?: string;
    // We automatically call `getText()` so it can be selected on:
    text: string;
    // We parse the `text` to a `value` for all Literals:
    value?: any;
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
    type: TSQueryAttributeOperatorType;
    value: TSQuerySelectorNode | RegExp | number | string;
};

export type TSQueryTraverseOptions<T extends Node> = {
    enter: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
    leave: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
};
