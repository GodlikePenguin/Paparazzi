#!/usr/bin/env node
import puppeteer from 'puppeteer';
const devices = require('puppeteer/DeviceDescriptors');
import fs from 'fs'
const URL = require('url').URL;
const yargs = require('yargs');
const lib = require("../lib/lib");
const SetQueue = require("../lib/SetQueue")

let browser;

async function run(args) {
    if (args.listDevices) {
        console.log('Available devices are:');
        devices.forEach(a => console.log(a.name));
        return;
    }

    if (args._.length === 0) {
        yargs.showHelp();
        throw 'You must specify at least one URL';
    }

    let realDevice;
    if (args.device) {
        realDevice = devices[args.device];
        if (!realDevice) {
            throw `Unrecognised device: ${args.device}`;
        }
    }

    if (!fs.existsSync(args.output)) {
        fs.mkdirSync(args.output);
    }

    let q = new SetQueue();
    browser = await puppeteer.launch();
    let page = await browser.newPage();

    //Apply more specific arguments last so they are not overwritten
    await page.setViewport({ width: args.width, height: args.height, deviceScaleFactor: args.scale });
    if (args.userAgent) await page.setUserAgent(args.userAgent);
    if (realDevice) await page.emulate(realDevice);

    let allowedHosts = [];

    for (let url of args._) {
        if (url.substring(0, 4) !== 'http') {
            url = 'https://' + url;
        }
        //ignore www. so we're more versatile
        //needs .trim to remove white space too
        allowedHosts.push(new URL(url).hostname.stripPrefix('www.').trim());
        q.push(url);
    }

    if (!args.allowAllHosts) console.log(`Only snapping pages from: ${allowedHosts}`);

    while (!q.empty()) {
        try {
            await lib.screenshot(page, q.pop(), args);
            await lib.addLinks(page, q, allowedHosts, args);
        } catch (e) {
            throw e;
        }
    }

    console.log(`Finished taking ${q.queue.length} snaps`);

    await page.close();
    await browser.close();
}

let argv = yargs
    .usage('Usage: $0 [options] <URL1> [<URL2> ...]')
    .strict()

    .alias('o', 'output')
    .nargs('o', 1)
    .describe('o', 'Output location')
    .default('o', './images')

    .alias('w', 'width')
    .nargs('w', 1)
    .describe('w', 'Screenshot width')
    .default('w', 1920)

    .alias('h', 'height')
    .nargs('h', 1)
    .describe('h', 'Screenshot height')
    .default('h', 1080)

    .nargs('scale', 1)
    .describe('scale', 'Scale factor for the rendered website')
    .default('scale', 1)

    .nargs('delay', 1)
    .describe('delay', 'Number of ms to wait before taking the screenshot on each page.')
    .default('delay', 0)

    .nargs('user-agent', 1)
    .describe('user-agent', 'Set the user agent to specify in each request')

    .nargs('device', 1)
    .describe('device', 'Emulate this device when taking the screenshots')

    .boolean(['list-devices', 'full-page', 'allow-all-hosts'])

    .describe('list-devices', 'List all devices which can be emulated (Note this is a long list)')

    .describe('full-page', 'Ensure all content on page is included in screenshot ' +
        '(will override width and height settings)')
    .default('full-page', false)

    .describe('allow-all-hosts', 'Take screenshots of any host, not just those specified')
    .default('allow-all-hosts', false)

    .help('help')
    .argv;

run(argv)
    .catch(r => {
        console.log(r);
        browser && browser.close();
        process.exitCode = 1;
    });
