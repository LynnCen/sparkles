export function base64Encode(strArr) {
    var base64hash = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    var result = [];

    var asciiCode;

    var prevAsciiCode;

    var mod;

    var preMod = strArr.length % 3;

    if (preMod == 1) {
        strArr.push(null);
        strArr.push(null);
    }
    if (preMod == 2) strArr.push(null);

    for (var index in strArr) {
        asciiCode = strArr[index];

        mod = index % 3;
        switch (mod) {
            case 0:
                result.push(base64hash[asciiCode >> 2]);
                break;
            case 1:
                result.push(base64hash[((prevAsciiCode & 3) << 4) | (asciiCode >> 4)]);
                break;
            case 2:
                result.push(base64hash[((prevAsciiCode & 15) << 2) | (asciiCode >> 6)]);

                result.push(base64hash[asciiCode & 63]);
                break;
        }

        prevAsciiCode = asciiCode;
    }

    if (preMod == 1) {
        result.splice(result.length - 2, 2);
        result.push("==");
    } else if (preMod == 2) {
        result.pop();
        result.push("=");
    }

    return result.join("");
}
