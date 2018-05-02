const fs = require('fs');
const nodePath = require('path');
/**
 * Recursively indexes the given path.
 * @param {string} root The root path of the library being indexed.
 * @param {string} path The path to index.
 * @param {string} quotemark The type of quotemark to use. Defaults to a single quote mark (`'`).
 * @returns {number} The number of index files created.
 */
function indexPath(root, path, quotemark = `'`) {
    let contents = fs.readdirSync(path);
    let count = 0;
    for (let i = 0; i < contents.length; i++) {
        const stat = fs.statSync(nodePath.join(path, contents[i]));
        if (stat.isDirectory()) {
            count += indexPath(root, nodePath.join(path, contents[i]), quotemark);
        }
    }

    if (contents.some((f) => f.endsWith('.ts'))) {
        const relative = nodePath.relative(root, path);
        console.log(` - Creating .${nodePath.sep}${relative}${relative.length > 0 ? nodePath.sep : ''}index.ts`);
        const index = generateIndex(contents, quotemark);
        fs.writeFileSync(nodePath.join(path, 'index.ts'), index, { flag: 'w' });
        count++;
    }
    return count;
}

/**
 * Generates the index file contents for the `fileList`.
 * @param {string[]} fileList The list of files to include in the index.
 * @param {string} quotemark The type of quotemark to use. Defaults to a single quote mark (`'`).
 * @returns {string} The generated file contents.
 */
function generateIndex(fileList, quotemark = `'`) {
    return fileList
        .filter((s) => {
            if (s === 'index.ts') {
                return false;
            }
            return s.endsWith('.ts');
        })
        .map((s) => {
            if (s.endsWith('.d.ts')) {
                return s.substring(0, s.length - 5);
            }
            return s.substring(0, s.length - 3);
        })
        .reduce((prev, current) => {
            return prev += `export * from ${quotemark}./${current}${quotemark};\n`
        }, watermark);
}

const watermark =
    `// auto generated with tsai
// https://github.com/thomas-crane/tsai
`;

exports.indexPath = indexPath;
exports.generateIndex = generateIndex;