import { calledWithFn, mock, MockProxy } from "jest-mock-extended";
import type { Page } from "playwright";
import { addLinks, screenshot } from "./lib"
import { PaparazziProps } from "./PaparazziProps";
import SetQueue from "./SetQueue";

const defaultConfig: PaparazziProps = {
  output: "./images",
  width: 1920,
  height: 1080,
  scale: 1,
  delay: 0,
  "full-page": false,
  "allow-all-hosts": false,
  "list-devices": false,
  "user-agent": undefined,
  device: undefined,
  "ignore-anchors": false
};

describe("screenshot()", () => {
  test("should call goto(), waitFor() and screenshot() on the page argument", async () => {
    const page = mock<Page>();
    const url = "fake/url";

    await screenshot({
      page: page,
      url: url,
      baseProps: defaultConfig
    });

    expect(page.goto).toBeCalledWith(url);
    expect(page.waitForTimeout).toBeCalledWith(defaultConfig.delay);
    expect(page.screenshot).toBeCalledTimes(1);
  })
});

describe("addLinks()", () => {
  let setQueue: MockProxy<SetQueue<string>>;
  let page: MockProxy<Page>;
  const linksToScrape = ["http://example.com", "http://example.com/another", "http://example.com/another#anchor"];

  beforeEach(() => {
    setQueue = mock<SetQueue<string>>();
    page = mock<Page>();
  })

  test("should add scraped links to the queue", async () => {
    page.$$eval.mockImplementation(async () => linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "example.com"
      ],
      baseProps: defaultConfig
    })

    for (const link of linksToScrape) {
      expect(setQueue.push).toBeCalledWith(link);
    }
  })

  test("should not add links if they are not in allowedHosts", async () => {
    page.$$eval.mockImplementation(async () => linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "differentExample.com"
      ],
      baseProps: defaultConfig
    })

    expect(setQueue.push).toBeCalledTimes(0);
  })

  test("should add links regardless of host if allowAllHosts is true", async () => {
    page.$$eval.mockImplementation(async () => linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "differentExample.com"
      ],
      baseProps: {
        ...defaultConfig,
        "allow-all-hosts": true
      }
    })

    for (const link of linksToScrape) {
      expect(setQueue.push).toBeCalledWith(link);
    }
  })

  test("should strip hashes from links before adding to the queue when ignoreAnchors is true", async () => {
    page.$$eval.mockImplementation(async () => linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "example.com"
      ],
      baseProps: {
        ...defaultConfig,
        "ignore-anchors": true
      }
    })

    expect(setQueue.push).toBeCalledTimes(3);
    expect(setQueue.push).nthCalledWith(1, "http://example.com");
    expect(setQueue.push).nthCalledWith(2, "http://example.com/another");
    expect(setQueue.push).nthCalledWith(3, "http://example.com/another");
  })
})
