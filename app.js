import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import url from "./utils/url.js";
import constructWalletRequest from "./lib/constructWalletRequest.js";

// Setup __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ORIGIN || "app.sky.money";

app.use(express.static(path.join(__dirname, "parsed-site")));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(express.json());

// Proxy endpoint
app.all("/proxy/*", async (req, res) => {
  try {
    // Extract the target URL from the path
    const targetPath = req.url.replace("/proxy/", "");
    const targetUrl = `https://${targetPath}`;
    let requestOptions;

    // Create clean headers that won't trigger Cloudflare
    const cleanHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Origin: `https://${ALLOWED_ORIGIN}/`,
      Referer: `https://${ALLOWED_ORIGIN}/`,
    };

    if (url.isCustom(targetUrl)) {
      requestOptions = await constructWalletRequest(req);
      console.log("Custom request options", requestOptions);
    } else {
      requestOptions = {
        method: req.method,
        url: targetUrl,
        headers: cleanHeaders,
        httpsAgent: new (await import("https")).Agent({
          rejectUnauthorized: false,
        }),
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      };
    }

    // Add cookies
    const axiosInstance = axios.create({
      withCredentials: true,
    });

    // Log request before sending
    axiosInstance.interceptors.request.use((config) => {
      // console.log("******* AXIOS REQUEST: ********");
      // console.log("URL:", config.url);
      // console.log("Method:", config.method?.toUpperCase());
      // console.log("Headers:", config.headers);
      // console.log("Body:", config.data);
      return config;
    });

    // Add data/params based on request method
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      requestOptions.data = req.body;
    } else if (req.method === "GET" && Object.keys(req.query).length) {
      requestOptions.params = req.query;
    }

    // Forward the request using Axios
    const response = await axiosInstance(requestOptions);

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
