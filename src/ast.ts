// Dependencies:
import {
  createSourceFile,
  ScriptKind,
  ScriptTarget,
  SourceFile
} from 'typescript';

export function createAST(
  source: string,
  fileName?: string,
  scriptKind?: ScriptKind
): SourceFile {
  return createSourceFile(
    fileName || '',
    source,
    ScriptTarget.Latest,
    true,
    scriptKind
  );
}
