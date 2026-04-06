import { describe, expect, it, beforeEach, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";
import type { Page } from "playwright";
import { addLinks, screenshot } from "./lib.js"
import { PaparazziProps } from "./PaparazziProps.js";
import SetQueue from "./SetQueue.js";

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
  it("should call goto(), waitFor() and screenshot() on the page argument", async () => {
    const page = mock<Page>();
    const url = "fake/url";

    await screenshot({
      page: page,
      url: url,
      baseProps: defaultConfig
    });

    expect(page.goto).toHaveBeenCalledWith(url);
    expect(page.waitForTimeout).toHaveBeenCalledWith(defaultConfig.delay);
    expect(page.screenshot).toHaveBeenCalledTimes(1);
  })
});

describe("addLinks()", () => {
  let setQueue: MockProxy<SetQueue<string>>;
  let page: MockProxy<Page>;
  const linksToScrape = ["http://example.com", "http://example.com/another", "http://example.com/another#anchor"];

  beforeEach(() => {
    vi.clearAllMocks();
    setQueue = mock<SetQueue<string>>();
    page = mock<Page>();
  })

  it("should add scraped links to the queue", async () => {
    page.$$eval.mockResolvedValue(linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "example.com"
      ],
      baseProps: defaultConfig
    })

    for (const link of linksToScrape) {
      expect(setQueue.push).toHaveBeenCalledWith(link);
    }
  })

  it("should not add links if they are not in allowedHosts", async () => {
    page.$$eval.mockResolvedValue(linksToScrape);

    await addLinks({
      page: page,
      queue: setQueue,
      allowedHosts: [
        "differentExample.com"
      ],
      baseProps: defaultConfig
    })

    expect(setQueue.push).not.toHaveBeenCalled();
  })

  it("should add links regardless of host if allowAllHosts is true", async () => {
    page.$$eval.mockResolvedValue(linksToScrape);

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
      expect(setQueue.push).toHaveBeenCalledWith(link);
    }
  })

  it("should strip hashes from links before adding to the queue when ignoreAnchors is true", async () => {
    page.$$eval.mockResolvedValue(linksToScrape);

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

    expect(setQueue.push).toHaveBeenCalledTimes(3);
    expect(setQueue.push).toHaveBeenNthCalledWith(1, "http://example.com");
    expect(setQueue.push).toHaveBeenNthCalledWith(2, "http://example.com/another");
    expect(setQueue.push).toHaveBeenNthCalledWith(3, "http://example.com/another");
  })
})
