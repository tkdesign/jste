const { JSDOM } = require('jsdom');
if (typeof Element !== 'function') {
  global.Element = function () {};
}
const jsTE  = require('../src/jste.js');

describe('jsTE Library', () => {
  test('Initialization of jsTE', () => {
    const jsdom = new JSDOM('<!doctype html><html lang="en"><head><link href="src/css/jste.css" rel="stylesheet"></head><body><div class="your-element-selector">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad dolorum ea est eum harum ipsa laudantium magni minima modi neque quo, sed unde vitae. Nemo placeat porro totam. Omnis, possimus.</div></body></html>');
    global.window = jsdom.window;
    global.document = jsdom.window.document;
    global.navigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    };
    const element = jsTE('.your-element-selector');
    expect(element).toBeDefined();
  });

  test('Initialization with a missing element', () => {
    // Creating a jsdom environment without the necessary element
    const jsdomWithoutElement = new JSDOM('<!doctype html><html lang="en"><head><link href="src/css/jste.css" rel="stylesheet"></head><body></body></html>');
    global.window = jsdomWithoutElement.window;
    global.document = jsdomWithoutElement.window.document;
    const element = jsTE('.your-element-selector');
    expect(element).toBeDefined(); // Should remain defined
  });

});
