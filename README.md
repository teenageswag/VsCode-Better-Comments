# Better Comment Highlight

Lightweight VS Code extension that highlights tags in comments (TODO, FIXME, NOTE, WARN) with customizable colors.

## Features
- Works with single-line and multi-line comments.
- Case-insensitive tag detection.
- Custom colors, background, and font weight.
- Settings apply instantly.

## Default tags

| Group | Tags | Default color |
| --- | --- | --- |
| Critical | ERROR, ERR, FIX, FIXME | #FF2A3D |
| Warning | WARNING, WARN | #FFAA33 |
| Ideas | TODO, IDEA, OPTIMIZE | #1AA9F5 |
| Info | NOTE, INFO | #6FEA2D |

Tags must be followed by a colon, for example: `TODO: refactor`.

## Install

From Releases:
1. Download the latest `.vsix` from [GitHub Releases](https://github.com/teenageswag/vscode-better-comments/releases).
2. In VS Code, open the Command Palette (`Ctrl+Shift+P`).
3. Run `Extensions: Install from VSIX...`.

Build from source:
```bash
git clone https://github.com/teenageswag/vscode-better-comments
cd .\vscode-better-comments\
npm install
npm run compile
npm run package
```

## Configuration

Legacy settings (still supported):
```jsonc
{
  "betterCommentTags.critical.color": "#FF2A3D",
  "betterCommentTags.critical.backgroundColor": "#450a0a",
  "betterCommentTags.critical.fontWeight": "normal",

  "betterCommentTags.warning.color": "#FFAA33",
  "betterCommentTags.ideas.color": "#1AA9F5",
  "betterCommentTags.info.color": "#6FEA2D"
}
```

Custom groups (added to defaults, same-name overrides):
```jsonc
{
   "betterCommentTags.groups": [
     {
       "name": "security",
       "tags": ["SEC", "SECURITY", "AUTH"],
       "color": "#FF2A3D",
       "backgroundColor": "",
       "fontWeight": "bold"
     },
     {
       "name": "review",
       "tags": ["REVIEW", "CHECK"],
       "color": "#1AA9F5",
       "backgroundColor": "",
       "fontWeight": "normal"
     }
   ]
}
```

Supported `fontWeight` values: `normal`, `bold`, or `100` to `900`.
