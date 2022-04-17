// Dependencies:
import { Node, SourceFile, transform, TransformationContext, Transformer, TransformerFactory, visitEachChild,  visitNode, VisitResult } from 'typescript';
import { query } from './query';
import { TSQueryNodeTransformer, TSQueryOptions } from './tsquery-types';

export function map (ast: SourceFile, selector: string, nodeTransformer: TSQueryNodeTransformer, options: TSQueryOptions = {}): SourceFile {
    // TODO: Doing map like this means the full tree is visited twice.
    // It might be better to change `query()` to use `transform()`,
    // but with a noop?
    const matches = query(ast, selector, options);
    const transformer = createTransformer(matches, nodeTransformer);
    const [transformed] = transform(ast, [transformer]).transformed;
    return transformed as SourceFile;
}

function createTransformer (results: Array<Node>, nodeTransformer: TSQueryNodeTransformer): TransformerFactory<Node> {
    return function (context: TransformationContext): Transformer<Node> {
        return function (rootNode: Node): Node {
            function visit (node: Node): VisitResult<Node> {
                if (results.includes(node)) {
                    return nodeTransformer(node);
                }
                return visitEachChild(node, visit, context);
            }
            return visitNode(rootNode, visit);
        };
    };
}
