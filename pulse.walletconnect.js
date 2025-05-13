fetch("https://pulse.walletconnect.org/batch?projectId=7c81709b1adb6c04139ec72e5e56175e&st=events_sdk&sv=js-2.17.0", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "content-type": "text/plain;charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://app.sky.money/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "[{\"eventId\":\"8e8a5a58-4323-4d9c-af96-458e80047363\",\"timestamp\":1747158258223,\"domain\":\"https://app.sky.money\",\"props\":{\"event\":\"INIT\",\"type\":\"\",\"properties\":{\"client_id\":\"did:key:z6MktjSt3onYtc293f89ejTpgVyhbtpD3Vg3jYZwu3Ev7Xz1\",\"user_agent\":\"wc-2/js-2.17.0/windows10-chrome-136.0.0/browser:app.sky.money\"}}}]",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

//my request:
fetch("http://localhost:3000/proxy/pulse.walletconnect.org/batch?projectId=7c81709b1adb6c04139ec72e5e56175e&st=events_sdk&sv=js-2.17.0", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "content-type": "text/plain;charset=UTF-8",
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "http://localhost:3000/?network=ethereum",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "[{\"eventId\":\"0c0f7bad-131c-481d-9539-f7ba159d1b4a\",\"timestamp\":1747157922827,\"domain\":\"http://localhost:3000\",\"props\":{\"event\":\"INIT\",\"type\":\"\",\"properties\":{\"client_id\":\"did:key:z6Mkrh3uQZVd18EuapeWY2eQhgLmXtw3MGWkFUGv71waxPqd\",\"user_agent\":\"wc-2/js-2.17.0/windows10-chrome-136.0.0/browser:localhost:3000\"}}}]",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

fetch("https://api.sky.money/ip/status?ip=188.163.97.66", {
  "headers": {
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
  },
  "referrer": "https://app.sky.money/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});

//my request:
fetch("http://localhost:3000/proxy/api.sky.money/ip/status?ip=188.163.97.66", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en,uk;q=0.9,ru;q=0.8,en-US;q=0.7",
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "http://localhost:3000/?network=ethereum",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});