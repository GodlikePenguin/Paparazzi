import { Page } from "playwright";
import { PaparazziProps } from "./PaparazziProps";
import SetQueue from "./SetQueue";

export async function screenshot(page: Page, url: string, args: PaparazziProps) {
  const fileName = url.replace(/\//g, "_");
  await page.goto(url);
  await page.waitForTimeout(args.delay);
  await page.screenshot({ path: `${args.output}/${fileName}.png`, type: "png", fullPage: args["full-page"] });
}

export async function addLinks(page: Page, q: SetQueue<string>, allowedHosts: Array<string>, args: PaparazziProps) {
  //Get all the links on the page, ignore empty href.
  const links = await page.$$eval("a", elements => { return elements.map(a => a.href).filter(a => a) });

  for (const l of links) {
    try {
      const ul = new URL(l);
      if (args["allow-all-hosts"] || allowedHosts.includes(stripPrefix(ul.hostname, "www.").trim())) {
        q.push(l);
      }
    } catch (e) {
      console.log(`Could not parse ${l}, skipping.`)
    }
  }
}

export function stripPrefix(base: string, prefix: string): string {
  if (base.startsWith(prefix)) {
    return base.substring(prefix.length);
  }
  return base;
}
