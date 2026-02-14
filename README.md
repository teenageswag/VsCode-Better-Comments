# Better Comment Tags Highlight

VS Code extension that highlights special tags in comments with customizable colors for better code readability.

## Features

Automatically highlights the following tags in comments:

| Group | Tags | Default Color |
|---|---|---|
| 🔴 Critical | `ERROR:` `ERR:` `FIX:` `FIXME:` | `#D92626` |
| 🟡 Warning | `WARNING:` `WARN:` | `#D99D26` |
| 🔵 Ideas | `IDEA:` `OPTIMIZE:` | `#306DE8` |
| 🔵 Info | `NOTE:` `INFO:` | `#309BE8` |

## Supported Comment Types

- Single-line: `//`, `#`, `--`
- Multi-line: `/* ... */`
- Case-insensitive matching

## Usage Examples

```cpp
// NOTE: This is an important note
// WARN: Requires attention
// ERROR: Critical error

/*
NOTE: Note in multi-line comment
WARN: Multiple tags work correctly now
*/
```

## Installation

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
npm run compile
npm run package
```

This creates a `.vsix` file in the project root. Install it the same way as above.

## Configuration

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

## What's New in 1.1.0

- Fixed issue where comment prefix (`/*`) was highlighted instead of the tag
- Multiple tags in a single comment now work correctly
- Improved performance and accuracy of tag detection
- Enhanced .gitignore

## License

MIT
