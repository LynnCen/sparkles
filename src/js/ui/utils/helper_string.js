function subString(str, len) {
    if (get_byte_length(str) <= len) {
        return str;
    }
    const m = Math.floor(len / 2);
    for (let i = m, j = str.length; i < j; i++) {
        if (get_byte_length(str.substring(0, i)) >= len) {
            return str.substring(0, i);
        }
    }
    return str;
}

function reverse_string(str) {
    return str.split("").reverse().join("");
}

function subString_reverse(str, len) {
    const s = reverse_string(str);
    const res = subString(s, len);
    return reverse_string(res);
}

function get_byte_length(str) {
    const regexp = /[^\x00-\xff]/g;
    return str.replace(regexp, "aa").length;
}

export { subString, subString_reverse, get_byte_length };
