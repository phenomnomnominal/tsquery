// Dependencies:
import { Node, SourceFile, transform, TransformationContext, Transformer, TransformerFactory, visitEachChild,  visitNode } from 'typescript';
import { query } from './query';
import { TSQueryNode, TSQueryNodeTransformer } from './tsquery-types';

export function map <T extends Node = Node> (ast: SourceFile, selector: string, iterator: TSQueryNodeTransformer<T>): SourceFile {
    // TODO: Doing map like this means the full tree is visited twice.
    // It might be better to change `query()` to use `transform()`,
    // but with a noop?
    const matches = query(ast, selector);
    const transformer = createTransformer(matches, iterator);
    const [transformed] = transform(ast, [transformer]).transformed;
    return transformed as SourceFile;
}

function createTransformer <T extends Node = Node> (results: Array<TSQueryNode>, iterator: TSQueryNodeTransformer<T>): TransformerFactory<Node | TSQueryNode> {
    return function (context: TransformationContext): Transformer<Node | TSQueryNode> {
        return function (rootNode: Node | TSQueryNode): Node | TSQueryNode {
            function visit (node: Node): Node {
                if (results.includes(node as TSQueryNode)) {
                    const replacement = iterator(node as TSQueryNode);
                    return replacement ? replacement : node;
                }
                return visitEachChild(node, visit, context);
            }
            return visitNode(rootNode, visit);
        };
    };
}
