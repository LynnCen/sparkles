const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const argv = process.argv;
if (argv.length !== 4) {
    console.error("argv length should be 4");
    process.exit(-1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
const version = pkg.version;
const [platform, target] = argv.slice(2);
// fs.createReadStream("../release");
const apiAxios = axios.create({
    baseUrl: target,
    headers: {
        os: "win",
        version: "1",
        over: "1",
        lang: "en",
    },
});
const uploadAxios = axios.create({
    maxContentLength: Infinity,
});
const getPc = (config = {}) =>
    apiAxios
        .get(target + "start/pc.json", config)
        .then((res) => res.data)
        .catch((e) => {
            console.error("publish error -3", e);
            process.exit(-3);
        });
const upload = (data, app, yml) => {
    // console.log(data, app, yml);
    [app, yml].forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        const headers = formData.getHeaders();
        formData.getLength((err, len) => {
            if (err) {
                console.error(e);
                process.exit(-5);
            }
            headers["content-length"] = len;
            // console.log(headers);
            uploadAxios
                .post(data.upgrade_source, formData, { headers })
                .then((res) => res.data)
                .then(({ data }) => {
                    // console.log("result", data);
                })
                .catch((e) => {
                    console.error(e);
                    process.exit(-6);
                });
        });
    });
};

const winHandler = () => {
    const exeFilePath = path.join(__dirname, `../release/TMMTMM_Win_bin_V${version}.exe`);
    const ymlFilePath = path.join(__dirname, `../release/latest.yml`);
    const existFile = fs.existsSync(exeFilePath);
    if (!existFile) {
        console.error("publish error -4");
        process.exit(-4);
    }
    const exeFileStream = fs.createReadStream(exeFilePath);
    const ymlFileStream = fs.createReadStream(ymlFilePath);
    return [exeFileStream, ymlFileStream];
};
const macHandler = () => {
    const dmgFilePath = path.join(__dirname, `../release/TMMTMM_MAC_V${version}.dmg`);
    const ymlFilePath = path.join(__dirname, `../release/latest.yml`);
    const existFile = fs.existsSync(dmgFilePath);
    if (!existFile) {
        console.error("publish error -4");
        process.exit(-4);
    }
    const dmgFileStream = fs.createReadStream(dmgFilePath);
    const ymlFileStream = fs.createReadStream(ymlFilePath);
    return [dmgFileStream, ymlFileStream];
};

switch (platform) {
    case "win32":
        getPc({
            params: {
                win_type: 2,
            },
        }).then(({ data }) => upload(data, ...winHandler()));
        break;
    case "win64":
        getPc({
            params: {
                win_type: 1,
            },
        }).then(({ data }) => upload(data, ...winHandler()));
        break;
    case "mac":
        getPc().then(({ data }) => upload(data, ...macHandler()));
        break;
    default:
        console.error("publish error -2");
        process.exit(-2);
}
