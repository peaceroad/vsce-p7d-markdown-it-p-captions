'use strict';

const captions = require('p7d-markdown-it-p-captions');

function activate() {
  return {
    extendMarkdownIt(md) {
      return md.use(captions);
    }
  };
}

exports.activate = activate;
