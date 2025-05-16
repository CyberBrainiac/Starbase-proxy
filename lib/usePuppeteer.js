import puppeteer from "puppeteer";
import axios from "axios";

/**
 * Function to fetch IP status from Sky Money API
 * @param {string} reqUrl - IP address to check
 * @returns {Promise<Object>} - Response data from API
 */
export async function fetchIpData(reqUrl) {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // Open new page
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the specified URL
    await page.goto("https://app.sky.money/?network=ethereum", {
      waitUntil: "networkidle2",
    });

    console.log("Navigated to Sky Money app");

    // Create axios instance with required headers
    const response = await axios({
      url: reqUrl,
      method: "GET",
      headers: {
        Accept: "*/*",
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
        origin: "https://app.sky.money/",
        referer: "https://app.sky.money/",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
    });

    console.log("API response received", response.data);
    return response.data;
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}
