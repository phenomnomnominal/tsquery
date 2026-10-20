import type { SourceFile } from './index.js';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { withAPI } from './native-api.js';

/**
 * @public
 * Get all the `SourceFiles` included in the TypeScript project described by a given config file, including resolved imports and default library files.
 *
 * @param configFilePath - the path to the TypeScript config file, or a directory containing a `tsconfig.json` file.
 * @returns an `Array` of native `SourceFiles` for the project, or an empty array if the config file cannot be found. The returned syntax trees can be queried after the native program is disposed.
 */
export function project(configFilePath: string): Array<SourceFile> {
  const fullPath = findConfig(configFilePath);
  if (!fullPath) return [];
  return withAPI((api) => {
    const parsed = api.parseConfigFile(fullPath);
    const program = api.createProgram(parsed.fileNames, parsed.options);
    try {
      return program.getSourceFileNames().flatMap((fileName) => {
        const sourceFile = program.getSourceFile(fileName);
        return sourceFile ? [sourceFile] : [];
      });
    } finally {
      program.dispose();
    }
  });
}

/**
 * @public
 * Get the file paths selected by the `files` and `include` settings in a TypeScript project's config file. These are the program's root files; resolved imports and default library files are not added to this list.
 *
 * @param configFilePath - the path to the TypeScript config file, or a directory containing a `tsconfig.json` file.
 * @returns an `Array` of root file paths for the project, or an empty array if the config file cannot be found.
 */
export function files(configFilePath: string): Array<string> {
  const fullPath = findConfig(configFilePath);
  return fullPath
    ? withAPI((api) => api.parseConfigFile(fullPath).fileNames)
    : [];
}

function findConfig(configFilePath: string): string | undefined {
  try {
    const fullPath = path.resolve(configFilePath);
    const configPath = fs.statSync(fullPath).isDirectory()
      ? path.join(fullPath, 'tsconfig.json')
      : fullPath;
    fs.accessSync(configPath);
    return configPath;
  } catch {
    return undefined;
  }
}
