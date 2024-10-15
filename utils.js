const popularUserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  ];
  
  const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  
  const getRandomUserAgent = () => popularUserAgents[Math.floor(Math.random() * popularUserAgents.length)];
  
  const getRandomProxy = (proxyList) => proxyList[Math.floor(Math.random() * proxyList.length)];
  
  module.exports = { getRandomDelay, getRandomUserAgent, getRandomProxy };
  