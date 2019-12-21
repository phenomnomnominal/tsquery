import { SyntaxKind } from 'typescript';

// See https://github.com/Microsoft/TypeScript/issues/18062
// Code inpired by https://github.com/fkling/astexplorer/blob/master/website/src/parsers/js/typescript.js
export const syntaxKindMap: { [key: string]: string } = {};

for (const name of Object.keys(SyntaxKind).filter(x =>
  isNaN(parseInt(x, 10))
)) {
  const value = SyntaxKind[name as any];
  if (!syntaxKindMap[value]) {
    syntaxKindMap[value] = name;
  }
}

export function syntaxKindName(kind: SyntaxKind): string {
  return syntaxKindMap[kind];
}
