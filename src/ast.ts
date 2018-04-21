// Dependencies:
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export function ast (text: string, fileName?: string): SourceFile {
    return createSourceFile(fileName || '', text, ScriptTarget.Latest, true);
}
