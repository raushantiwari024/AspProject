var path = require('path');
var resolve = require('resolve');
var forceCovertToBrowserPath = require('./utils').forceCovertToBrowserPath;
/** Root of repo */
var testFolder = forceCovertToBrowserPath(path.dirname(resolve.sync('@less/test-data')));
var lessFolder = forceCovertToBrowserPath(path.join(testFolder, 'less'));
var localTests = forceCovertToBrowserPath(path.resolve(__dirname, '..'));
module.exports = {
    main: {
        // src is used to build list of less files to compile
        src: [
            "".concat(lessFolder, "/_main/*.less"),
            "!".concat(lessFolder, "/_main/plugin-preeval.less"), // uses ES6 syntax
            // Don't test NPM import, obviously
            "!".concat(lessFolder, "/_main/plugin-module.less"),
            "!".concat(lessFolder, "/_main/import-module.less"),
            "!".concat(lessFolder, "/_main/javascript.less"),
            "!".concat(lessFolder, "/_main/urls.less"),
            "!".concat(lessFolder, "/_main/empty.less")
        ],
        options: {
            helpers: 'test/browser/runner-main-options.js',
            specs: 'test/browser/runner-main-spec.js',
            outfile: 'tmp/browser/test-runner-main.html'
        }
    },
    legacy: {
        src: ["".concat(lessFolder, "/legacy/*.less")],
        options: {
            helpers: 'test/browser/runner-legacy-options.js',
            specs: 'test/browser/runner-legacy-spec.js',
            outfile: 'tmp/browser/test-runner-legacy.html'
        }
    },
    strictUnits: {
        src: ["".concat(lessFolder, "/units/strict/*.less")],
        options: {
            helpers: 'test/browser/runner-strict-units-options.js',
            specs: 'test/browser/runner-strict-units-spec.js',
            outfile: 'tmp/browser/test-runner-strict-units.html'
        }
    },
    errors: {
        src: [
            "".concat(lessFolder, "/errors/*.less"),
            "".concat(testFolder, "/errors/javascript-error.less"),
            "".concat(localTests, "/less/errors/*.less")
        ],
        options: {
            timeout: 20000,
            helpers: 'test/browser/runner-errors-options.js',
            specs: 'test/browser/runner-errors-spec.js',
            outfile: 'tmp/browser/test-runner-errors.html'
        }
    },
    noJsErrors: {
        src: ["".concat(lessFolder, "/no-js-errors/*.less")],
        options: {
            helpers: 'test/browser/runner-no-js-errors-options.js',
            specs: 'test/browser/runner-no-js-errors-spec.js',
            outfile: 'tmp/browser/test-runner-no-js-errors.html'
        }
    },
    browser: {
        src: [
            "".concat(localTests, "/less/*.less"),
            "".concat(localTests, "/less/plugin/*.less")
        ],
        options: {
            helpers: 'test/browser/runner-browser-options.js',
            specs: 'test/browser/runner-browser-spec.js',
            outfile: 'tmp/browser/test-runner-browser.html'
        }
    },
    relativeUrls: {
        src: ["".concat(localTests, "/less/relative-urls/*.less")],
        options: {
            helpers: 'test/browser/runner-relative-urls-options.js',
            specs: 'test/browser/runner-relative-urls-spec.js',
            outfile: 'tmp/browser/test-runner-relative-urls.html'
        }
    },
    rewriteUrls: {
        src: ["".concat(localTests, "/less/rewrite-urls/*.less")],
        options: {
            helpers: 'test/browser/runner-rewrite-urls-options.js',
            specs: 'test/browser/runner-rewrite-urls-spec.js',
            outfile: 'tmp/browser/test-runner-rewrite-urls.html'
        }
    },
    rootpath: {
        src: ["".concat(localTests, "/less/rootpath/*.less")],
        options: {
            helpers: 'test/browser/runner-rootpath-options.js',
            specs: 'test/browser/runner-rootpath-spec.js',
            outfile: 'tmp/browser/test-runner-rootpath.html'
        }
    },
    rootpathRelative: {
        src: ["".concat(localTests, "/less/rootpath-relative/*.less")],
        options: {
            helpers: 'test/browser/runner-rootpath-relative-options.js',
            specs: 'test/browser/runner-rootpath-relative-spec.js',
            outfile: 'tmp/browser/test-runner-rootpath-relative.html'
        }
    },
    rootpathRewriteUrls: {
        src: ["".concat(localTests, "/less/rootpath-rewrite-urls/*.less")],
        options: {
            helpers: 'test/browser/runner-rootpath-rewrite-urls-options.js',
            specs: 'test/browser/runner-rootpath-rewrite-urls-spec.js',
            outfile: 'tmp/browser/test-runner-rootpath-rewrite-urls.html'
        }
    },
    production: {
        src: ["".concat(localTests, "/less/production/*.less")],
        options: {
            helpers: 'test/browser/runner-production-options.js',
            specs: 'test/browser/runner-production-spec.js',
            outfile: 'tmp/browser/test-runner-production.html'
        }
    },
    modifyVars: {
        src: ["".concat(localTests, "/less/modify-vars/*.less")],
        options: {
            helpers: 'test/browser/runner-modify-vars-options.js',
            specs: 'test/browser/runner-modify-vars-spec.js',
            outfile: 'tmp/browser/test-runner-modify-vars.html'
        }
    },
    globalVars: {
        src: ["".concat(localTests, "/less/global-vars/*.less")],
        options: {
            helpers: 'test/browser/runner-global-vars-options.js',
            specs: 'test/browser/runner-global-vars-spec.js',
            outfile: 'tmp/browser/test-runner-global-vars.html'
        }
    },
    postProcessorPlugin: {
        src: ["".concat(lessFolder, "/postProcessorPlugin/*.less")],
        options: {
            helpers: [
                'test/plugins/postprocess/index.js',
                'test/browser/runner-postProcessorPlugin-options.js'
            ],
            specs: 'test/browser/runner-postProcessorPlugin.js',
            outfile: 'tmp/browser/test-runner-post-processor-plugin.html'
        }
    },
    preProcessorPlugin: {
        src: ["".concat(lessFolder, "/preProcessorPlugin/*.less")],
        options: {
            helpers: [
                'test/plugins/preprocess/index.js',
                'test/browser/runner-preProcessorPlugin-options.js'
            ],
            specs: 'test/browser/runner-preProcessorPlugin.js',
            outfile: 'tmp/browser/test-runner-pre-processor-plugin.html'
        }
    },
    visitorPlugin: {
        src: ["".concat(lessFolder, "/visitorPlugin/*.less")],
        options: {
            helpers: [
                'test/plugins/visitor/index.js',
                'test/browser/runner-VisitorPlugin-options.js'
            ],
            specs: 'test/browser/runner-VisitorPlugin.js',
            outfile: 'tmp/browser/test-runner-visitor-plugin.html'
        }
    },
    filemanagerPlugin: {
        src: ["".concat(lessFolder, "/filemanagerPlugin/*.less")],
        options: {
            helpers: [
                'test/plugins/filemanager/index.js',
                'test/browser/runner-filemanagerPlugin-options.js'
            ],
            specs: 'test/browser/runner-filemanagerPlugin.js',
            outfile: 'tmp/browser/test-runner-filemanager-plugin.html'
        }
    }
};
//# sourceMappingURL=runner.config.js.map