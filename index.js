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
  await page.setViewport({ width: args.width, height: args.height });

  for (let url of args._) {
    if (url.substring(0, 4) !== 'http') {
      url = 'https://'+url;
    }
    q.push(url);
  }

  while (!q.empty()) {
    try {
      await screenshot(page, q.pop(), args.output);
      await addLinks(page, q);
    } catch (e) {
      throw e;
    }
  }

  await page.close();
  await browser.close();
}

async function screenshot(page, url, outputDir) {
  let fileName = url.replace(/\//g, '_');
  await page.goto(url);
  await page.waitFor(500);
  console.log(`Snapping ${url}`);
  await page.screenshot({ path: `${outputDir}/${fileName}.png`, type: 'png', fullPage: true });
}

async function addLinks(page, q) {
  let links = await page.$$eval('a', al => { return al.map(a => a.href)});

  for (let l of links) {
    q.push(l);
  }
}

let argv = require('yargs')
  .usage('Usage: $0 [options] URL')
  .demandCommand(1, 'You need to specify at least 1 URL')

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

  .help('help')
  .argv;

run(argv)
  .catch(r => {
    console.log(r);
    browser && browser.close();
  });
