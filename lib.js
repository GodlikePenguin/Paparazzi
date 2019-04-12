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

module.exports = {
  screenshot,
  addLinks,
};
