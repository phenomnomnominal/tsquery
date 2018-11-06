// Dependencies:
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

// ScriptKind values : https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L4626
export function createAST (source: string, fileName?: string, scriptKind?: number): SourceFile {
    return createSourceFile(fileName || '', source, ScriptTarget.Latest, true, scriptKind);
}
