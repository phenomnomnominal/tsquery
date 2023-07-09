import type { Node } from 'typescript';
import { getProperties } from './traverse';

export function getPath(obj: unknown, path: string): unknown {
  const keys = path.split('.');

  for (const key of keys) {
    if (obj == null) {
      return obj;
    }
    const properties = isNode(obj) ? getProperties(obj) : {};
    obj =
      key in properties
        ? properties[key as keyof typeof properties]
        : obj[key as keyof typeof obj];
  }
  return obj;
}

export function isNode(node: unknown): node is Node {
  return !!(node as Node).getSourceFile;
}

export function inPath(
  node: Node,
  ancestor: unknown,
  path: Array<string>
): boolean {
  if (path.length === 0) {
    return node === ancestor;
  }
  if (ancestor == null) {
    return false;
  }

  const [first] = path;
  const field = ancestor[first as keyof typeof ancestor] as unknown;
  const remainingPath = path.slice(1);
  if (Array.isArray(field)) {
    return field.some((item: object) => inPath(node, item, remainingPath));
  } else {
    return inPath(node, field, remainingPath);
  }
}
