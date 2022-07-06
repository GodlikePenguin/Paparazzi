import puppeteer, { Browser } from "puppeteer";
import fs from "fs";
import { URL } from "url";
import { addLinks, screenshot, SetQueue, stripPrefix } from "../lib";
import { CliUx, Command } from "@oclif/core"
import { FLAGS } from "../lib/PaparazziProps";

let browser: Browser;

export class Paparazzi extends Command {
    static description = "A tool to take snaps of all angles of your website";
    static usage = "[options] <URL1> [<URL2> ...]";
    static flags = FLAGS;

    static strict = false;

    async run(): Promise<void> {
        const { flags, argv } = await this.parse(Paparazzi);
        if (flags["list-devices"]) {
            this.log("Available devices are:");
            Object.entries(puppeteer.devices).forEach(([key, value]) => this.log(`${key}: ${JSON.stringify(value, null, 2)}`));
            this.exit();
        }

        if (argv.length === 0) {
            this.error("You must specify at least one URL", { exit: 1 });
        }

        let realDevice;
        if (flags.device) {
            realDevice = puppeteer.devices[flags.device];
            if (!realDevice) {
                this.error(`Unrecognised device: ${flags.device}`, { exit: 1 });
            }
        }

        if (!fs.existsSync(flags.output)) {
            fs.mkdirSync(flags.output);
        }

        const q = new SetQueue<string>();
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Apply more specific arguments last so they are not overwritten
        await page.setViewport({ width: flags.width, height: flags.height, deviceScaleFactor: flags.scale });
        if (flags["user-agent"]) await page.setUserAgent(flags["user-agent"]);
        if (realDevice) await page.emulate(realDevice);

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

        while (!q.empty()) {
            const url = q.pop();
            CliUx.ux.action.start(`Snapping ${url}`);
            await screenshot(page, url, flags);
            await addLinks(page, q, allowedHosts, flags);
            CliUx.ux.action.stop();
        }

        this.log(`Finished taking ${q.size()} snaps`);

        await page.close();
        await browser.close();
    }

    async finally(): Promise<void> {
        if (browser) {
            await browser.close()
        }
    }
}
