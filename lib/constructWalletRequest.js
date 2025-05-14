/**
 * Constructs an Axios request config for WalletConnect requests
 * @param req - Express request object from client
 * @returns Axios request config object
 */
export default function constructWalletRequest(req) {
  // Extract the target URL (remove the 'proxy/' part)
  const targetPath = req.url.replace("/proxy/", "");
  const targetUrl = `https://${targetPath}`;

  // Create clean headers for WalletConnect
  const cleanHeaders = {
    accept: "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "content-type": "text/plain;charset=UTF-8",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    origin: "https://app.sky.money",
    referer: "https://app.sky.money/",
  };

  // Modify the body to match the desired format
  // Parse the incoming body if it's a string
  let requestBody = req.body;
  if (typeof requestBody === "string") {
    try {
      requestBody = JSON.parse(requestBody);
    } catch (error) {
      console.error("Error parsing request body:", error);
    }
  }

  // Process array of events if present
  if (Array.isArray(requestBody)) {
    // Update domain and other properties
    requestBody = requestBody.map((event) => ({
      ...event,
      domain: "https://app.sky.money",
      props: {
        ...event.props,
        properties: {
          ...event.props?.properties,
          client_id:
            event.props?.properties?.client_id ||
            "did:key:z6MktjSt3onYtc293f89ejTpgVyhbtpD3Vg3jYZwu3Ev7Xz1",
          user_agent:
            event.props?.properties?.user_agent?.replace(
              "localhost:3001",
              "app.sky.money"
            ) ||
            "wc-2/js-2.17.0/windows10-chrome-136.0.0/browser:app.sky.money",
        },
      },
    }));
  }

  // Configure the request options
  const requestOptions = {
    method: req.method,
    url: targetUrl,
    headers: cleanHeaders,
    data: requestBody,
    httpsAgent: new (require("https").Agent)({
      rejectUnauthorized: false,
    }),
    maxRedirects: 5,
    validateStatus: (status) => status < 500,
  };

  return requestOptions;
}

// Example of how to use the function in your proxy endpoint
/*
app.all("/proxy/*", async (req, res) => {
  try {
    const requestOptions = constructWalletConnectRequest(req);
    const axiosInstance = axios.create({ withCredentials: false });
    const response = await axiosInstance(requestOptions);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: "Internal Server Error" };
    res.status(status).send(errorData);
  }
});
*/
