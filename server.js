const { createServer } = require("https");
const { parse } = require("url");
const { readFileSync } = require("fs");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync(process.env.TLS_KEY_PATH || "/app/priv.key"),
  cert: readFileSync(process.env.TLS_CERT_PATH || "/app/cert.PEM"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, hostname, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
