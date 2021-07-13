'use strict';

const captions = require('p7d-markdown-it-p-captions');

const workspace = require('vscode').workspace;
const path = require('path');
const fs = require('fs');

const cssFile = 'p-captions.css';
const cssFilePath = __dirname + '/style/' + cssFile;
const savedCssFilePath = __dirname + '/style/_' + cssFile;

function createSavedCssFile () {
  if (!fs.existsSync(savedCssFilePath)) {
    fs.writeFileSync(savedCssFilePath, fs.readFileSync(cssFilePath));
   }
}

async function activate() {

  workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('p7dMarkdownItPCaptions')) {
      if (workspace.getConfiguration('p7dMarkdownItPCaptions').get('disableStyle')) {
        createSavedCssFile();
        fs.writeFileSync(cssFilePath, '');
      } else {
        createSavedCssFile();
        fs.writeFileSync(cssFilePath, fs.readFileSync(savedCssFilePath));
      }
    }
  });

  return {
    extendMarkdownIt(md) {
      return md.use(captions);
    }
  };
}

exports.activate = activate;
