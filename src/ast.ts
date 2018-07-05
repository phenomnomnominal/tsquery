// Dependencies:
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export function createAST (source: string, fileName?: string): SourceFile {
    return createSourceFile(fileName || '', source, ScriptTarget.Latest, true);
}
