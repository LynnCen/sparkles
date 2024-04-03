const crypto = require("crypto");

export const encrypt = function (data, encrypt_key) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv("aes-128-cbc", encrypt_key, iv);
    let crypted = cipher.update(data, "utf8", "binary");
    crypted += cipher.final("binary");
    let res = Buffer.concat([Buffer.from(iv, "binary"), Buffer.from(crypted, "binary")]);
    return res.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};
