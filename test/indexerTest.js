const assert = require('assert');
const { watermark } = require('./../lib/constants');
const indexer = require('./../lib/indexer');
const { getArgs } = require('./../lib/getargs');

describe('indexer.js', function () {
    describe('#generateIndex()', function () {
        it('should use [quotemark] quotemarks in the result.', function () {
            const testFiles = ['test.ts'];
            const singleResult = indexer.generateIndex(testFiles, `'`);
            const doubleResult = indexer.generateIndex(testFiles, '"');
            const backtickResult = indexer.generateIndex(testFiles, '`');

            assert.equal(singleResult.includes(`'`), true);
            assert.equal(singleResult.includes('"'), false);
            assert.equal(singleResult.includes('`'), false);

            assert.equal(doubleResult.includes(`'`), false);
            assert.equal(doubleResult.includes('"'), true);
            assert.equal(doubleResult.includes('`'), false);

            assert.equal(backtickResult.includes(`'`), false);
            assert.equal(backtickResult.includes('"'), false);
            assert.equal(backtickResult.includes('`'), true);
        });
        it('should use single quotemarks as the default.', function () {
            const testFiles = ['test.ts'];
            const result = indexer.generateIndex(testFiles);
            assert.equal(result.includes(`'`), true);
            assert.equal(result.includes('"'), false);
        });
        it('should include the watermark at the top of the file.', function () {
            const testFiles = ['test.ts'];
            const result = indexer.generateIndex(testFiles);
            assert.deepEqual(
                result.split('\n').slice(0, 2),
                watermark.split('\n').slice(0, 2)
            );
        });
        it('should return null if `fileList` contains no indexable files.', function () {
            let testFiles = ['test.cs', 'testDirectory', 'somefile.js'];
            let result = indexer.generateIndex(testFiles);
            assert.equal(result, null);
        });
    });
    describe('#indexPath()', function () {
        it('should report the correct number of index files generated.', function (done) {
            const args = getArgs(['--path', 'test/test-dirs/control', '--dry-run']);
            const tests = [
                {
                    args: getArgs(['--path', 'test/test-dirs/control', '--dry-run']),
                    expected: { createCount: 1, errorCount: 0 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/nested', '--dry-run']),
                    expected: { createCount: 4, errorCount: 0 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/has-index', '--dry-run']),
                    expected: { createCount: 0, errorCount: 1 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/has-index', '--dry-run', '--overwrite']),
                    expected: { createCount: 1, errorCount: 0 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/nested', '--dry-run', '--exclude', 'first-nest']),
                    expected: { createCount: 3, errorCount: 0 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/nested', '--dry-run', '--exclude', 'second-nest/inner-nest']),
                    expected: { createCount: 3, errorCount: 0 }
                },
                {
                    args: getArgs(['--path', 'test/test-dirs/nested', '--dry-run', '--exclude', 'second-nest']),
                    expected: { createCount: 2, errorCount: 0 }
                }
            ];
            Promise.all(tests
                .map((t) => indexer.indexPath(t.args.target, t.args))
            ).then((results) => {
                for (let i = 0; i < results.length; i++) {
                    try {
                        assert.deepEqual(results[i], tests[i].expected);
                    } catch (error) {
                        done(error);
                        return;
                    }
                }
                done();
            });
        });
    });
});