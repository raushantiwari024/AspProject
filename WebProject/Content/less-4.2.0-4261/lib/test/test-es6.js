"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// https://github.com/less/less.js/issues/3533
console.log('Testing ES6 imports...');
var __1 = tslib_1.__importDefault(require(".."));
var lessRender = __1.default.render;
// then I call lessRender on something
lessRender("\nbody {\n    a: 1;\n    b: 2;\n    c: 30;\n    d: 4;\n}", { sourceMap: {} }, function (error, output) {
    if (error)
        console.error(error);
});
//# sourceMappingURL=test-es6.js.map