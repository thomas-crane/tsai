# tsai
## TypeScript Auto Indexer

## Contents
 + [Install](#install)
 + [About](#about)
 + [Usage](#usage)
    + [Command line arguments](#command-line-arguments)

# Install
## From `npm`
```bash
npm install -g tsai
```
## From GitHub
1. Download or clone this repository.
2. Open the `tsai/` directory in a console.
```bash
npm install -g
```

# About
tsai is a small command line utility to help you index your TypeScript libraries.

Adding index files to a TypeScript project can be tedious -- especially if it is a large library that contains a lot of files. tsai is designed to eliminate the need to create and maintain these index files by providing a simple way to create them all in one go. tsai can be run manually, or added to the build pipeline of your TypeScript project to ensure the indexes are always up to date.

## Example
If you have the following folder structure
```
src/
└── lib/
    ├── fileutility.ts
    ├── bot.ts
    └── commands.ts
```
Running the command `tsai` from the `src/` directory will generate the file `src/lib/index.ts` with the following contents:
```typescript
// auto generated with tsai
// https://github.com/thomas-crane/tsai

export * from 'fileutility';
export * from 'bot';
export * from 'commands';
```

# Usage
```bash
tsai
```
If no folder name is provided, the current working directory of the console will be indexed.

## Command line arguments
### Overview
Flag | Description
---:| ---
--path | The path relative to the cwd to index.
--double | Use double quotemarks instead of single.
--exclude | A list of subpaths to exclude.
--overwrite | Overwrite any existing index files.
--dry-run | Don't write any files.

### `--path`
> Or `-p`.

The path to index relative to the current working directory.

If no path is provided after the `--path` flag an error will be thrown.
The path may be a subpath, and both forwards and backwards slashes are accepted as the path separator.

#### Examples
```bash
# indexing starts at mylib
tsai --path mylib

# indexing starts at innerlib
tsai --path mylib/innerlib

# indexing starts at "windows path"
tsai -p "my nested\windows path"
```

### `--double`
> Or `-d`.

If this flag is included, tsai will use double quotemarks (`"`) in the generated files.

### `--exclude`
> Or `-e`.

The list of subpaths to exclude from the indexing process.

All subsequent arguments up until another tsai argument or the end of the arguments are treated as excluded paths. If no paths are provided after the `--exlude` flag then an error will be thrown.
Excluded paths are not relative to the current working directory, so excluding the path `plugins/` will skip over *any* directory called `plugins` which is encountered while indexing a project. An excluded path may be a subpath, and both forwards and backwards slashes are accepted as the path separator.

#### Examples
```bash
# excludes any plugins/ folder
tsai --exclude plugins

# excludes plugins/ and models/
tsai --exclude plugins models

# excludes mylib/innerlib, but not other folders called innerlib
tsai --exclude mylib/innerlib
```

### `--overwrite`
> Or `-o`.

Overwrites existing index files.

By default, tsai will produce a warning, but will not overwrite an existing file called `index.ts` that was not auto-generated by tsai. Providing the `--overwrite` flag will make tsai overwrite any file called `index.ts`, regardless of whether or not it was auto-generated.

### `--dry-run`
Displays the indexing result but don't write any files.

If the `--dry-run` flag is included, tsai will go through the indexing process as normal, but will not actually write any files. This flag is useful to ensure tsai will do what you expect it to do before actually running it.