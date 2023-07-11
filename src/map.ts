import type {
  SourceFile,
  TransformationContext,
  Transformer,
  TransformerFactory
} from 'typescript';
import type { Node, NodeTransformer, Selector, VisitResult } from './index';

import { transform, visitNode, visitEachChild } from 'typescript';
import { ast, match, parse, print } from './index';

/**
 * @public
 * Transform AST `Nodes` within a given `Node` matching a `Selector`. Can be used to do `Node`-based replacement or removal of parts of the input AST.
 *
 * @param sourceFile - the TypeScript [`SourceFile`](https://github.com/microsoft/TypeScript/blob/main/src/services/types.ts#L159) to be searched.
 * @param selector - a TSQuery `Selector` (using the [ESQuery selector syntax](https://github.com/estools/esquery)).
 * @param nodeTransformer - a function to transform any matched `Nodes`. If the original `Node` is returned, there is no change. If a new `Node` is returned, the original `Node` is replaced. If `undefined` is returned, the original `Node` is removed.
 * @returns a transformed `Node`.
 */
export function map(
  sourceFile: SourceFile,
  selector: string | Selector,
  nodeTransformer: NodeTransformer
): SourceFile {
  const matches = match(sourceFile, parse.ensure(selector));
  return mapTransform(sourceFile, matches, nodeTransformer);
}

function mapTransform(
  sourceFile: SourceFile,
  matches: Array<Node>,
  nodeTransformer: NodeTransformer
): SourceFile {
  const transformer = createTransformer((node: Node) => {
    if (matches.includes(node)) {
      return nodeTransformer(node);
    }
    return node;
  });

  const [transformed] = transform(sourceFile, [transformer]).transformed;
  return ast(print(transformed));
}

export function createTransformer(
  nodeTransformer: NodeTransformer
): TransformerFactory<Node> {
  return function (context: TransformationContext): Transformer<Node> {
    return function (rootNode: Node): Node {
      function visit(node: Node): VisitResult<Node | undefined> {
        const replacement = nodeTransformer(node);
        if (replacement !== node) {
          return replacement;
        }

        return visitEachChild(node, visit, context);
      }
      return visitNode(rootNode, visit) || rootNode;
    };
  };
}
