# Better Comment Tags Highlight

VS Code extension that highlights specific tags in comments with colored backgrounds for better readability.

## Supported Tags

| Group | Tags | Color |
|---|---|---|
| 🔴 Critical | `ERROR:` `ERR:` `FIX:` `FIXME:` | Red `#D92626` |
| 🟡 Warning | `WARNING:` `WARN:` | Orange `#D99D26` |
| 🔵 Ideas | `IDEA:` `OPTIMIZE:` | Blue `#306DE8` |
| 🔵 Info | `NOTE:` `INFO:` | Light Blue `#309BE8` |

Tags are matched **case-insensitively** inside lines starting with `//`, `#`, `--`, or `/*`.

## Build & Run

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile
```

Press **F5** in VS Code to launch the Extension Development Host and test.

## Example

```js
// ERROR: This needs immediate attention
// warn: Potential issue here
# NOTE: Keep this in mind
/* IDEA: We could refactor this */
-- FIXME: Legacy code
```
