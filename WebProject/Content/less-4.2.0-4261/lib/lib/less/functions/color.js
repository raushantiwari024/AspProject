"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dimension_1 = tslib_1.__importDefault(require("../tree/dimension"));
var color_1 = tslib_1.__importDefault(require("../tree/color"));
var quoted_1 = tslib_1.__importDefault(require("../tree/quoted"));
var anonymous_1 = tslib_1.__importDefault(require("../tree/anonymous"));
var expression_1 = tslib_1.__importDefault(require("../tree/expression"));
var operation_1 = tslib_1.__importDefault(require("../tree/operation"));
var colorFunctions;
function clamp(val) {
    return Math.min(1, Math.max(0, val));
}
function hsla(origColor, hsl) {
    var color = colorFunctions.hsla(hsl.h, hsl.s, hsl.l, hsl.a);
    if (color) {
        if (origColor.value &&
            /^(rgb|hsl)/.test(origColor.value)) {
            color.value = origColor.value;
        }
        else {
            color.value = 'rgb';
        }
        return color;
    }
}
function toHSL(color) {
    if (color.toHSL) {
        return color.toHSL();
    }
    else {
        throw new Error('Argument cannot be evaluated to a color');
    }
}
function toHSV(color) {
    if (color.toHSV) {
        return color.toHSV();
    }
    else {
        throw new Error('Argument cannot be evaluated to a color');
    }
}
function number(n) {
    if (n instanceof dimension_1.default) {
        return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
    }
    else if (typeof n === 'number') {
        return n;
    }
    else {
        throw {
            type: 'Argument',
            message: 'color functions take numbers as parameters'
        };
    }
}
function scaled(n, size) {
    if (n instanceof dimension_1.default && n.unit.is('%')) {
        return parseFloat(n.value * size / 100);
    }
    else {
        return number(n);
    }
}
colorFunctions = {
    rgb: function (r, g, b) {
        var a = 1;
        /**
         * Comma-less syntax
         *   e.g. rgb(0 128 255 / 50%)
         */
        if (r instanceof expression_1.default) {
            var val = r.value;
            r = val[0];
            g = val[1];
            b = val[2];
            /**
             * @todo - should this be normalized in
             *   function caller? Or parsed differently?
             */
            if (b instanceof operation_1.default) {
                var op = b;
                b = op.operands[0];
                a = op.operands[1];
            }
        }
        var color = colorFunctions.rgba(r, g, b, a);
        if (color) {
            color.value = 'rgb';
            return color;
        }
    },
    rgba: function (r, g, b, a) {
        try {
            if (r instanceof color_1.default) {
                if (g) {
                    a = number(g);
                }
                else {
                    a = r.alpha;
                }
                return new color_1.default(r.rgb, a, 'rgba');
            }
            var rgb = [r, g, b].map(function (c) { return scaled(c, 255); });
            a = number(a);
            return new color_1.default(rgb, a, 'rgba');
        }
        catch (e) { }
    },
    hsl: function (h, s, l) {
        var a = 1;
        if (h instanceof expression_1.default) {
            var val = h.value;
            h = val[0];
            s = val[1];
            l = val[2];
            if (l instanceof operation_1.default) {
                var op = l;
                l = op.operands[0];
                a = op.operands[1];
            }
        }
        var color = colorFunctions.hsla(h, s, l, a);
        if (color) {
            color.value = 'hsl';
            return color;
        }
    },
    hsla: function (h, s, l, a) {
        var m1;
        var m2;
        function hue(h) {
            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
            if (h * 6 < 1) {
                return m1 + (m2 - m1) * h * 6;
            }
            else if (h * 2 < 1) {
                return m2;
            }
            else if (h * 3 < 2) {
                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
            }
            else {
                return m1;
            }
        }
        try {
            if (h instanceof color_1.default) {
                if (s) {
                    a = number(s);
                }
                else {
                    a = h.alpha;
                }
                return new color_1.default(h.rgb, a, 'hsla');
            }
            h = (number(h) % 360) / 360;
            s = clamp(number(s));
            l = clamp(number(l));
            a = clamp(number(a));
            m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            m1 = l * 2 - m2;
            var rgb = [
                hue(h + 1 / 3) * 255,
                hue(h) * 255,
                hue(h - 1 / 3) * 255
            ];
            a = number(a);
            return new color_1.default(rgb, a, 'hsla');
        }
        catch (e) { }
    },
    hsv: function (h, s, v) {
        return colorFunctions.hsva(h, s, v, 1.0);
    },
    hsva: function (h, s, v, a) {
        h = ((number(h) % 360) / 360) * 360;
        s = number(s);
        v = number(v);
        a = number(a);
        var i;
        var f;
        i = Math.floor((h / 60) % 6);
        f = (h / 60) - i;
        var vs = [v,
            v * (1 - s),
            v * (1 - f * s),
            v * (1 - (1 - f) * s)];
        var perm = [[0, 3, 1],
            [2, 0, 1],
            [1, 0, 3],
            [1, 2, 0],
            [3, 1, 0],
            [0, 1, 2]];
        return colorFunctions.rgba(vs[perm[i][0]] * 255, vs[perm[i][1]] * 255, vs[perm[i][2]] * 255, a);
    },
    hue: function (color) {
        return new dimension_1.default(toHSL(color).h);
    },
    saturation: function (color) {
        return new dimension_1.default(toHSL(color).s * 100, '%');
    },
    lightness: function (color) {
        return new dimension_1.default(toHSL(color).l * 100, '%');
    },
    hsvhue: function (color) {
        return new dimension_1.default(toHSV(color).h);
    },
    hsvsaturation: function (color) {
        return new dimension_1.default(toHSV(color).s * 100, '%');
    },
    hsvvalue: function (color) {
        return new dimension_1.default(toHSV(color).v * 100, '%');
    },
    red: function (color) {
        return new dimension_1.default(color.rgb[0]);
    },
    green: function (color) {
        return new dimension_1.default(color.rgb[1]);
    },
    blue: function (color) {
        return new dimension_1.default(color.rgb[2]);
    },
    alpha: function (color) {
        return new dimension_1.default(toHSL(color).a);
    },
    luma: function (color) {
        return new dimension_1.default(color.luma() * color.alpha * 100, '%');
    },
    luminance: function (color) {
        var luminance = (0.2126 * color.rgb[0] / 255) +
            (0.7152 * color.rgb[1] / 255) +
            (0.0722 * color.rgb[2] / 255);
        return new dimension_1.default(luminance * color.alpha * 100, '%');
    },
    saturate: function (color, amount, method) {
        // filter: saturate(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.s += hsl.s * amount.value / 100;
        }
        else {
            hsl.s += amount.value / 100;
        }
        hsl.s = clamp(hsl.s);
        return hsla(color, hsl);
    },
    desaturate: function (color, amount, method) {
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.s -= hsl.s * amount.value / 100;
        }
        else {
            hsl.s -= amount.value / 100;
        }
        hsl.s = clamp(hsl.s);
        return hsla(color, hsl);
    },
    lighten: function (color, amount, method) {
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.l += hsl.l * amount.value / 100;
        }
        else {
            hsl.l += amount.value / 100;
        }
        hsl.l = clamp(hsl.l);
        return hsla(color, hsl);
    },
    darken: function (color, amount, method) {
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.l -= hsl.l * amount.value / 100;
        }
        else {
            hsl.l -= amount.value / 100;
        }
        hsl.l = clamp(hsl.l);
        return hsla(color, hsl);
    },
    fadein: function (color, amount, method) {
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.a += hsl.a * amount.value / 100;
        }
        else {
            hsl.a += amount.value / 100;
        }
        hsl.a = clamp(hsl.a);
        return hsla(color, hsl);
    },
    fadeout: function (color, amount, method) {
        var hsl = toHSL(color);
        if (typeof method !== 'undefined' && method.value === 'relative') {
            hsl.a -= hsl.a * amount.value / 100;
        }
        else {
            hsl.a -= amount.value / 100;
        }
        hsl.a = clamp(hsl.a);
        return hsla(color, hsl);
    },
    fade: function (color, amount) {
        var hsl = toHSL(color);
        hsl.a = amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(color, hsl);
    },
    spin: function (color, amount) {
        var hsl = toHSL(color);
        var hue = (hsl.h + amount.value) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return hsla(color, hsl);
    },
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Natalie Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        if (!weight) {
            weight = new dimension_1.default(50);
        }
        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var a = toHSL(color1).a - toHSL(color2).a;
        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;
        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
            color1.rgb[1] * w1 + color2.rgb[1] * w2,
            color1.rgb[2] * w1 + color2.rgb[2] * w2];
        var alpha = color1.alpha * p + color2.alpha * (1 - p);
        return new color_1.default(rgb, alpha);
    },
    greyscale: function (color) {
        return colorFunctions.desaturate(color, new dimension_1.default(100));
    },
    contrast: function (color, dark, light, threshold) {
        // filter: contrast(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        if (typeof light === 'undefined') {
            light = colorFunctions.rgba(255, 255, 255, 1.0);
        }
        if (typeof dark === 'undefined') {
            dark = colorFunctions.rgba(0, 0, 0, 1.0);
        }
        // Figure out which is actually light and dark:
        if (dark.luma() > light.luma()) {
            var t = light;
            light = dark;
            dark = t;
        }
        if (typeof threshold === 'undefined') {
            threshold = 0.43;
        }
        else {
            threshold = number(threshold);
        }
        if (color.luma() < threshold) {
            return light;
        }
        else {
            return dark;
        }
    },
    // Changes made in 2.7.0 - Reverted in 3.0.0
    // contrast: function (color, color1, color2, threshold) {
    //     // Return which of `color1` and `color2` has the greatest contrast with `color`
    //     // according to the standard WCAG contrast ratio calculation.
    //     // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    //     // The threshold param is no longer used, in line with SASS.
    //     // filter: contrast(3.2);
    //     // should be kept as is, so check for color
    //     if (!color.rgb) {
    //         return null;
    //     }
    //     if (typeof color1 === 'undefined') {
    //         color1 = colorFunctions.rgba(0, 0, 0, 1.0);
    //     }
    //     if (typeof color2 === 'undefined') {
    //         color2 = colorFunctions.rgba(255, 255, 255, 1.0);
    //     }
    //     var contrast1, contrast2;
    //     var luma = color.luma();
    //     var luma1 = color1.luma();
    //     var luma2 = color2.luma();
    //     // Calculate contrast ratios for each color
    //     if (luma > luma1) {
    //         contrast1 = (luma + 0.05) / (luma1 + 0.05);
    //     } else {
    //         contrast1 = (luma1 + 0.05) / (luma + 0.05);
    //     }
    //     if (luma > luma2) {
    //         contrast2 = (luma + 0.05) / (luma2 + 0.05);
    //     } else {
    //         contrast2 = (luma2 + 0.05) / (luma + 0.05);
    //     }
    //     if (contrast1 > contrast2) {
    //         return color1;
    //     } else {
    //         return color2;
    //     }
    // },
    argb: function (color) {
        return new anonymous_1.default(color.toARGB());
    },
    color: function (c) {
        if ((c instanceof quoted_1.default) &&
            (/^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/i.test(c.value))) {
            var val = c.value.slice(1);
            return new color_1.default(val, undefined, "#".concat(val));
        }
        if ((c instanceof color_1.default) || (c = color_1.default.fromKeyword(c.value))) {
            c.value = undefined;
            return c;
        }
        throw {
            type: 'Argument',
            message: 'argument must be a color keyword or 3|4|6|8 digit hex e.g. #FFF'
        };
    },
    tint: function (color, amount) {
        return colorFunctions.mix(colorFunctions.rgb(255, 255, 255), color, amount);
    },
    shade: function (color, amount) {
        return colorFunctions.mix(colorFunctions.rgb(0, 0, 0), color, amount);
    }
};
exports.default = colorFunctions;
//# sourceMappingURL=color.js.map