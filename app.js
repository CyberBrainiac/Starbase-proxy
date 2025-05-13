const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ORIGIN || "https://app.sky.money";

app.use(express.static(path.join(__dirname, "parsed-site")));

app.use((req, res, next) => {
  console.log("Catch request:", req.path);

  if (req.path.startsWith("/static/")) {
    console.log("Skip proxy");
    return next();
  }

  const pathSegments = req.path.split("/").filter(Boolean);
  const targetDomain = pathSegments[0];

  // if (!targetDomain || !targetDomain.includes(".")) {
  //   console.log("Skip proxy 2");
  //   return next();
  // }

  // try {
  //   const targetUrl = `https://${targetDomain}`;

  //   // Create and apply proxy middleware
  //   const proxyMiddleware = createProxyMiddleware({
  //     target: targetUrl,
  //     changeOrigin: true,
  //     pathFilter: "/proxy",
  //     pathRewrite: (path) => path.replace(/^\/[^\/]+\//, "/"),
  //     on: {
  //       proxyReq: (proxyReq, req, res) => {
  //         console.log("Magic here", req.path);
  //         proxyReq.setHeader("Origin", ALLOWED_ORIGIN);
  //         proxyReq.setHeader("Referer", ALLOWED_ORIGIN);
  //         proxyReq.removeHeader("sec-fetch-site");
  //         proxyReq.removeHeader("sec-fetch-mode");
  //         console.log(req.headers);
  //       },
  //       proxyRes: (proxyRes, req, res) => {
  //         console.log("Proxy response");

  //         /* handle proxyRes */
  //       },
  //       error: (err, req, res) => {
  //         console.error("Proxy error:", err);
  //         res.writeHead(500, {
  //           "Content-Type": "text/plain",
  //         });
  //       },
  //     },
  //     secure: false,
  //     logLevel: "debug",
  //   });

  //   // Set origin headers on the request object
  //   req.headers.origin = ALLOWED_ORIGIN;
  //   req.headers.referer = ALLOWED_ORIGIN;

  //   return proxyMiddleware(req, res, next);
  // } catch (err) {
  //   console.error("Error creating proxy:", err);
  //   return res.status(400).send("Invalid target URL");
  // }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "parsed-site", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
