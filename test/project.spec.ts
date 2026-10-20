import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { tsquery, files, query } from '../src/index.js';

let directory: string;
beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), 'tsquery-project-'));
  writeFileSync(
    join(directory, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: { types: [], noLib: true },
      files: ['main.ts']
    })
  );
  writeFileSync(
    join(directory, 'main.ts'),
    "import { answer } from './dependency.js'; export { answer };"
  );
  writeFileSync(join(directory, 'dependency.ts'), 'export const answer = 42;');
  writeFileSync(
    join(directory, 'excluded.ts'),
    'export const excluded = true;'
  );
});
afterAll(() => rmSync(directory, { recursive: true, force: true }));

describe('project', () => {
  it.each(['tsconfig.json', '.'])('loads the program from %s', (config) => {
    const sourceFiles = tsquery.project(join(directory, config));
    expect(sourceFiles.map((file) => basename(file.fileName)).sort()).toEqual([
      'dependency.ts',
      'main.ts'
    ]);
    // The returned ASTs remain queryable after the program has been disposed.
    const dependency = sourceFiles.find(
      (file) => basename(file.fileName) === 'dependency.ts'
    );
    if (!dependency) throw new Error('Missing dependency');
    expect(query(dependency, 'NumericLiteral[value=42]')).toHaveLength(1);
  });
  it('returns only configured root files from files()', () => {
    expect(files(join(directory, 'tsconfig.json'))).toEqual([
      join(directory, 'main.ts')
    ]);
    expect(files(directory)).toEqual(files(join(directory, 'tsconfig.json')));
    expect(tsquery.projectFiles(directory)).toEqual(files(directory));
  });
  it('returns no files for a missing configuration', () => {
    expect(files(join(directory, 'missing'))).toEqual([]);
    expect(tsquery.project(join(directory, 'missing'))).toEqual([]);
  });
});
