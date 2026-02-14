import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// Tag group definitions
// ---------------------------------------------------------------------------

interface TagGroup {
	name: string;
	tags: string[];
	defaultColor: string;
}

const TAG_GROUPS: TagGroup[] = [
	{
		name: 'critical',
		tags: ['ERROR', 'ERR', 'FIX', 'FIXME'],
		defaultColor: '#D92626',
	},
	{
		name: 'warning',
		tags: ['WARNING', 'WARN'],
		defaultColor: '#D99D26',
	},
	{
		name: 'ideas',
		tags: ['TODO', 'IDEA', 'OPTIMIZE'],
		defaultColor: '#306DE8',
	},
	{
		name: 'info',
		tags: ['NOTE', 'INFO'],
		defaultColor: '#309BE8',
	},
];

// ---------------------------------------------------------------------------
// Build decoration types & regex patterns from settings
// ---------------------------------------------------------------------------

interface TagGroupRuntime {
	decorationType: vscode.TextEditorDecorationType;
	regex: RegExp;
}

function readGroupStyle(group: TagGroup): vscode.DecorationRenderOptions {
	const config = vscode.workspace.getConfiguration('betterCommentTags');

	const color = config.get<string>(`${group.name}.color`, group.defaultColor);
	const backgroundColor = config.get<string>(`${group.name}.backgroundColor`, '');
	const fontWeight = config.get<string>(`${group.name}.fontWeight`, 'bold');

	const options: vscode.DecorationRenderOptions = {
		color,
		fontWeight,
	};

	// Only set backgroundColor when the user explicitly provides a value
	if (backgroundColor) {
		options.backgroundColor = backgroundColor;
		options.borderRadius = '3px';
	}

	return options;
}

function buildRuntimeGroups(): TagGroupRuntime[] {
	return TAG_GROUPS.map((group) => {
		const decorationType = vscode.window.createTextEditorDecorationType(
			readGroupStyle(group),
		);

		// Match tags anywhere in comments, not just at the start
		// This regex looks for the tag followed by a colon, optionally preceded by whitespace
		const tagsPattern = group.tags.join('|');
		const regex = new RegExp(
			`\\b(${tagsPattern})\\s*:`,
			'gi',
		);

		return { decorationType, regex };
	});
}

// ---------------------------------------------------------------------------
// Decoration update logic
// ---------------------------------------------------------------------------

function updateDecorations(
	editor: vscode.TextEditor,
	groups: TagGroupRuntime[],
): void {
	const text = editor.document.getText();

	for (const group of groups) {
		const decorations: vscode.DecorationOptions[] = [];

		// Reset lastIndex to ensure we scan from the beginning every time
		group.regex.lastIndex = 0;

		let match: RegExpExecArray | null;
		while ((match = group.regex.exec(text)) !== null) {
			// Check if this match is inside a comment
			const matchIndex = match.index;
			const lineStart = text.lastIndexOf('\n', matchIndex) + 1;
			const lineText = text.substring(lineStart, text.indexOf('\n', matchIndex) + 1 || text.length);
			const posInLine = matchIndex - lineStart;

			// Check if we're in a single-line comment (//, #, --)
			const singleLineComment = lineText.match(/^\s*(\/\/|#|--)/);
			// Check if we're in a multi-line comment (/* ... */)
			const beforeMatch = text.substring(0, matchIndex);
			const lastCommentStart = beforeMatch.lastIndexOf('/*');
			const lastCommentEnd = beforeMatch.lastIndexOf('*/');
			const inMultiLineComment = lastCommentStart > lastCommentEnd;

			// Only highlight if we're actually in a comment
			if (singleLineComment || inMultiLineComment) {
				const startPos = editor.document.positionAt(match.index);
				const endPos = editor.document.positionAt(match.index + match[0].length);
				decorations.push({ range: new vscode.Range(startPos, endPos) });
			}
		}

		editor.setDecorations(group.decorationType, decorations);
	}
}

// ---------------------------------------------------------------------------
// Debounce helper
// ---------------------------------------------------------------------------

function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return (...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => fn(...args), delay);
	};
}

// ---------------------------------------------------------------------------
// Extension lifecycle
// ---------------------------------------------------------------------------

let runtimeGroups: TagGroupRuntime[] = [];

/**
 * Dispose old decoration types and rebuild from current settings.
 */
function rebuildDecorations(): void {
	// Dispose previous decoration types
	for (const group of runtimeGroups) {
		group.decorationType.dispose();
	}

	// Build fresh from settings
	runtimeGroups = buildRuntimeGroups();

	// Re-apply to the active editor immediately
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		updateDecorations(editor, runtimeGroups);
	}
}

export function activate(context: vscode.ExtensionContext): void {
	runtimeGroups = buildRuntimeGroups();

	// Debounced variant for rapid text edits (150 ms)
	const debouncedUpdate = debounce(() => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			updateDecorations(editor, runtimeGroups);
		}
	}, 150);

	// Run immediately when the active editor changes
	const onEditorChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor) {
			updateDecorations(editor, runtimeGroups);
		}
	});

	// Debounced update while typing
	const onDocChange = vscode.workspace.onDidChangeTextDocument((event) => {
		const editor = vscode.window.activeTextEditor;
		if (editor && event.document === editor.document) {
			debouncedUpdate();
		}
	});

	// Rebuild decorations when settings change
	const onConfigChange = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('betterCommentTags')) {
			rebuildDecorations();
		}
	});

	context.subscriptions.push(onEditorChange, onDocChange, onConfigChange);

	// Push decoration types for cleanup on deactivate
	for (const group of runtimeGroups) {
		context.subscriptions.push(group.decorationType);
	}

	// Initial run for the already-open editor
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		updateDecorations(activeEditor, runtimeGroups);
	}
}

export function deactivate(): void {
	// Decoration types are disposed via context.subscriptions
}
