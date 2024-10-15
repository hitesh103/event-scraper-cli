const axios = require('axios');
const { connect } = require('puppeteer-real-browser');
const { getRandomUserAgent, getRandomProxy, getRandomDelay } = require('./utils.js');
const { parseHtml } = require('./parser.js');

async function scrapeWithAxios(url, proxyList) {
  const axiosConfig = {
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    proxy: getRandomProxy(proxyList),
    timeout: 30000,
  };
  const response = await axios.get(url, axiosConfig);
  return response.data;
}

async function scrapeWithPuppeteerReal(url) {
  const { browser, page } = await connect({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    turnstile: true,
    customConfig: {},
    connectOption: {
      defaultViewport: { width: 1920, height: 1080 }
    }
  });

  try {
    await page.setUserAgent(getRandomUserAgent());
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Simulate scrolling
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    const content = await page.content();
    return content;
  } finally {
    await browser.close();
  }
}

async function advancedEventScraper(url, proxyList) {
  try {
    // Random delay before starting
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 5000)));
    
    let html;
    try {
      // First attempt with Axios
      html = await scrapeWithAxios(url, proxyList);
    } catch (axiosError) {
      console.log('Axios scraping failed, falling back to Puppeteer Real Browser');
      // If Axios fails, fall back to Puppeteer Real Browser
      html = await scrapeWithPuppeteerReal(url);
    }

    // Parse the HTML
    const result = await parseHtml(html);
    return result;
  } catch (error) {
    console.error('Error in advanced event scraper:', error);
    throw error;
  }
}

module.exports = { advancedEventScraper };