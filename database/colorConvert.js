const convert = require('color-convert')

//Input hex string.
const array = 'ffffff-df0807-001c69-fff700'.trim().split('-');

//Hex code output.
const hex = array.map(hex => `#${hex}`).join('/');

const rgb = hex => {

    let r, g, b;

    if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 3) {
        r = parseInt(hex.slice(0, 1) + hex.slice(0, 1), 16);
        g = parseInt(hex.slice(1, 2) + hex.slice(1, 2), 16);
        b = parseInt(hex.slice(2, 3) + hex.slice(2, 3), 16);
    }

    return `rgb(${r},${g},${b})`

}
//RGB code output.
const rgbString = array.map(hex => rgb(hex)).join('/').trim();

const hsl = H => {
    let r = 0,
        g = 0,
        b = 0;
    if (H.length === 3) {
        r = "0x" + H.charAt(0) + H.charAt(0);
        g = "0x" + H.charAt(1) + H.charAt(1);
        b = "0x" + H.charAt(2) + H.charAt(2);
    } else if (H.length === 6) {
        r = "0x" + H.charAt(0) + H.charAt(1);
        g = "0x" + H.charAt(2) + H.charAt(3);
        b = "0x" + H.charAt(4) + H.charAt(5);
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = Math.round(+(s * 100).toFixed(1));
    l = Math.round(+(l * 100).toFixed(1));

    return "hsl(" + h + "," + s + "%," + l + "%)";
}
//HSL code output.
const hslString = array.map(hex => hsl(hex)).join('/').trim();
//CSS keyword output.
const cssString = array.map(hex => convert.hex.keyword(hex)).join('/').trim();




console.log(`

${hex};${rgbString};${hslString};${cssString}

`)