const puppeteer = require('puppeteer');

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
  let q = new SetQueue();
  browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  let firstURL = args[0];
  if (firstURL.substring(0, 3) !== 'htt') {
    firstURL = 'https://'+firstURL;
  }
  q.push(firstURL);

  while (!q.empty()) {
    try {
      await screenshot(page, q.pop());
      await addLinks(page, q);
    } catch (e) {
      throw e;
    }
  }

  await page.close();
  await browser.close();
}

async function screenshot(page, url) {
  let fileName = url.replace(/\//g, '_');
  await page.goto(url);
  await page.waitFor(500);
  console.log(`Snapping ${url}`);
  await page.screenshot({ path: `./images/${fileName}.png`, type: 'png', fullPage: true });
}

async function addLinks(page, q) {
  let links = await page.$$eval('a', al => { return al.map(a => a.href)});

  for (let l of links) {
    q.push(l);
  }
}

run(process.argv.filter((k, i) => i > 1))
  .catch(r => {
    console.log(r);
    browser && browser.close();
  });
