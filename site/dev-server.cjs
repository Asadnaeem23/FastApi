const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/trace.css", ["trace.css", "text/css; charset=utf-8"]],
  ["/route-lens.css", ["route-lens.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
  ["/simulator.js", ["simulator.js", "text/javascript; charset=utf-8"]],
  ["/route-walkthrough.js", ["route-walkthrough.js", "text/javascript; charset=utf-8"]],
]);
http.createServer((request, response) => {
  const requestedPath = new URL(request.url, "http://localhost").pathname;
  const asset = publicFiles.get(requestedPath);
  if (!asset) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": asset[1] });
  fs.createReadStream(path.join(__dirname, asset[0])).pipe(response);
}).listen(4173, "127.0.0.1", () => {
  console.log("FastAPI Field Guide: http://127.0.0.1:4173");
});
