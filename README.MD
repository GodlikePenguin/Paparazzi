<p align="center">
    <img width=256 src="https://raw.githubusercontent.com/GodlikePenguin/Paparazzi/master/assets/logo.png">
    <br />
    <a href="https://www.npmjs.com/package/paparazzi-cli"><img alt="npm" src="https://img.shields.io/npm/v/paparazzi-cli?logo=npm"></a>
    <a href="https://github.com/GodlikePenguin/Paparazzi/actions"><img src="https://github.com/GodlikePenguin/Paparazzi/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://codeclimate.com/github/GodlikePenguin/Paparazzi"><img alt="Code Climate coverage" src="https://img.shields.io/codeclimate/coverage/GodlikePenguin/Paparazzi?logo=codeclimate"></a>
    <a href="https://codeclimate.com/github/GodlikePenguin/Paparazzi"><img alt="Code Climate maintainability" src="https://img.shields.io/codeclimate/maintainability/GodlikePenguin/Paparazzi?logo=codeclimate"></a>
</p>

Small tool to take screenshots of all reachable pages on a website.

Takes a screenshot of the requested page and then scrapes the page for `a` elements and repeats.

## Installation:
```
npm i -g paparazzi-cli
```

## Usage:
```
A tool to take snaps of all angles of your website

USAGE
  $ paparazzi-cli [flags] <URL1> [<URL2> ...]

FLAGS
  -d, --delay=<value>   Number of ms to wait before taking the screenshot on each page
  -h, --height=<value>  [default: 1080] Height of the output images
  -o, --output=<value>  [default: ./images] Output location
  -s, --scale=<value>   [default: 1] Scale factor for the rendered website
  -w, --width=<value>   [default: 1920] Width of the output images
  --allow-all-hosts     Take screenshots of any HTTP host, not just those specified
  --device=<value>      Emulate this device when making HTTP requests
  --full-page           Ensure all content on page is included in screenshot (will override width and height settings)
  --ignore-anchors      Don't take screenshots of each separate anchor link
  --list-devices        List all devices which can be emulated and exit (Note this is a long list)
  --user-agent=<value>  User Agent to spoof whilst making HTTP requests

DESCRIPTION
  A tool to take snaps of all angles of your website
```
The full set of options can be found using `paparazzi-cli --help`
