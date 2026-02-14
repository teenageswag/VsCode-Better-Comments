# Better Comment Tags Highlight

Highlights comment tags like `ERROR:`, `WARN:`, `NOTE:`, `IDEA:` with customizable colors.

Works with `//`, `#`, `--`, and `/*` comment styles. Case-insensitive.

## Tags

| Group | Tags | Default Color |
|---|---|---|
| 🔴 Critical | `ERROR:` `ERR:` `FIX:` `FIXME:` | `#D92626` |
| 🟡 Warning | `WARNING:` `WARN:` | `#D99D26` |
| 🔵 Ideas | `IDEA:` `OPTIMIZE:` | `#306DE8` |
| 🔵 Info | `NOTE:` `INFO:` | `#309BE8` |

## Install

### From Release

1. Download the `.vsix` file from [Releases](https://github.com/j2cks/vs-code-better-comment-tags-highlight/releases)
2. Open VS Code → `Ctrl+Shift+P` → **Extensions: Install from VSIX...**
3. Select the downloaded `.vsix` file
4. Reload VS Code

### Build from Source

```bash
git clone https://github.com/j2cks/vs-code-better-comment-tags-highlight.git
cd vs-code-better-comment-tags-highlight
npm install
npm run package
```

This creates a `.vsix` file in the project root. Install it the same way as above.

## Settings

Add to your `settings.json` to customize any group:

```jsonc
{
  "betterCommentTags.critical.color": "#D92626",         // text color
  "betterCommentTags.critical.backgroundColor": "",       // background (empty = none)
  "betterCommentTags.critical.fontWeight": "bold",        // normal, bold, 100-900

  "betterCommentTags.warning.color": "#D99D26",
  "betterCommentTags.warning.backgroundColor": "",
  "betterCommentTags.warning.fontWeight": "bold",

  "betterCommentTags.ideas.color": "#306DE8",
  "betterCommentTags.ideas.backgroundColor": "",
  "betterCommentTags.ideas.fontWeight": "bold",

  "betterCommentTags.info.color": "#309BE8",
  "betterCommentTags.info.backgroundColor": "",
  "betterCommentTags.info.fontWeight": "bold"
}
```

Changes apply instantly — no reload needed.
