var template = require('./template');
var config;
var fs = require('fs-extra');
var path = require('path');
var globby = require('globby');
var runner = require('mocha-headless-chrome').runner;
if (process.argv[2]) {
    config = require("./".concat(process.argv[2], ".config"));
}
else {
    config = require('./runner.config');
}
/**
 * Generate templates and run tests
 */
var tests = [];
var cwd = process.cwd();
var tmpDir = path.join(cwd, 'tmp', 'browser');
fs.ensureDirSync(tmpDir);
fs.copySync(path.join(cwd, 'test', 'browser', 'common.js'), path.join(tmpDir, 'common.js'));
var numTests = 0;
var passedTests = 0;
var failedTests = 0;
/** Will run the runners in a series */
function runSerial(tasks) {
    var result = Promise.resolve();
    start = Date.now();
    tasks.forEach(function (task) {
        result = result.then(function (result) {
            if (result && result.result && result.result.stats) {
                var stats = result.result.stats;
                numTests += stats.tests;
                passedTests += stats.passes;
                failedTests += stats.failures;
            }
            return task();
        }, function (err) {
            console.log(err);
            failedTests += 1;
        });
    });
    return result;
}
Object.entries(config).forEach(function (entry) {
    var test = entry[1];
    var paths = globby.sync(test.src);
    var templateString = template(paths, test.options.helpers, test.options.specs);
    fs.writeFileSync(path.join(cwd, test.options.outfile), templateString);
    tests.push(function () {
        var file = 'http://localhost:8081/packages/less/' + test.options.outfile;
        console.log(file);
        return runner({
            file: file,
            timeout: 3500,
            args: ['disable-web-security']
        });
    });
});
module.exports = function () { return runSerial(tests).then(function () {
    if (failedTests > 0) {
        process.stderr.write(failedTests + ' Failed, ' + passedTests + ' passed\n');
    }
    else {
        process.stdout.write('All Passed ' + passedTests + ' run\n');
    }
    if (failedTests) {
        process.on('exit', function () { process.reallyExit(1); });
    }
    process.exit();
}, function (err) {
    process.stderr.write(err.message);
    process.exit();
}); };
//# sourceMappingURL=generate.js.map