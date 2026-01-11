# Change Log

## 0.6.0 2026/01/11

Bump updates by p7d-markdown-it-p-captions@0.20.1. Probably... the basic operation hasn't changed.

- From 0.5.1: caption detection keywords/types were updated to match the upstream plugin (slide/audio added; label lists revised), and unnumbered blockquote labels are kept by default when unnumbered labels are hidden.
- Caption handling options are now exposed (label prefix markers, filename markers, label tags, label-number class, body wrapping, mark-name stripping, auto numbering).
- Fix: treat dot-numbered (Figure.1 type) labels as numbered and cache mark regex entries
- Caption detection performance improved by caching mark regex entries in p7d-markdown-it-p-captions.
- README updated to match the current caption label list, delimiter rules, and available options.

## 0.5.1 2023/04/09

- Add `source` for blockquote caption string.

## 0.5.0 2023/02/23

Warning. This version may be different in usability than in the past use.

- By default, if the label that specifies the caption is not numbered, remove the label itself on output (preview).
    -  Markdown `Figure. A caption.` converted to HTML `<p>A caption.</p>`.
    - You can get the same output by changing the settings.
- by default, full-width spaces used as label joints are converted to half-width spaces on output(preview).
     - You can get the same output by changing the settings.
- Significantly rewritten simple CSS.
    - Because of the use of has(), it will look different in the preview and when outputting to HTML and viewed in a browser. It seems that vscode's Markdown viewer doesn't support has() yet.

Note. 100

## 0.4.0 2021/11/01

- Delete `caption-example`.
- Add `caption-blockquote` for blockquote caption.
- Adjust CSS  a bit.
- Add option: `p7dMarkdownItPCaptions.figureCaptionHasAlwaysBelow`. If the caption in the figure or illust or photo has always below, apply another CSS to adjust margin.

## 0.3.2 - 2021/08/04

- Not recommended. Use [another plugin](https://marketplace.visualstudio.com/items?itemName=peaceroad.p7d-markdown-it-figure-with-p-caption).

## 0.3.1, 0.3.1 - 2021/07/13

- Add span element for caption's label.
- Add simple CSS for captions.

## 0.2.2 - 2021/06/21

- Improved processing

## 0.2.1, 0.2.0 - 2021/06/18

- Improved processing

## 0.1.0 - 2021/06/16

- Initial release
