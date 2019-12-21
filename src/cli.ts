import { tsquery } from './index';

export function cli(argv: Array<string>): void {
  const [configFilePath, selector] = argv.slice(2);
  const files = tsquery.project(configFilePath);
  const results = files.map(file => {
    return tsquery.query(file, selector, { visitAllChildren: true });
  });
  results.forEach(result => process.stdout.write(JSON.stringify(result)));
}
