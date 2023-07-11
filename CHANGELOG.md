# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.1] - 2023-07-12

### Fixed

- Fixed the API signature of `map`, so it only works on a `SourceFile`.

## [6.1.0] - 2023-07-11

### Added

- Made the `print` function public, it's useful when doing `map` operations.

## [6.0.1] - 2023-07-11

### Fixed

- Add `@types/esquery` to `dependencies`.


## [6.0.0] - 2023-07-11

I had to use TSQuery recently and found a few bugs, and wanted to add a few ergonomic things, so here's a major release.

The big breaking change here is that `visitAllChildren` is now the default behaviour. Less-specific queries that may have worked in 
previous versions may no longer work exactly the same. This is a pretty annoying change for a very early mistake, but I figured it
was time to pull off the band-aid.

### Added

- `scriptKind` parameter to `query` so the caller can control how TypeScript parses the input code.
- `includes` to simply check if there are any selector matches within some code.
- Direct exports of public functions, e.g. `import { ast } from '@phenomnomnominal/tquery';`
- Type exports for types used in the public API. This includes types from `typescript` and `esquery`. 
- This CHANGELOG file to hopefully list all API changes going forward.

### Fixed

- `replace` now uses the TypeScript `Printer` to format the output code. This means that it will handle AST Node removal better, but also means that you may need to run any formatters (e.g. Prettier) on the result to have it match your codebase. 
- `:function` selector will now match a `MethodDeclaration`.

### Changed

- TSQuery will now query all children by default. This means that less-specific queries that may have worked in previous versions may no longer work exactly the same.
- Deprecated the old API, will remove in v7. Prefer importing the specific functions.
- Deprecated the `syntaxKindName` function. This shouldn't have been in the public API.
- Upgrade many dependencies.

### Removed

- `visitAllChildren` option. This is now the default behaviour.
