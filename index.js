#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');

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

async function run(args) {
  if (!fs.existsSync(args.output)) {
    fs.mkdirSync(args.output);
  }

  let q = new SetQueue();
  browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.setViewport({ width: args.width, height: args.height, deviceScaleFactor: args.scale });

  for (let url of args._) {
    if (url.substring(0, 4) !== 'http') {
      url = 'https://'+url;
    }
    q.push(url);
  }

  while (!q.empty()) {
    try {
      await screenshot(page, q.pop(), args);
      await addLinks(page, q);
    } catch (e) {
      throw e;
    }
  }

  await page.close();
  await browser.close();
}

async function screenshot(page, url, args) {
  let fileName = url.replace(/\//g, '_');
  await page.goto(url);
  await page.waitFor(args.delay);
  console.log(`Snapping ${url}`);
  await page.screenshot({ path: `${args.output}/${fileName}.png`, type: 'png', fullPage: args.fullPage });
}

async function addLinks(page, q) {
  let links = await page.$$eval('a', al => { return al.map(a => a.href)});

  for (let l of links) {
    q.push(l);
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

  .boolean(['full-page'])
  .describe('full-page', 'Ensure all content on page is included in screenshot ' +
    '(will override width and height settings)')
  .default('full-page', false)

  .help('help')
  .argv;

run(argv)
  .catch(r => {
    console.log(r);
    browser && browser.close();
  });
