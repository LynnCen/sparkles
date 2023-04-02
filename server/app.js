const express = require("express");
const next = require("next");
const prod = process.env.NODE_ENV === "production";

const port = 3000;
const app = next({
    dev: !prod
})
const handle = app.getRequestHandler();
//
// const getLang = str => {
//     const res = str.match(/\/(.+?)\/.*/) || [];
//     return res[1]
// }

app
    .prepare()
    .then(() => {
        const server = express();
        server.get('*', (req, res) => {

            return handle(req, res);
        });

        server.listen(port, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:' + port, ' ------->>>> ' + process.env.NODE_ENV);
        });
    })
    .catch(e => {
        console.error(e.stack);
        process.exit(1);
    })