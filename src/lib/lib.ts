import { Page } from "playwright";
import { PaparazziProps } from "./PaparazziProps";
import SetQueue from "./SetQueue";

export function stripPrefix(base: string, prefix: string): string {
  if (base.startsWith(prefix)) {
    return base.substring(prefix.length);
  }
  return base;
}

export type ScreenshotProps = {
  page: Page,
  url: string,
  baseProps: PaparazziProps
}

export async function screenshot(props: ScreenshotProps) {
  const fileName = props.url.replace(/\//g, "_");
  await props.page.goto(props.url);
  await props.page.waitForTimeout(props.baseProps.delay);
  await props.page.screenshot({
    path: `${props.baseProps.output}/${fileName}.png`,
    type: "png",
    fullPage: props.baseProps["full-page"]
  });
}

export type AddLinksProps = {
  page: Page,
  queue: SetQueue<string>,
  allowedHosts: Array<string>,
  baseProps: PaparazziProps
}

export async function addLinks(props: AddLinksProps) {
  //Get all the links on the page, ignore empty href.
  const links = await props.page.$$eval("a", elements => { return elements.map(a => a.href).filter(a => a) });

  for (const l of links) {
    try {
      const ul = new URL(l);
      if (!props.baseProps["allow-all-hosts"] && !props.allowedHosts.includes(stripPrefix(ul.hostname, "www.").trim())) {
        continue;
      }
      if (props.baseProps["ignore-anchors"]) {
        props.queue.push(l.substring(0, l.lastIndexOf("#")) || l);
      } else {
        props.queue.push(l);
      }
    } catch (e) {
      console.log(`Could not parse ${l}, skipping.`)
    }
  }
}
