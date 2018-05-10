const path = require('path');
const SLASH_REGEX = /\\|\//;
const VALID_FLAGS = [
    '--overwrite', '-o',
    '--path', '-p',
    '--exclude', '-e',
    '--double', '-d',
    '--dry-run'
];
/**
 * Parses the given `args` into an object which contains
 * information about args that tsai can use.
 * @param {string[]} args The command line arguments to parse.
 */
function getArgs(args) {
    if (!args) {
        args = [];
    }
    const quotemark = args
        .some((a) => a === '--double' || a === '-d') ? `"` : `'`;
    const overwrite = args.some((a) => a === '--overwrite' || a === '-o');
    const exclude = ['node_modules'];
    const dryrun = args.some((a) => a === '--dry-run');
    let target = process.cwd();
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--path' || args[i] === '-p') {
            if (!args[i + 1]) {
                throw new Error(`No path provided for ${args[i]} argument.`);
            }
            target = path.join(target, ...args[i + 1].split(SLASH_REGEX));
        } else if (args[i] === '--exclude' || args[i] === '-e') {
            if (!args[i + 1]) {
                throw new Error(`No paths provided for ${args[i]} argument.`);
            }
            for (let n = i + 1; n < args.length; n++) {
                if (VALID_FLAGS.indexOf(args[n]) !== -1) {
                    if (exclude.length === 1) {
                        throw new Error(`No paths provided for ${args[i]} argument.`);
                    }
                    break;
                }
                exclude.push(path.join(...args[n].split(SLASH_REGEX)));
            }
        }
    }

    return {
        quotemark,
        target,
        overwrite,
        exclude,
        dryrun
    };
}

exports.getArgs = getArgs;
exports.SLASH_REGEX = SLASH_REGEX;