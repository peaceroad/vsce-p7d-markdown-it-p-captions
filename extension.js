'use strict';

const captions = require('p7d-markdown-it-p-captions');
const commands = require('vscode').commands;
const workspace = require('vscode').workspace;
const config = workspace.getConfiguration('p7dMarkdownItPCaptions');
const path = require('path');
const fs = require('fs');

const cssDirectory = __dirname + path.sep + 'style' + path.sep;
const appliedCssFile = cssDirectory + 'p-captions.css';
const cachedCssFile = cssDirectory + '_p-captions.css';

async function activate() {

  let exOption = {
    removeUnnumberedLabel: !config.get('displayUnnumberedLabel'),
    dquoteFilename: config.get('setDoubleQuoteFileName'),
    strongFilename: config.get('setDoubleAsteriskFileName'),
    jointSpaceUseHalfWidth: !config.get('notConvertLabelJointFullWidthSpace'),
  };

  workspace.onDidChangeConfiguration(event => {

    if (event.affectsConfiguration('p7dMarkdownItPCaptions.displayUnnumberedLabel')) {
      exOption.removeUnnumberedLabel = !config.get('displayUnnumberedLabel');
      commands.executeCommand('workbench.action.reloadWindow');
    }
    if (event.affectsConfiguration('p7dMarkdownItPCaptions.setDoubleQuoteFileName')) {
      exOption.dquoteFilename = config.get('setDoubleQuoteFileName');
      commands.executeCommand('workbench.action.reloadWindow');
    }
    if (event.affectsConfiguration('p7dMarkdownItPCaptions.setDoubleAsteriskFileName')) {
      exOption.strongFilename = config.get('setDoubleAsteriskFileName');
      commands.executeCommand('workbench.action.reloadWindow');
    }
    if (event.affectsConfiguration('p7dMarkdownItPCaptions.notConvertLabelJointFullWidthSpace')) {
      exOption.jointSpaceUseHalfWidth = !config.get('notConvertLabelJointFullWidthSpace')
      commands.executeCommand('workbench.action.reloadWindow')
    }

    if (event.affectsConfiguration('p7dMarkdownItPCaptions.disableStyle')) {
      let disableStyle = config.get('disableStyle');
      if(disableStyle === undefined) {disableStyle = false;}

      //window.showInformationMessage('disableStyle:: ' + disableStyle);

      if (disableStyle) {
        fs.writeFileSync(appliedCssFile, '');
      } else {
        fs.writeFileSync(appliedCssFile, fs.readFileSync(cachedCssFile, 'utf8').toString());
      }
      commands.executeCommand('workbench.action.reloadWindow')
    }

  });

  return {
    extendMarkdownIt(md) {
      return md.use(captions, {
        dquoteFilename: exOption.dquoteFilename,
        strongFilename: exOption.strongFilename,
        jointSpaceUseHalfWidth: exOption.jointSpaceUseHalfWidth,
        removeUnnumberedLabel: exOption.removeUnnumberedLabel,
      });
    }
  };
}

exports.activate = activate;
