// @ts-nocheck

import captions from 'p7d-markdown-it-p-captions';
import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

const commands = vscode.commands;
const workspace = vscode.workspace;

const CONFIG_SECTION = 'p7dMarkdownItPCaptions';
const getExtensionConfig = () => workspace.getConfiguration(CONFIG_SECTION);

const DEFAULT_CLASS_PREFIX = 'caption';
const DEFAULT_REMOVE_UNNUMBERED_LABEL_EXCEPT_MARKS = ['blockquote'];
const REMOVE_BLOCKQUOTE_TOKENS = new Set(['no-blockquote', 'unblockquote']);

const parseCommaSeparated = (value) => {
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
};

const parseLabelPrefixMarker = (value) => {
  const entries = parseCommaSeparated(value);
  if (!entries.length) return null;
  return entries.length === 1 ? entries[0] : entries.slice(0, 2);
};

const parseRemoveUnnumberedLabelExceptMarks = (value) => {
  const entries = parseCommaSeparated(value);
  if (!entries.length) return DEFAULT_REMOVE_UNNUMBERED_LABEL_EXCEPT_MARKS.slice();
  const result = new Set(DEFAULT_REMOVE_UNNUMBERED_LABEL_EXCEPT_MARKS);
  for (const entry of entries) {
    if (REMOVE_BLOCKQUOTE_TOKENS.has(entry.toLowerCase())) {
      result.delete('blockquote');
      continue;
    }
    result.add(entry);
  }
  return Array.from(result);
};

const buildCaptionOptions = () => {
  const config = getExtensionConfig();
  const displayUnnumberedLabel = config.get('displayUnnumberedLabel', false);
  const notConvertLabelJointFullWidthSpace = config.get('notConvertLabelJointFullWidthSpace', false);
  const classPrefixValue = config.get('classPrefix', '');
  const classPrefix = typeof classPrefixValue === 'string' ? classPrefixValue.trim() : '';
  const removeUnnumberedLabelExceptMarks = parseRemoveUnnumberedLabelExceptMarks(
    config.get('removeUnnumberedLabelExceptMarks', '')
  );

  return {
    classPrefix: classPrefix || DEFAULT_CLASS_PREFIX,
    dquoteFilename: config.get('setDoubleQuoteFileName', false),
    strongFilename: config.get('setDoubleAsteriskFileName', false),
    hasNumClass: config.get('hasNumClass', false),
    bLabel: config.get('bLabel', false),
    strongLabel: config.get('strongLabel', false),
    labelPrefixMarker: parseLabelPrefixMarker(config.get('labelPrefixMarker', '')),
    jointSpaceUseHalfWidth: !notConvertLabelJointFullWidthSpace,
    removeUnnumberedLabel: !displayUnnumberedLabel,
    removeUnnumberedLabelExceptMarks,
    removeMarkNameInCaptionClass: config.get('removeMarkNameInCaptionClass', false),
    wrapCaptionBody: config.get('wrapCaptionBody', false),
    setFigureNumber: config.get('setFigureNumber', false),
  };
};

const readFileIfExists = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8').toString();
  } catch {
    return null;
  }
};

const applyStyleSetting = (disableStyle, cssDirectory, appliedCssFile, cachedCssFile) => {
  if (!fs.existsSync(cssDirectory)) {
    return;
  }
  if (disableStyle) {
    const currentCss = readFileIfExists(appliedCssFile);
    if (currentCss !== '') {
      fs.writeFileSync(appliedCssFile, '');
    }
    return;
  }
  const cachedCss = readFileIfExists(cachedCssFile);
  if (cachedCss === null) {
    return;
  }
  const appliedCss = readFileIfExists(appliedCssFile);
  if (appliedCss !== cachedCss) {
    fs.writeFileSync(appliedCssFile, cachedCss);
  }
};

export function activate (ctx) {

  const cssDirectory = path.join(ctx.extensionPath, 'style');
  const appliedCssFile = path.join(cssDirectory, 'p-captions.css');
  const cachedCssFile = path.join(cssDirectory, '_p-captions.css');

  let exOption = buildCaptionOptions();
  let disableStyle = getExtensionConfig().get('disableStyle', false);
  applyStyleSetting(disableStyle, cssDirectory, appliedCssFile, cachedCssFile);

  const configListener = workspace.onDidChangeConfiguration(event => {
    if (!event.affectsConfiguration(CONFIG_SECTION)) {
      return;
    }
    exOption = buildCaptionOptions();
    const nextDisableStyle = getExtensionConfig().get('disableStyle', false);
    if (nextDisableStyle !== disableStyle) {
      disableStyle = nextDisableStyle;
      applyStyleSetting(disableStyle, cssDirectory, appliedCssFile, cachedCssFile);
    }
    commands.executeCommand('workbench.action.reloadWindow');
  });
  ctx.subscriptions.push(configListener);

  return {
    extendMarkdownIt(md) {
      return md.use(captions, exOption)
    }
  }
}

export function deactivate () {}
