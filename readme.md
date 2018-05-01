# tsai
## TypeScript Auto Indexer

## Contents
 + [About](#about)
 + [Install](#install)
 + [Usage](#usage)

# About
tsai is a small command line utility to help you index your TypeScript libraries.

Adding index files to a TypeScript project can be tedious -- especially if it is a large library that contains a lot of files. tsai is designed to eliminate the need to create and maintain these index files by providing a simple way to create them all in one go. tsai can be run manually, or added to the build pipeline of your TypeScript project to ensure the indexes are always up to date.

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

# Usage
```bash
tsai
```
If no folder name is provided, the current working directory of the console will be indexed.

A folder name can be provided relative to the current working directory to index that folder.
```bash
tsai lib
# indexes the lib/ folder
```
By default, tsai will use single quotation marks (`'`) in its output. If your project uses double quotemarks (`"`), you can tell tsai to use them by including a `+` in your command.
```bash
tsai +
tsai lib +
tsai + lib
# before or after the folder is ok
```
