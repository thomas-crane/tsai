const fs = require('fs');
const nodePath = require('path');
const { getFirstLine } = require('./getline');
const { watermark } = require('./constants');
/**
 * Recursively indexes the given path.
 * @param {string} path The path to index.
 * @param {{ root: string, quotemark: string }} options The options to use while indexing.
 * @returns {{ createCount: number, errorCount: number }} A report of how many files were generated and any errors that occurred.
 */
async function indexPath(path, options) {
    let contents = fs.readdirSync(path);
    let report = {
        createCount: 0,
        errorCount: 0
    };
    for (let i = 0; i < contents.length; i++) {
        const stat = fs.statSync(nodePath.join(path, contents[i]));
        if (stat.isDirectory()) {
            const innerReport = await indexPath(nodePath.join(path, contents[i]), options);
            report.createCount += innerReport.createCount;
            report.errorCount += innerReport.errorCount;
        }
    }

    if (contents.some((f) => f.endsWith('.ts'))) {
        const relative = nodePath.relative(options.root, path);
        const newIndexPath = `.${nodePath.sep}${relative}${relative.length > 0 ? nodePath.sep : ''}index.ts`;
        const createFile = () => {
            console.log(` - Creating ${newIndexPath}`);
            const index = generateIndex(contents, options.quotemark);
            fs.writeFileSync(nodePath.join(path, 'index.ts'), index, { flag: 'w' });
            report.createCount++;
        };
        try {
            const firstline = await getFirstLine(nodePath.join(path, 'index.ts'));
            if (firstline === watermark.split('\n')[0]) {
                // it's auto generated so it's OK to overwrite.
                createFile();
            } else {
                console.log(` ! Skipping ${newIndexPath}`);
                report.errorCount++;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                // index file doesn't exist. OK to generate.
                createFile();
            } else {
                // if the error is anything else, just rethrow it.
                throw error;
            }
        }
    }
    return report;
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

exports.indexPath = indexPath;
exports.generateIndex = generateIndex;