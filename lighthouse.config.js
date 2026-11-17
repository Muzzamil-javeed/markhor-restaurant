/** @type {LH.Config} */
module.exports = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: [
      "performance",
      "accessibility",
      "best-practices",
      "seo",
    ],
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttlingMethod: "simulate",
    // Mid-range Android (4x is extreme for local CI noise on Windows).
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 2,
    },
  },
};
