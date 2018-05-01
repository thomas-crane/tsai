const path = require('path');
const { indexPath } = require('./indexer');

/**
 * Runs tsai.
 */
function run() {
    let args = process.argv.slice(2);
    const useDouble = args.some((a) => a === '+');
    args = args.filter((a) => a !== '+');
    let target = process.cwd();
    if (args[0]) {
        target = path.join(target, args[0]);
    }
    const segments = target.split(path.sep);
    console.log(`Indexing ${segments.slice(segments.length - 2).join(path.sep)}`);
    try {
        const count = indexPath(target, target, useDouble ? `"` : `'`);
        console.log(`\nDone! Created ${count} index file${count === 1 ? '' : 's'}.`);
    } catch (error) {
        console.log('An error occurred:');
        console.log(error.message || error);
    }
}

exports.run = run;