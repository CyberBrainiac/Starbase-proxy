const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ORIGIN || "app.sky.money";

app.use(express.static(path.join(__dirname, "parsed-site")));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Proxy endpoint
app.all("/proxy/*", async (req, res) => {
  try {
    // Extract the target URL from the path
    const targetPath = req.url.replace("/proxy/", "");
    const targetUrl = targetPath.startsWith("http")
      ? targetPath
      : `https://${targetPath}`;

    // Create clean headers that won't trigger Cloudflare
    const cleanHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Origin: ALLOWED_ORIGIN,
      Referer: `https://${ALLOWED_ORIGIN}/`,
    };

    // Add cookies if needed (helps with Cloudflare)
    const cookieJar = axios.create({
      withCredentials: true,
    });

    // Configure the request options
    const requestOptions = {
      method: req.method,
      url: targetUrl,
      headers: cleanHeaders,
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Accept all responses < 500
    };

    // Add data/params based on request method
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      requestOptions.data = req.body;
    } else if (req.method === "GET" && Object.keys(req.query).length) {
      requestOptions.params = req.query;
    }

    // Forward the request using Axios
    const response = await cookieJar(requestOptions);

    // Send the response back to the client
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    const status = error.response?.status || 500;
    const errorData = error.response?.data || {
      message: "Internal Server Error",
    };
    res.status(status).send(errorData);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "parsed-site", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
