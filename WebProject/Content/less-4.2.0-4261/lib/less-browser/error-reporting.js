"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils = tslib_1.__importStar(require("./utils"));
var browser_1 = tslib_1.__importDefault(require("./browser"));
exports.default = (function (window, less, options) {
    function errorHTML(e, rootHref) {
        var id = "less-error-message:".concat(utils.extractId(rootHref || ''));
        var template = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>';
        var elem = window.document.createElement('div');
        var timer;
        var content;
        var errors = [];
        var filename = e.filename || rootHref;
        var filenameNoPath = filename.match(/([^/]+(\?.*)?)$/)[1];
        elem.id = id;
        elem.className = 'less-error-message';
        content = "<h3>".concat(e.type || 'Syntax', "Error: ").concat(e.message || 'There is an error in your .less file') +
            "</h3><p>in <a href=\"".concat(filename, "\">").concat(filenameNoPath, "</a> ");
        var errorline = function (e, i, classname) {
            if (e.extract[i] !== undefined) {
                errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                    .replace(/\{class\}/, classname)
                    .replace(/\{content\}/, e.extract[i]));
            }
        };
        if (e.line) {
            errorline(e, 0, '');
            errorline(e, 1, 'line');
            errorline(e, 2, '');
            content += "on line ".concat(e.line, ", column ").concat(e.column + 1, ":</p><ul>").concat(errors.join(''), "</ul>");
        }
        if (e.stack && (e.extract || options.logLevel >= 4)) {
            content += "<br/>Stack Trace</br />".concat(e.stack.split('\n').slice(1).join('<br/>'));
        }
        elem.innerHTML = content;
        // CSS for error messages
        browser_1.default.createCSS(window.document, [
            '.less-error-message ul, .less-error-message li {',
            'list-style-type: none;',
            'margin-right: 15px;',
            'padding: 4px 0;',
            'margin: 0;',
            '}',
            '.less-error-message label {',
            'font-size: 12px;',
            'margin-right: 15px;',
            'padding: 4px 0;',
            'color: #cc7777;',
            '}',
            '.less-error-message pre {',
            'color: #dd6666;',
            'padding: 4px 0;',
            'margin: 0;',
            'display: inline-block;',
            '}',
            '.less-error-message pre.line {',
            'color: #ff0000;',
            '}',
            '.less-error-message h3 {',
            'font-size: 20px;',
            'font-weight: bold;',
            'padding: 15px 0 5px 0;',
            'margin: 0;',
            '}',
            '.less-error-message a {',
            'color: #10a',
            '}',
            '.less-error-message .error {',
            'color: red;',
            'font-weight: bold;',
            'padding-bottom: 2px;',
            'border-bottom: 1px dashed red;',
            '}'
        ].join('\n'), { title: 'error-message' });
        elem.style.cssText = [
            'font-family: Arial, sans-serif',
            'border: 1px solid #e00',
            'background-color: #eee',
            'border-radius: 5px',
            '-webkit-border-radius: 5px',
            '-moz-border-radius: 5px',
            'color: #e00',
            'padding: 15px',
            'margin-bottom: 15px'
        ].join(';');
        if (options.env === 'development') {
            timer = setInterval(function () {
                var document = window.document;
                var body = document.body;
                if (body) {
                    if (document.getElementById(id)) {
                        body.replaceChild(elem, document.getElementById(id));
                    }
                    else {
                        body.insertBefore(elem, body.firstChild);
                    }
                    clearInterval(timer);
                }
            }, 10);
        }
    }
    function removeErrorHTML(path) {
        var node = window.document.getElementById("less-error-message:".concat(utils.extractId(path)));
        if (node) {
            node.parentNode.removeChild(node);
        }
    }
    function removeErrorConsole() {
        // no action
    }
    function removeError(path) {
        if (!options.errorReporting || options.errorReporting === 'html') {
            removeErrorHTML(path);
        }
        else if (options.errorReporting === 'console') {
            removeErrorConsole(path);
        }
        else if (typeof options.errorReporting === 'function') {
            options.errorReporting('remove', path);
        }
    }
    function errorConsole(e, rootHref) {
        var template = '{line} {content}';
        var filename = e.filename || rootHref;
        var errors = [];
        var content = "".concat(e.type || 'Syntax', "Error: ").concat(e.message || 'There is an error in your .less file', " in ").concat(filename);
        var errorline = function (e, i, classname) {
            if (e.extract[i] !== undefined) {
                errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                    .replace(/\{class\}/, classname)
                    .replace(/\{content\}/, e.extract[i]));
            }
        };
        if (e.line) {
            errorline(e, 0, '');
            errorline(e, 1, 'line');
            errorline(e, 2, '');
            content += " on line ".concat(e.line, ", column ").concat(e.column + 1, ":\n").concat(errors.join('\n'));
        }
        if (e.stack && (e.extract || options.logLevel >= 4)) {
            content += "\nStack Trace\n".concat(e.stack);
        }
        less.logger.error(content);
    }
    function error(e, rootHref) {
        if (!options.errorReporting || options.errorReporting === 'html') {
            errorHTML(e, rootHref);
        }
        else if (options.errorReporting === 'console') {
            errorConsole(e, rootHref);
        }
        else if (typeof options.errorReporting === 'function') {
            options.errorReporting('add', e, rootHref);
        }
    }
    return {
        add: error,
        remove: removeError
    };
});
//# sourceMappingURL=error-reporting.js.map