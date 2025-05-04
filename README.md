# TSQuery

[![npm version](https://img.shields.io/npm/v/@phenomnomnominal/tsquery.svg)](https://img.shields.io/npm/v/@phenomnomnominal/tsquery.svg)

TSQuery is a port of the ESQuery API for TypeScript! TSQuery allows you to query a TypeScript AST for patterns of syntax using a CSS style selector system. 

## Demos:

[ESQuery demo](https://estools.github.io/esquery/) - note that the demo requires JavaScript code, not TypeScript
[TSQuery demo](https://tsquery-playground.firebaseapp.com) by [Uri Shaked](https://github.com/urish)

## Installation

```sh
npm install @phenomnomnominal/tsquery --save-dev
```

## Examples

Say we want to select all instances of an identifier with name "Animal", e.g. the identifier in the `class` declaration, and the identifier in the `extends` declaration.

We would do something like the following:

```ts
import { ast, query } from '@phenomnomnominal/tsquery';

const typescript = `

class Animal {
    constructor(public name: string) { }
    move(distanceInMeters: number = 0) {
        console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

`;

const tree = ast(typescript);
const nodes = query(tree, 'Identifier[name="Animal"]');
console.log(nodes.length); // 2
```

### Selectors

The following selectors are supported:

* AST node type: `ForStatement` (see [common node types](#common-ast-node-types))
* [wildcard](http://dev.w3.org/csswg/selectors4/#universal-selector): `*`
* [attribute existence](http://dev.w3.org/csswg/selectors4/#attribute-selectors): `[attr]`
* [attribute value](http://dev.w3.org/csswg/selectors4/#attribute-selectors): `[attr="foo"]` or `[attr=123]`
* attribute regex: `[attr=/foo.*/]`
* attribute conditions: `[attr!="foo"]`, `[attr>2]`, `[attr<3]`, `[attr>=2]`, or `[attr<=3]`
* nested attribute: `[attr.level2="foo"]`
* field: `FunctionDeclaration > Identifier.id`
* [First](http://dev.w3.org/csswg/selectors4/#the-first-child-pseudo) or [last](http://dev.w3.org/csswg/selectors4/#the-last-child-pseudo) child: `:first-child` or `:last-child`
* [nth-child](http://dev.w3.org/csswg/selectors4/#the-nth-child-pseudo) (no ax+b support): `:nth-child(2)`
* [nth-last-child](http://dev.w3.org/csswg/selectors4/#the-nth-last-child-pseudo) (no ax+b support): `:nth-last-child(1)`
* [descendant](http://dev.w3.org/csswg/selectors4/#descendant-combinators): `ancestor descendant`
* [child](http://dev.w3.org/csswg/selectors4/#child-combinators): `parent > child`
* [following sibling](http://dev.w3.org/csswg/selectors4/#general-sibling-combinators): `node ~ sibling`
* [adjacent sibling](http://dev.w3.org/csswg/selectors4/#adjacent-sibling-combinators): `node + adjacent`
* [negation](http://dev.w3.org/csswg/selectors4/#negation-pseudo): `:not(ForStatement)`
* [matches-any](http://dev.w3.org/csswg/selectors4/#matches): `:matches([attr] > :first-child, :last-child)`
* [has](https://drafts.csswg.org/selectors-4/#has-pseudo): `IfStatement:has([name="foo"])`
* class of AST node: `:statement`, `:expression`, `:declaration`, `:function`, or `:pattern`

### Common AST node types

* `Identifier` - any identifier (name of a function, class, variable, etc)
* `IfStatement`, `ForStatement`, `WhileStatement`, `DoStatement` - control flow
* `FunctionDeclaration`, `ClassDeclaration`, `ArrowFunction` - declarations
* `VariableStatement` - var, const, let.
* `ImportDeclaration` - any `import` statement
* `StringLiteral` - any string
* `TrueKeyword`, `FalseKeyword`, `NullKeyword`, `AnyKeyword` - various keywords
* `CallExpression` - function call
* `NumericLiteral` - any numeric constant
* `NoSubstitutionTemplateLiteral`, `TemplateExpression` - template strings and expressions

## API:

### `ast`:

Parse a string of code into an Abstract Syntax Tree which can then be queried with TSQuery Selectors.

```typescript
import { ast } from '@phenomnomnominal/tsquery';

const sourceFile = ast('const x = 1;');
```

### `includes`:

Check for `Nodes` within a given `string` of code or AST `Node` matching a `Selector`.

```typescript
import { includes } from '@phenomnomnominal/tsquery';

const hasIdentifier = includes('const x = 1;', 'Identifier');
```

### `map`:

Transform AST `Nodes` within a given `Node` matching a `Selector`. Can be used to do `Node`-based replacement or removal of parts of the input AST.

```typescript
import { factory } from 'typescript';
import { map } from '@phenomnomnominal/tsquery';

const tree = ast('const x = 1;')
const updatedTree = map(tree, 'Identifier', () => factory.createIdentifier('y'));
```

### `match`:

Find AST `Nodes` within a given AST `Node` matching a `Selector`.

```typescript
import { ast, match } from '@phenomnomnominal/tsquery';

const tree = ast('const x = 1;')
const [xNode] = match(tree, 'Identifier');
```

### `parse`:

Parse a `string` into an [ESQuery](https://github.com/estools/esquery) `Selector`.

```typescript
import { parse } from '@phenomnomnominal/tsquery';

const selector = parse(':matches([attr] > :first-child, :last-child)');
```

### `print`:

Print a given `Node` or `SourceFile` to a string, using the default TypeScript printer.

```typescript
import { print } from '@phenomnomnominal/tsquery';
import { factory } from 'typescript';

  // create synthetic node:
const node = factory.createArrowFunction(
  // ...
);
const code = print(node);
```

### `project`:

Get all the `SourceFiles` included in a the TypeScript project described by a given config file.

```typescript
import { project } from '@phenomnomnominal/tsquery';

const files = project('./tsconfig.json');
```

### `files`:

Get all the file paths included ina the TypeScript project described by a given config file.

```typescript
import { files } from '@phenomnomnominal/tsquery';

const filePaths = files('./tsconfig.json');
```

### `match`:

Find AST `Nodes` within a given `string` of code or AST `Node` matching a `Selector`.

```typescript
import {query } from '@phenomnomnominal/tsquery';

const [xNode] = query('const x = 1;', 'Identifier');
```

### `replace`:

Transform AST `Nodes` within a given `Node` matching a `Selector`. Can be used to do string-based replacement or removal of parts of the input AST. The updated code will be printed with the TypeScript [`Printer`](https://github.com/microsoft/TypeScript-wiki/blob/main/Using-the-Compiler-API.md#creating-and-printing-a-typescript-ast), so you may need to run your own formatter on any output code.

```typescript
import { replace } from '@phenomnomnominal/tsquery';

const updatedCode = replace('const x = 1;', 'Identifier', () => 'y'));
```
