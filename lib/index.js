const path = require('path');
const { indexPath } = require('./indexer');
const { getArgs } = require('./getargs');

/**
 * Runs tsai.
 */
async function run() {
    try {
        const args = getArgs(process.argv);
        console.log(`Indexing ${args.target.split(path.sep).slice(args.target.length - 2).join(path.sep)}`);
        if (args.dryrun) {
            console.log('Performing a dry run. No files will be written.');
        }
        if (args.overwrite) {
            console.log('Overwrite flag included. Overwriting any existing index files.');
        }

        const result = await indexPath(args.target, args);
        console.log(`\nDone! Created ${result.createCount} index file${result.createCount === 1 ? '' : 's'}.`);
        if (result.errorCount > 0) {
            console.log(`${result.errorCount} index file${result.errorCount === 1 ? '' : 's'} couldn't be created because it would overwrite ${result.errorCount === 1 ? 'an existing file.' : 'existing files.'}`);
            console.log('Run tsai with the --overwrite flag to overwrite any existing index files.');
        }
        if (args.dryrun) {
            console.log('[reminder] Dry run. No files written.');
        }
    } catch (error) {
        console.log('An error occurred:');
        console.log(error.message || error);
        console.log(error.stack);
    }
}

exports.run = run;