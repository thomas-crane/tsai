const fs = require('fs');
/**
 * Gets the first line of the specified `file`.
 * @param {string} file The path to the file to get the first line from.
 * @returns {Promise<any>} A promise which is resolved when the operation has complete.
 */
function getFirstLine(file) {
    return new Promise((resolve, reject) => {
        const read = fs.createReadStream(file, { encoding: 'utf8' });
        let data = '';
        const cleanup = () => {
            read.removeAllListeners('error');
            read.removeAllListeners('data');
            read.removeAllListeners('close');
            read.removeAllListeners('end');
        };
        const getNextChunk = () => {
            read.once('data', (chunk) => {
                data += chunk;
                if (data.indexOf('\n') > -1) {
                    cleanup();
                    resolve(data.split('\n')[0]);
                } else {
                    getNextChunk();
                }
            });
        };
        read.once('close', () => {
            cleanup();
            if (data.indexOf('\n') > -1) {
                resolve(data.split('\n')[0]);
            } else {
                resolve(data);
            }
        });
        read.once('end', () => {
            cleanup();
            if (data.indexOf('\n') > -1) {
                resolve(data.split('\n')[0]);
            } else {
                resolve(data);
            }
        });
        read.once('error', (error) => {
            cleanup();
            reject(error);
        });
        getNextChunk();
    });
}

exports.getFirstLine = getFirstLine;