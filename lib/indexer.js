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
    // TODO: improve this to ignore .d.ts files.
    if (contents.some((f) => f.endsWith('.ts'))) {
        const segments = path.split(nodePath.sep);
        console.log(` - Creating ..${nodePath.sep}${nodePath.relative(root, path)}${nodePath.sep}index.ts`);
        const index = contents
            .filter((s) => s.endsWith('.ts'))
            .map((s) => s.substring(0, s.length - 3))
            .reduce((prev, current) => {
                return prev += `export * from ${quotemark}./${current}${quotemark};\n`
            }, watermark);
        fs.writeFileSync(nodePath.join(path, 'index.ts'), index, { flag: 'w' });
        count++;
    }
    return count;
}

const watermark =
    `// auto generated with tsai
// https://github.com/thomas-crane/tsai
`;

exports.indexPath = indexPath;