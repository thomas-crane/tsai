const path = require('path');
const { indexPath } = require('./indexer');

/**
 * Runs tsai.
 */
async function run() {
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
        const options = {
            root: target,
            quotemark: useDouble ? `"` : `'`
        };
        const result = await indexPath(target, options);
        console.log(`\nDone! Created ${result.createCount} index file${result.createCount === 1 ? '' : 's'}.`);
        if (result.errorCount > 0) {
            console.log(`${result.errorCount} index file${result.errorCount === 1 ? '' : 's'} couldn't be created because it would overwrite ${result.errorCount === 1 ? 'an existing file.' : 'existing files.'}`);
        }
    } catch (error) {
        console.log('An error occurred:');
        console.log(error.message || error);
    }
}

exports.run = run;