import { Browser, chromium, devices, Page, ViewportSize } from "playwright";
import fs from "fs";
import { URL } from "url";
import { addLinks, screenshot, SetQueue, stripPrefix } from "../lib";
import { CliUx, Command } from "@oclif/core"
import { FLAGS, PaparazziProps } from "../lib/PaparazziProps";
// Defining the type locally as it is not exported from Playwright
type DeviceDescriptor = {
    viewport: ViewportSize;
    userAgent: string;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    defaultBrowserType: "chromium" | "firefox" | "webkit";
};

export class Paparazzi extends Command {
    static description = "A tool to take snaps of all angles of your website";
    static usage = "[flags] <URL1> [<URL2> ...]";
    static flags = FLAGS;

    static strict = false;

    private browser: Browser | undefined;

    async run(): Promise<void> {
        const { flags, argv } = await this.parse(Paparazzi);
        if (flags["list-devices"]) {
            this.log("Available devices are:");
            Object.entries(devices).forEach(([key, value]) => this.log(`${key}: ${JSON.stringify(value, null, 2)}`));
            this.exit();
        }

        if (argv.length === 0) {
            this.error("You must specify at least one URL", { exit: 1 });
        }

        const realDevice = await this.setupDevice(flags);

        if (!fs.existsSync(flags.output)) {
            fs.mkdirSync(flags.output);
        }

        const q = new SetQueue<string>();

        const page = await this.setupPage(realDevice, flags);

        const allowedHosts = [];
        for (const arg of argv) {
            let url = arg as string
            if (!url.startsWith("http")) {
                url = "https://" + url;
            }
            //ignore www. so we're more versatile
            //needs .trim to remove white space too
            allowedHosts.push(stripPrefix(new URL(url).hostname, "www.").trim());
            q.push(url);
        }

        if (!flags["allow-all-hosts"]) console.log(`Only snapping pages from: ${allowedHosts}`);

        await this.takeScreenshots(q, page, flags, allowedHosts);

        this.log(`Finished taking ${q.size()} snaps`);

        await page.close();
        await this.browser?.close();
    }

    async setupDevice(flags: PaparazziProps): Promise<DeviceDescriptor | undefined> {
        let realDevice: DeviceDescriptor | undefined = undefined;
        if (flags.device) {
            realDevice = devices[flags.device];
            if (realDevice === undefined) {
                this.error(`Unrecognised device: ${flags.device}`, { exit: 1 });
            }
        }
        return realDevice;
    }

    async setupPage(realDevice: DeviceDescriptor | undefined, flags: PaparazziProps): Promise<Page> {
        this.browser = await chromium.launch();
        let context = await this.browser.newContext({
            viewport: {
                height: flags.height,
                width: flags.width
            },
            userAgent: flags["user-agent"],
            deviceScaleFactor: flags.scale
        });
        if (realDevice !== undefined) context = await this.browser.newContext({
            ...realDevice
        });
        return await context.newPage();
    }

    async takeScreenshots(q: SetQueue<string>, page: Page, flags: PaparazziProps, allowedHosts: string[]) {
        while (!q.empty()) {
            const url = q.pop();
            CliUx.ux.action.start(`Snapping ${url}`);
            await screenshot({
                page: page,
                url: url,
                baseProps: flags
            });
            await addLinks({
                page: page,
                queue: q,
                allowedHosts: allowedHosts,
                baseProps: flags
            });
            CliUx.ux.action.stop();
        }
    }

    async finally(): Promise<void> {
        await this.browser?.close();
    }
}
