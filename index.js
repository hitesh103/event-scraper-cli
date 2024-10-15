#!/usr/bin/env node

const { Command } = require('commander');
const { advancedEventScraper } = require('./scraper.js');

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to scrape event data from a given URL')
  .option('-u, --url <url>', 'The URL to scrape')
  .parse(process.argv);

const options = program.opts();

if (!options.url) {
  console.error('Please provide a URL using the -u or --url option');
  process.exit(1);
}

const proxyList = [
  '208.110.81.34:17045',
  // Add more proxies if needed
];

advancedEventScraper(options.url, proxyList)
  .then(result => {
    console.log("Result:", result);
    console.log("Completed");
  })
  .catch(error => console.error("Error:", error));
