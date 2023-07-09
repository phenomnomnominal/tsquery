import type { PrinterOptions } from 'typescript';
import type { Node, SourceFile } from './index';

import { NewLineKind, createPrinter, isSourceFile } from 'typescript';
import { ast } from './index';

/**
 * @internal
 * Print a given `Node` or `SourceFile` to a string.
 *
 * @param source - the `Node` or `SourceFile` to print.
 * @param options - any `PrinterOptions`
 * @returns the printed code
 */
export function print(
  source: Node | SourceFile,
  options: PrinterOptions = {}
): string {
  if (!isSourceFile(source)) {
    source = ast(source.getText());
  }

  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
    ...options
  });
  return printer.printFile(source as SourceFile).trim();
}
