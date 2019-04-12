#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const URL = require('url').URL;

let browser;

class SetQueue {
  constructor() {
    this.queue = [];
    this.index = 0;
  }

  push(o) {
    if (!this.queue.includes(o)) {
      this.queue.push(o);
    }
  }

  pop() {
    if (this.index < this.queue.length) {
      let item = this.queue[this.index];
      this.index++;
      return item;
    } else {
      throw 'Cannot pop from empty queue';
    }
  }

  empty() {
    return this.queue.length <= this.index;
  }
}

String.prototype.stripPrefix = function(prefix) {
  if (this.startsWith(prefix)) {
    return this.substring(prefix.length);
  }
  return this;
};

async function run(args) {
  if (!fs.existsSync(args.output)) {
    fs.mkdirSync(args.output);
  }

  let q = new SetQueue();
  browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.setViewport({ width: args.width, height: args.height, deviceScaleFactor: args.scale });

  let allowedHosts = [];

  for (let url of args._) {
    if (url.substring(0, 4) !== 'http') {
      url = 'https://'+url;
    }
    //ignore www. so we're more versatile
    //needs .trim to remove white space too
    allowedHosts.push(new URL(url).hostname.stripPrefix('www.').trim());
    q.push(url);
  }

  if (!args.allowAllHosts) console.log(`Only snapping pages from: ${allowedHosts}`);

  while (!q.empty()) {
    try {
      await screenshot(page, q.pop(), args);
      await addLinks(page, q, allowedHosts, args);
    } catch (e) {
      throw e;
    }
  }

  await page.close();
  await browser.close();
}

async function screenshot(page, url, args) {
  console.log(`Snapping ${url}`);
  let fileName = url.replace(/\//g, '_');
  await page.goto(url);
  await page.waitFor(args.delay);
  await page.screenshot({ path: `${args.output}/${fileName}.png`, type: 'png', fullPage: args.fullPage });
}

async function addLinks(page, q, allowedHosts, args) {
  //Get all the links on the page, ignore empty href.
  let links = await page.$$eval('a', al => { return al.map(a => a.href).filter(a => a)});

  for (let l of links) {
    try {
      let ul = new URL(l);
      if (args.allowAllHosts || allowedHosts.includes(ul.hostname.stripPrefix('www.').trim())) {
        q.push(l);
      }
    } catch (e) {
      console.log(`Could not parse ${l}, skipping.`)
    }
  }
}

let argv = require('yargs')
  .usage('Usage: $0 [options] <URL1> [<URL2> ...]')
  .demandCommand(1, 'You need to specify at least 1 URL')
  .strict()

  .alias('o', 'output')
  .nargs('o', 1)
  .describe('o', 'Output location')
  .default('o', './images')

  .alias('w', 'width')
  .nargs('w', 1)
  .describe('w', 'Screenshot width')
  .default('w', 1920)

  .alias('h', 'height')
  .nargs('h', 1)
  .describe('h', 'Screenshot height')
  .default('h', 1080)

  .nargs('scale', 1)
  .describe('scale', 'Scale factor for the rendered website')
  .default('scale', 1)

  .nargs('delay', 1)
  .describe('delay', 'Number of ms to wait before taking the screenshot on each page.')
  .default('delay', 0)

  .boolean(['full-page', 'allow-all-hosts'])

  .describe('full-page', 'Ensure all content on page is included in screenshot ' +
    '(will override width and height settings)')
  .default('full-page', false)

  .describe('allow-all-hosts', 'Take screenshots of any host, not just those specified')
  .default('allow-all-hosts', false)

  .help('help')
  .argv;

run(argv)
  .catch(r => {
    console.log(r);
    browser && browser.close();
  });
