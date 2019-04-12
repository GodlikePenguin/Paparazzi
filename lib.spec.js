const expect = require('chai').expect;
const sinon = require('sinon');

const lib = require('./lib');

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

describe('screenshot()', async () => {
    it('should call goto(), waitFor() and screenshot() on the page argument', async () => {
      let page = { goto: sinon.stub().resolves(), waitFor: sinon.stub().resolves(), screenshot: sinon.stub().resolves()};
      let url = 'fake/url';

      let s = sinon.stub(console, 'log');
      await lib.screenshot(page, url, defaultConfig);
      s.restore();

      sinon.assert.calledWith(page.goto, url);
      sinon.assert.calledWith(page.waitFor, defaultConfig.delay);
      sinon.assert.calledOnce(page.screenshot);
    })
});
