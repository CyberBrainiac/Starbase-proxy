import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import url from "./utils/url.js";
import choseHandler from "./lib/constructCustomRequest.js";
import { fetchIpData } from "./lib/usePuppeteer.js";

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

let requestOptions;
let targetPath;
let targetUrl;

const cleanHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: `https://${ALLOWED_ORIGIN}/`,
  Referer: `https://${ALLOWED_ORIGIN}/`,
};

app.all("/proxy/*", async (req, res) => {
  try {
    targetPath = req.url.replace("/proxy/", "");
    targetUrl = `https://${targetPath}`;

    requestOptions = {
      method: req.method,
      url: targetUrl,
      headers: cleanHeaders,
    };

    // Add cookies
    const axiosInstance = axios.create({
      withCredentials: true,
    });

    axiosInstance.interceptors.request.use((config) => {
      console.log("******* AXIOS REQUEST: ********");
      console.log("URL:", config.url);
      console.log("Method:", config.method?.toUpperCase());
      console.log("Headers:", config.headers);
      console.log("Body:", config.data);
      return config;
    });

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      requestOptions.data = req.body;
    } else if (req.method === "GET" && Object.keys(req.query).length) {
      requestOptions.params = req.query;
    }

    const response = await axiosInstance(requestOptions);
    res.status(response.status).send(response.data);
  } catch (error) {
    // If a Cloudflare challenge or 403 status try Puppeteer
    if (
      error.response?.status === 403 ||
      (error.response?.data &&
        typeof error.response.data === "string" &&
        (error.response.data.includes("cf-browser-verification") ||
          error.response.data.includes("cloudflare")))
    ) {
      console.log("Detected Cloudflare challenge, attempting bypass...");
      const result = await fetchIpData(targetUrl);
      res.status(result.status).send(result.data);
    } else {
      throw error;
    }

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
