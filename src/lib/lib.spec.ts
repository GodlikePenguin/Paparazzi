import { mock } from "jest-mock-extended";
import type { Page } from "playwright";
import { screenshot } from "./lib"
import { PaparazziProps } from "./PaparazziProps";

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
  device: undefined
};

describe("screenshot()", () => {
  test("should call goto(), waitFor() and screenshot() on the page argument", async () => {
    const page = mock<Page>();
    const url = "fake/url";

    await screenshot(page, url, defaultConfig);

    expect(page.goto).toBeCalledWith(url);
    expect(page.waitForTimeout).toBeCalledWith(defaultConfig.delay);
    expect(page.screenshot).toBeCalledTimes(1);
  })
});
