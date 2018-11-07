// Dependencies:
import { Node, ScriptKind, SourceFile, SyntaxKind } from 'typescript';

export type TSQueryNodeTransformer<T extends Node = Node> = (node: Node | TSQueryNode<T>) => Node | null | undefined;
export type TSQueryStringTransformer<T extends Node = Node> = (node: Node | TSQueryNode<T>) => string | null | undefined;

export type TSQueryApi = {
   <T extends Node = Node> (ast: string | Node | TSQueryNode<T>, selector: string, options?: TSQueryOptions): Array<TSQueryNode<T>>;
   ast (source: string, fileName?: string, scriptKind?: ScriptKind): SourceFile;
   map <T extends Node = Node> (ast: SourceFile, selector: string, nodeTransformer: TSQueryNodeTransformer<T>, options?: TSQueryOptions): SourceFile;
   match <T extends Node = Node> (ast: Node | TSQueryNode<T>, selector: TSQuerySelectorNode, options?: TSQueryOptions): Array<TSQueryNode<T>>;
   parse (selector: string, options?: TSQueryOptions): TSQuerySelectorNode;
   project (configFilePath: string): Array<SourceFile>;
   query <T extends Node = Node> (ast: string | Node | TSQueryNode<T>, selector: string, options?: TSQueryOptions): Array<TSQueryNode<T>>;
   replace <T extends Node = Node> (source: string, selector: string, stringTransformer: TSQueryStringTransformer<T>, options?: TSQueryOptions): string;
   syntaxKindName (node: SyntaxKind): string;
};

export type TSQueryAttributeOperatorType = 'regexp' | 'literal' | 'type';
export type TSQueryAttributeOperator = (obj: any, value: any, type: TSQueryAttributeOperatorType) => boolean;
export type TSQueryAttributeOperators = {
    [key: string]: TSQueryAttributeOperator
};

export type TSQueryMatcher = (node: TSQueryNode, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode>, options: TSQueryOptions) => boolean;
export type TSQueryMatchers = {
    [key: string]: TSQueryMatcher;
};

export type TSQueryNode <T extends Node = Node> = T & {
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

export type TSQueryOptions = {
    visitAllChildren?: boolean;
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

export type TSQueryTraverseOptions <T extends Node = Node> = {
    enter: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
    leave: (node: TSQueryNode<T>, parent: TSQueryNode<T> | null) => void;
    visitAllChildren: boolean;
};
