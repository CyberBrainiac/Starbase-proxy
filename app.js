const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ORIGIN || "https://app.sky.money";

app.use(express.static(path.join(__dirname, "parsed-site")));

app.use((req, res, next) => {
  if (req.path === "/" || req.path.startsWith("/static/")) {
    return next();
  }

  const pathSegments = req.path.split("/").filter(Boolean);
  const targetDomain = pathSegments[0];

  if (!targetDomain.includes(".")) {
    return next();
  }

  try {
    const targetUrl = targetDomain.startsWith("http")
      ? targetDomain
      : `https://${targetDomain}`;

    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/[^\/]+\//, "/"),
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("Origin", ALLOWED_ORIGIN);
        proxyReq.setHeader("Referer", ALLOWED_ORIGIN);
        proxyReq.removeHeader("sec-fetch-site");
        proxyReq.removeHeader("sec-fetch-mode");
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err);
        res.status(502).send("Proxy error");
      },
      secure: false,
      logLevel: "debug",
    });

    req.headers.origin = ALLOWED_ORIGIN;
    req.headers.referer = ALLOWED_ORIGIN;

    return proxyMiddleware(req, res, next);
  } catch (err) {
    console.error("Error creating proxy:", err);
    return res.status(400).send("Invalid target URL");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "parsed-site", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
