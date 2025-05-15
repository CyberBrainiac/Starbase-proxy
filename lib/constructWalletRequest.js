/**
 * Constructs an Axios request config for WalletConnect requests
 * @param req - Express request object from client
 * @returns Axios request config object
 */

const ALLOWED_ORIGIN = process.env.ORIGIN || "app.sky.money";

export async function constructWalletRequest(req) {
  const targetPath = req.url.replace("/proxy/", "");
  const targetUrl = `https://${targetPath}`;

  // Create clean headers for WalletConnect
  const cleanHeaders = {
    accept: "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "content-type": "text/plain;charset=UTF-8",
    "cache-control": "no-cache",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    origin: `https://${ALLOWED_ORIGIN}/`,
    referer: `https://${ALLOWED_ORIGIN}/`,
    referrerPolicy: "strict-origin-when-cross-origin",
  };

  let requestBody = req.body;
  if (typeof requestBody === "string") {
    try {
      requestBody = JSON.parse(requestBody);
    } catch (error) {
      console.error("Error parsing request body:", error);
    }
  }

  // Configure the request options
  const requestOptions = {
    method: req.method,
    url: targetUrl,
    headers: cleanHeaders,
    data: requestBody,
  };

  return requestOptions;
}

export async function constructApiRequest(req) {
  const targetPath = req.url.replace("/proxy/", "");
  const targetUrl = `https://${targetPath}`;

  // Create clean headers for WalletConnect
  const cleanHeaders = {
    accept: "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    origin: `https://${ALLOWED_ORIGIN}/`,
    referer: `https://${ALLOWED_ORIGIN}/`,
    referrerPolicy: "strict-origin-when-cross-origin",
  };

  // Configure the request options
  const requestOptions = {
    method: req.method,
    url: targetUrl,
    headers: cleanHeaders,
  };

  return requestOptions;
}

export default function choseHandler(req) {
  if (req.url.includes("pulse.walletconnect.org")) {
    return constructWalletRequest(req);
  }
  if (req.url.includes("api.sky.money")) {
    return constructApiRequest(req);
  } else {
    return null;
  }
}
