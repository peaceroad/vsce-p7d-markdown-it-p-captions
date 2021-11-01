'use strict';

const captions = require('p7d-markdown-it-p-captions');

const workspace = require('vscode').workspace;
const window = require('vscode').window;
const path = require('path');
const fs = require('fs');

const cssDirectory = __dirname + path.sep + 'style' + path.sep;
const appliedCssFile = cssDirectory + 'p-captions.css';
const appliedCssAnotherFile = cssDirectory + 'p-captions-just-below-figure.css';
const cachedCssFile = cssDirectory + '_p-captions.css';
const cachedCssAnotherFile = cssDirectory + '_p-captions-just-below-figure.css';
async function activate() {

   workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('p7dMarkdownItPCaptions.disableStyle')) {
      let disableStyle = workspace.getConfiguration('p7dMarkdownItPCaptions').get('disableStyle');
      if(disableStyle === undefined) {disableStyle = false;}
      let figureCaptionHasAlwaysBelow = workspace.getConfiguration('p7dMarkdownItPCaptions').get('figureCaptionHasAlwaysBelow');
      if(figureCaptionHasAlwaysBelow === undefined) {figureCaptionHasAlwaysBelow = false;}

      //window.showInformationMessage('disableStyle:: ' + disableStyle + ', figureCaptionHasAlwaysBelow: ' + figureCaptionHasAlwaysBelow);

      if (disableStyle) {
        fs.writeFileSync(appliedCssFile, '');
        fs.writeFileSync(appliedCssAnotherFile, '');

      } else {
        if (figureCaptionHasAlwaysBelow) {
          fs.writeFileSync(appliedCssAnotherFile, fs.readFileSync(cachedCssAnotherFile, 'utf8').toString());
          fs.writeFileSync(appliedCssFile, '');
        } else {
          fs.writeFileSync(appliedCssFile, fs.readFileSync(cachedCssFile, 'utf8').toString());
          fs.writeFileSync(appliedCssAnotherFile, '');
        }
      }
    }

    if (event.affectsConfiguration('p7dMarkdownItPCaptions.figureCaptionHasAlwaysBelow')) {
      let disableStyle = workspace.getConfiguration('p7dMarkdownItPCaptions').get('disableStyle');
      if(disableStyle === undefined) {disableStyle = false;}
      let figureCaptionHasAlwaysBelow = workspace.getConfiguration('p7dMarkdownItPCaptions').get('figureCaptionHasAlwaysBelow');
      if(figureCaptionHasAlwaysBelow === undefined) {figureCaptionHasAlwaysBelow = false;}

      //window.showInformationMessage('disableStyle: ' + disableStyle + ', figureCaptionHasAlwaysBelow:: ' + figureCaptionHasAlwaysBelow);

      if (!disableStyle) {
        if (figureCaptionHasAlwaysBelow) {
          fs.writeFileSync(appliedCssAnotherFile, fs.readFileSync(cachedCssAnotherFile, 'utf8').toString());
          fs.writeFileSync(appliedCssFile, '');
        } else {
          fs.writeFileSync(appliedCssFile, fs.readFileSync(cachedCssFile, 'utf8').toString());
          fs.writeFileSync(appliedCssAnotherFile, '');
        }
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
