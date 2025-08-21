const next = require("next");
const https = require("https");
const fs = require("fs");

const hostname = "localhost";
const port = process.env.PORT;
const dev = true;

const app = next({ dev, hostname, port });

const sslOptions = {
  key: process.env.NEXT_HTTPS_KEY,
  cert: process.env.NEXT_HTTPS_CERT,
  ca: process.env.NEXT_HTTPS_BUNDLE,
};

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = https.createServer(sslOptions, (req, res) => {
    // Remove the 'ch-ua-form-factor' feature from the Permissions-Policy header
    res.setHeader("Permissions-Policy", "camera=(), microphone=()");

    // custom api middleware
    if (req.url.startsWith("/api")) {
      return handle(req, res);
    } else {
      // Handle Next.js routes
      return handle(req, res);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:" + port);
  });
});
