import type { Node, SourceFile } from 'typescript/ast';
import type { Printer } from 'typescript/sync';

import { isSourceFile } from 'typescript/ast/is';
import { withAPI } from './native-api.js';

/** Options supported by the TypeScript native printer. */
export type PrinterOptions = Parameters<Printer['printNode']>[1];

/**
 * @public
 * Print a given `Node` or `SourceFile` to a string, using the native TypeScript printer. Parsed and synthesized native nodes are supported without modifying their positions.
 *
 * @param source - the native `Node` or `SourceFile` to print.
 * @param options - native printer options: `preserveSourceNewlines`, `neverAsciiEscape`, and `terminateUnterminatedLiterals`. Defaults to an empty object.
 * @returns the printed code. Leading and trailing whitespace is trimmed when printing a `SourceFile`.
 * @throws a `TypeError` if an unsupported printer option is supplied, including legacy options such as `removeComments` or `newLine`.
 */
export function print(
  source: Node | SourceFile,
  options: PrinterOptions = {}
): string {
  const supportedOptions = new Set([
    'preserveSourceNewlines',
    'neverAsciiEscape',
    'terminateUnterminatedLiterals'
  ]);
  for (const key of Object.keys(options)) {
    if (!supportedOptions.has(key)) {
      throw new TypeError(`Unsupported native printer option: ${key}`);
    }
  }
  return withAPI((api) =>
    isSourceFile(source)
      ? api.printer.printFile(source, options).trim()
      : api.printer.printNode(source, options)
  );
}
