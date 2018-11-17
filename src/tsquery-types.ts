// Dependencies:
import { Node, ScriptKind, SourceFile, SyntaxKind } from 'typescript';

export type TSQueryNodeTransformer = (node: Node) => Node | null | undefined;
export type TSQueryStringTransformer = (node: Node) => string | null | undefined;

export type TSQueryApi = {
   <T extends Node = Node> (ast: string | Node, selector: string, options?: TSQueryOptions): Array<T>;
   ast (source: string, fileName?: string, scriptKind?: ScriptKind): SourceFile;
   map (ast: SourceFile, selector: string, nodeTransformer: TSQueryNodeTransformer, options?: TSQueryOptions): SourceFile;
   match <T extends Node = Node> (ast: Node, selector: TSQuerySelectorNode, node: Node, options?: TSQueryOptions): Array<T>;
   parse (selector: string, options?: TSQueryOptions): TSQuerySelectorNode;
   project (configFilePath: string): Array<SourceFile>;
   query <T extends Node = Node> (ast: string | Node, selector: string, options?: TSQueryOptions): Array<T>;
   replace (source: string, selector: string, stringTransformer: TSQueryStringTransformer, options?: TSQueryOptions): string;
   syntaxKindName (node: SyntaxKind): string;
};

export type TSQueryAttributeOperatorType = 'regexp' | 'literal' | 'type';
export type TSQueryAttributeOperator = (obj: any, value: any, type: TSQueryAttributeOperatorType) => boolean;
export type TSQueryAttributeOperators = {
    [key: string]: TSQueryAttributeOperator
};

export type TSQueryMatcher = (node: Node, selector: TSQuerySelectorNode, ancestry: Array<Node>, scope: Node, options: TSQueryOptions) => boolean;
export type TSQueryMatchers = {
    [key: string]: TSQueryMatcher;
};

export type TSQueryProperties = {
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

export type TSQueryTraverseOptions = {
    enter: (node: Node, parent: Node | null) => void;
    leave: (node: Node, parent: Node | null) => void;
    visitAllChildren: boolean;
};
