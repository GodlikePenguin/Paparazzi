import { mock } from "jest-mock-extended";
import type { Page } from "puppeteer";
import { screenshot } from "./lib"

const defaultConfig = {
  _: [],
  output: './images',
  width: 1920,
  height: 1080,
  scale: 1,
  delay: 0,
  fullPage: false,
  allowAllHosts: false,
};

describe('screenshot()', () => {
  test('should call goto(), waitFor() and screenshot() on the page argument', async () => {
    const page = mock<Page>();
    const url = 'fake/url';

    await screenshot(page, url, defaultConfig);

    expect(page.goto).toBeCalledWith(url);
    expect(page.waitFor).toBeCalledWith(defaultConfig.delay);
    expect(page.screenshot).toBeCalledTimes(1);
  })
});
