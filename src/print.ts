import type { PrinterOptions } from 'typescript';
import type { Node, SourceFile } from './index';

import { EmitHint, NewLineKind, createPrinter, isSourceFile } from 'typescript';
import { ast } from './index';

/**
 * @public
 * Print a given `Node` or `SourceFile` to a string, using the default TypeScript printer.
 *
 * @param source - the `Node` or `SourceFile` to print.
 * @param options - any `PrinterOptions`.
 * @returns the printed code
 */
export function print(
  source: Node | SourceFile,
  options: PrinterOptions = {}
): string {
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
    ...options
  });

  if (!isSourceFile(source)) {
    const file = ast('');
    deletePos(source);
    return printer.printNode(EmitHint.Unspecified, source, file);
  }

  return printer.printFile(source).trim();
}

type WritableNode = {
  -readonly [Key in keyof Node]: Node[Key];
};

function deletePos(node: WritableNode) {
  node.pos = -1;
  node.forEachChild(deletePos);
}
