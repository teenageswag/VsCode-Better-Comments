# Better Comment Highlight

Лёгкое VS Code-расширение для подсветки специальных тегов в комментариях: `TODO`, `FIXME`, `NOTE`, `WARN` и других.

## Что делает расширение

- Подсвечивает строки комментариев, содержащие специальные теги.
- Работает с несколькими типами комментариев:
  - однострочные: `//`, `#`, `--`
  - многострочные: `/* ... */`
- Поддерживает регистронезависимый поиск (`todo:`, `Todo:`, `TODO:` — всё распознается).
- Позволяет настраивать цвет текста, фон и насыщенность шрифта для каждой группы тегов.
- Применяет изменения настроек сразу, без перезапуска VS Code.

## Группы тегов по умолчанию

| Группа | Теги | Цвет по умолчанию |
|---|---|---|
| Critical | `ERROR`, `ERR`, `FIX`, `FIXME` | `#D92626` |
| Warning | `WARNING`, `WARN` | `#D99D26` |
| Ideas | `TODO`, `IDEA`, `OPTIMIZE` | `#306DE8` |
| Info | `NOTE`, `INFO` | `#309BE8` |

> Тег должен быть в формате `TAG:` (с двоеточием), например `TODO:` или `FIXME:`.

## Как пользоваться

### 1) Установка

#### Вариант A — из Releases

1. Скачайте `.vsix` из [Releases](https://github.com/j2cks/VsCode-Better-Comments/releases).
2. В VS Code откройте `Ctrl+Shift+P`.
3. Выполните команду **Extensions: Install from VSIX...**.
4. Выберите скачанный файл.

#### Вариант B — сборка из исходников

```bash
git clone https://github.com/teenageswag/VsCode-Better-Comments.git
cd VsCode-Better-Comments
npm install
npm run compile
npm run package
```

После этого в корне проекта будет `.vsix`, который можно установить через **Install from VSIX...**.

### 2) Добавление тегов в код

```ts
// TODO: вынести это в отдельный сервис
// WARN: возможна деградация производительности
// FIXME: некорректная обработка edge-case
// NOTE: важно не менять порядок инициализации

/*
 * IDEA: заменить текущую стратегию кэширования
 * INFO: этот блок зависит от настроек пользователя
 */
```

### 3) Настройка внешнего вида

Откройте `settings.json` и задайте нужные параметры:

```jsonc
{
  "betterCommentTags.critical.color": "#D92626",
  "betterCommentTags.critical.backgroundColor": "",
  "betterCommentTags.critical.fontWeight": "bold",

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

### Поддерживаемые значения `fontWeight`

- `normal`
- `bold`
- `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`

## Частые вопросы

### Почему тег не подсвечивается?

Проверьте:

- тег написан с двоеточием (`TODO:`),
- тег находится именно внутри комментария,
- используется один из поддерживаемых тегов группы,
- файл открыт в редакторе (подсветка применяется к активному документу).

### Нужно ли перезагружать VS Code после изменения цветов?

Нет. Настройки применяются автоматически.

## Лицензия

MIT
