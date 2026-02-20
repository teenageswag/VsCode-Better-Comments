# Better Comment Highlight

[**English**](#english) | [**Русский**](#русский)

---

<a name="english"></a>

## English

Lightweight VS Code extension that highlights specific tags in comments (like `TODO`, `FIXME`, `NOTE`, `WARN`) with customizable colors to improve code readability.

### 🚀 Key Features

- **Multi-line Support**: Highlights tags in both single-line (`//`, `#`, `--`) and multi-line (`/* ... */`) comments.
- **Smart Detection**: Case-insensitive matching (e.g., `todo:`, `Todo:`, `TODO:`).
- **Customizable**: Change text color, background, and font weight for each tag group.
- **Hot Reload**: Settings apply instantly without needing to restart VS Code.

### 📋 Default Tag Groups

| Group | Tags | Default Color |
|---|---|---|
| **Critical** | `ERROR`, `ERR`, `FIX`, `FIXME` | `#D92626` |
| **Warning** | `WARNING`, `WARN` | `#D99D26` |
| **Ideas** | `TODO`, `IDEA`, `OPTIMIZE` | `#306DE8` |
| **Info** | `NOTE`, `INFO` | `#309BE8` |

> [!TIP]
> Tags must be followed by a colon, for example: `TODO: content`.

### 📦 Installation

#### Option A: From Releases (Recommended)

1. Download the latest `.vsix` file from [**GitHub Releases**](https://github.com/teenageswag/VsCode-Better-Comments/releases).
2. In VS Code, open the Command Palette (`Ctrl+Shift+P`).
3. Select **Extensions: Install from VSIX...**.
4. Choose the downloaded file.

#### Option B: Build from Source

```bash
git clone https://github.com/teenageswag/VsCode-Better-Comments.git
cd VsCode-Better-Comments
npm install
npm run compile
npm run package
```

Install the generated `.vsix` file via the **Install from VSIX...** command.

### ⚙️ Configuration

Open your `settings.json` to customize the appearance:

```jsonc
{
  "betterCommentTags.critical.color": "#D92626",
  "betterCommentTags.critical.backgroundColor": "#450a0a", // Optional
  "betterCommentTags.critical.fontWeight": "bold",

  "betterCommentTags.warning.color": "#D99D26",
  "betterCommentTags.ideas.color": "#306DE8",
  "betterCommentTags.info.color": "#309BE8"
}
```

**Supported `fontWeight` values:**

- `normal`, `bold`
- Numeric values: `100` to `900`

---

<a name="русский"></a>

## Русский

Легкое расширение для VS Code, которое подсвечивает специальные теги в комментариях (`TODO`, `FIXME`, `NOTE`, `WARN`), помогая лучше ориентироваться в коде.

### 🚀 Основные возможности

- **Поддержка разных стилей**: Работает с однострочными (`//`, `#`, `--`) и многострочными (`/* ... */`) комментариями.
- **Умное распознавание**: Регистронезависимый поиск (например, `todo:`, `Todo:`, `TODO:` — всё распознается).
- **Гибкая настройка**: Можно менять цвет текста, фон и насыщенность шрифта для каждой группы.
- **Мгновенное обновление**: Настройки применяются сразу, перезапуск редактора не требуется.

### 📋 Группы тегов по умолчанию

| Группа | Теги | Цвет по умолчанию |
|---|---|---|
| **Critical** | `ERROR`, `ERR`, `FIX`, `FIXME` | `#D92626` |
| **Warning** | `WARNING`, `WARN` | `#D99D26` |
| **Ideas** | `TODO`, `IDEA`, `OPTIMIZE` | `#306DE8` |
| **Info** | `NOTE`, `INFO` | `#309BE8` |

> [!TIP]
> Тег должен заканчиваться двоеточием, например: `TODO: текст`.

### 📦 Установка

#### Вариант А: Из Releases (Быстрый)

1. Скачайте актуальный `.vsix` файл из [**GitHub Releases**](https://github.com/teenageswag/VsCode-Better-Comments/releases).
2. В VS Code откройте палитру команд (`Ctrl+Shift+P`).
3. Выберите команду **Extensions: Install from VSIX...**.
4. Выберите скачанный файл.

#### Вариант Б: Сборка из исходников

```bash
git clone https://github.com/teenageswag/VsCode-Better-Comments.git
cd VsCode-Better-Comments
npm install
npm run compile
npm run package
```

После сборки установите полученный `.vsix` файл через команду **Install from VSIX...**.

### ⚙️ Настройка

Откройте `settings.json` для настройки внешнего вида:

```jsonc
{
  "betterCommentTags.critical.color": "#D92626",
  "betterCommentTags.critical.backgroundColor": "#450a0a", // Опционально
  "betterCommentTags.critical.fontWeight": "bold",

  "betterCommentTags.warning.color": "#D99D26",
  "betterCommentTags.ideas.color": "#306DE8",
  "betterCommentTags.info.color": "#309BE8"
}
```

**Поддерживаемые значения `fontWeight`:**

- `normal`, `bold`
- Числовые значения: от `100` до `900`

---

## License

MIT
