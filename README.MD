<p align="center">
    <img width=256 src="https://raw.githubusercontent.com/GodlikePenguin/Paparazzi/master/assets/logo.png">
    <br />
    <a href="https://badge.fury.io/js/paparazzi-cli"><img src="https://badge.fury.io/js/paparazzi-cli.svg" alt="npm version" height="18"></a>
    <a href="https://travis-ci.com/GodlikePenguin/Paparazzi"><img src="https://travis-ci.com/GodlikePenguin/Paparazzi.svg?branch=master"></a>
</p>

Small tool to take screenshots of all reachable pages on a website.

Takes a screenshot of the requested page and then scrapes the page for `a` elements and repeats.

## Installation:
```
npm i -g paparazzi-cli
```

## Usage:
```
paparazzi [options] <URL1> [<URL2> ...]

Options:
  --version          Show version number                               [boolean]
  -o, --output       Output location                       [default: "./images"]
  -w, --width        Screenshot width                            [default: 1920]
  -h, --height       Screenshot height                           [default: 1080]
  --scale            Scale factor for the rendered website          [default: 1]
  --delay            Number of ms to wait before taking the screenshot on each
                     page.                                          [default: 0]
  --user-agent       Set the user agent to specify in each request
  --device           Emulate this device when taking the screenshots
  --list-devices     List all devices which can be emulated (Note this is a long
                     list)                                             [boolean]
  --full-page        Ensure all content on page is included in screenshot (will
                     override width and height settings)
                                                      [boolean] [default: false]
  --allow-all-hosts  Take screenshots of any host, not just those specified
                                                      [boolean] [default: false]
  --help             Show help                                         [boolean]
```
The full set of options can be found using `paparazzi --help`
