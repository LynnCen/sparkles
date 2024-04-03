const nodeUrl = require("url");
const nodeQs = require("querystring");

const parseCurrentWindowParams = () => {
    const { href } = window.location;
    const query = nodeUrl.parse(href).query;
    const info = nodeQs.parse(query);
    const data = JSON.parse(info.data || {});

    return data;
};

module.exports = {
    parseCurrentWindowParams,
};
