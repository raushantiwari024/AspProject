"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var contexts_1 = tslib_1.__importDefault(require("./contexts"));
var parser_1 = tslib_1.__importDefault(require("./parser/parser"));
var less_error_1 = tslib_1.__importDefault(require("./less-error"));
var utils = tslib_1.__importStar(require("./utils"));
var logger_1 = tslib_1.__importDefault(require("./logger"));
function default_1(environment) {
    // FileInfo = {
    //  'rewriteUrls' - option - whether to adjust URL's to be relative
    //  'filename' - full resolved filename of current file
    //  'rootpath' - path to append to normal URLs for this node
    //  'currentDirectory' - path to the current file, absolute
    //  'rootFilename' - filename of the base file
    //  'entryPath' - absolute path to the entry file
    //  'reference' - whether the file should not be output and only output parts that are referenced
    var ImportManager = /** @class */ (function () {
        function ImportManager(less, context, rootFileInfo) {
            this.less = less;
            this.rootFilename = rootFileInfo.filename;
            this.paths = context.paths || []; // Search paths, when importing
            this.contents = {}; // map - filename to contents of all the files
            this.contentsIgnoredChars = {}; // map - filename to lines at the beginning of each file to ignore
            this.mime = context.mime;
            this.error = null;
            this.context = context;
            // Deprecated? Unused outside of here, could be useful.
            this.queue = []; // Files which haven't been imported yet
            this.files = {}; // Holds the imported parse trees.
        }
        /**
         * Add an import to be imported
         * @param path - the raw path
         * @param tryAppendExtension - whether to try appending a file extension (.less or .js if the path has no extension)
         * @param currentFileInfo - the current file info (used for instance to work out relative paths)
         * @param importOptions - import options
         * @param callback - callback for when it is imported
         */
        ImportManager.prototype.push = function (path, tryAppendExtension, currentFileInfo, importOptions, callback) {
            var importManager = this, pluginLoader = this.context.pluginManager.Loader;
            this.queue.push(path);
            var fileParsedFunc = function (e, root, fullPath) {
                importManager.queue.splice(importManager.queue.indexOf(path), 1); // Remove the path from the queue
                var importedEqualsRoot = fullPath === importManager.rootFilename;
                if (importOptions.optional && e) {
                    callback(null, { rules: [] }, false, null);
                    logger_1.default.info("The file ".concat(fullPath, " was skipped because it was not found and the import was marked optional."));
                }
                else {
                    // Inline imports aren't cached here.
                    // If we start to cache them, please make sure they won't conflict with non-inline imports of the
                    // same name as they used to do before this comment and the condition below have been added.
                    if (!importManager.files[fullPath] && !importOptions.inline) {
                        importManager.files[fullPath] = { root: root, options: importOptions };
                    }
                    if (e && !importManager.error) {
                        importManager.error = e;
                    }
                    callback(e, root, importedEqualsRoot, fullPath);
                }
            };
            var newFileInfo = {
                rewriteUrls: this.context.rewriteUrls,
                entryPath: currentFileInfo.entryPath,
                rootpath: currentFileInfo.rootpath,
                rootFilename: currentFileInfo.rootFilename
            };
            var fileManager = environment.getFileManager(path, currentFileInfo.currentDirectory, this.context, environment);
            if (!fileManager) {
                fileParsedFunc({ message: "Could not find a file-manager for ".concat(path) });
                return;
            }
            var loadFileCallback = function (loadedFile) {
                var plugin;
                var resolvedFilename = loadedFile.filename;
                var contents = loadedFile.contents.replace(/^\uFEFF/, '');
                // Pass on an updated rootpath if path of imported file is relative and file
                // is in a (sub|sup) directory
                //
                // Examples:
                // - If path of imported file is 'module/nav/nav.less' and rootpath is 'less/',
                //   then rootpath should become 'less/module/nav/'
                // - If path of imported file is '../mixins.less' and rootpath is 'less/',
                //   then rootpath should become 'less/../'
                newFileInfo.currentDirectory = fileManager.getPath(resolvedFilename);
                if (newFileInfo.rewriteUrls) {
                    newFileInfo.rootpath = fileManager.join((importManager.context.rootpath || ''), fileManager.pathDiff(newFileInfo.currentDirectory, newFileInfo.entryPath));
                    if (!fileManager.isPathAbsolute(newFileInfo.rootpath) && fileManager.alwaysMakePathsAbsolute()) {
                        newFileInfo.rootpath = fileManager.join(newFileInfo.entryPath, newFileInfo.rootpath);
                    }
                }
                newFileInfo.filename = resolvedFilename;
                var newEnv = new contexts_1.default.Parse(importManager.context);
                newEnv.processImports = false;
                importManager.contents[resolvedFilename] = contents;
                if (currentFileInfo.reference || importOptions.reference) {
                    newFileInfo.reference = true;
                }
                if (importOptions.isPlugin) {
                    plugin = pluginLoader.evalPlugin(contents, newEnv, importManager, importOptions.pluginArgs, newFileInfo);
                    if (plugin instanceof less_error_1.default) {
                        fileParsedFunc(plugin, null, resolvedFilename);
                    }
                    else {
                        fileParsedFunc(null, plugin, resolvedFilename);
                    }
                }
                else if (importOptions.inline) {
                    fileParsedFunc(null, contents, resolvedFilename);
                }
                else {
                    // import (multiple) parse trees apparently get altered and can't be cached.
                    // TODO: investigate why this is
                    if (importManager.files[resolvedFilename]
                        && !importManager.files[resolvedFilename].options.multiple
                        && !importOptions.multiple) {
                        fileParsedFunc(null, importManager.files[resolvedFilename].root, resolvedFilename);
                    }
                    else {
                        new parser_1.default(newEnv, importManager, newFileInfo).parse(contents, function (e, root) {
                            fileParsedFunc(e, root, resolvedFilename);
                        });
                    }
                }
            };
            var loadedFile;
            var promise;
            var context = utils.clone(this.context);
            if (tryAppendExtension) {
                context.ext = importOptions.isPlugin ? '.js' : '.less';
            }
            if (importOptions.isPlugin) {
                context.mime = 'application/javascript';
                if (context.syncImport) {
                    loadedFile = pluginLoader.loadPluginSync(path, currentFileInfo.currentDirectory, context, environment, fileManager);
                }
                else {
                    promise = pluginLoader.loadPlugin(path, currentFileInfo.currentDirectory, context, environment, fileManager);
                }
            }
            else {
                if (context.syncImport) {
                    loadedFile = fileManager.loadFileSync(path, currentFileInfo.currentDirectory, context, environment);
                }
                else {
                    promise = fileManager.loadFile(path, currentFileInfo.currentDirectory, context, environment, function (err, loadedFile) {
                        if (err) {
                            fileParsedFunc(err);
                        }
                        else {
                            loadFileCallback(loadedFile);
                        }
                    });
                }
            }
            if (loadedFile) {
                if (!loadedFile.filename) {
                    fileParsedFunc(loadedFile);
                }
                else {
                    loadFileCallback(loadedFile);
                }
            }
            else if (promise) {
                promise.then(loadFileCallback, fileParsedFunc);
            }
        };
        return ImportManager;
    }());
    return ImportManager;
}
exports.default = default_1;
//# sourceMappingURL=import-manager.js.map