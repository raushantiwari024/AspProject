"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Attribute = function (key, op, value, cif) {
    this.key = key;
    this.op = op;
    this.value = value;
    this.cif = cif;
};
Attribute.prototype = Object.assign(new node_1.default(), {
    type: 'Attribute',
    eval: function (context) {
        var key = [];
        for (var i = 0; i < this.key.length; ++i) {
            key.push(this.key[i].eval ? this.key[i].eval(context) : this.key[i]);
        }
        return new Attribute(key, this.op, (this.value && this.value.eval) ? this.value.eval(context) : this.value, this.cif);
    },
    genCSS: function (context, output) {
        output.add(this.toCSS(context));
    },
    toCSS: function (context) {
        var value = '';
        for (var i = 0; i < this.key.length; ++i) {
            value += this.key[i].toCSS ? this.key[i].toCSS(context) : this.key[i];
        }
        if (this.op) {
            value += this.op;
            value += (this.value.toCSS ? this.value.toCSS(context) : this.value);
        }
        if (this.cif) {
            value = value + ' ' + this.cif;
        }
        return "[".concat(value, "]");
    }
});
exports.default = Attribute;
//# sourceMappingURL=attribute.js.map