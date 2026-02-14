import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// Tag group definitions
// ---------------------------------------------------------------------------

interface TagGroup {
	name: string;
	tags: string[];
	backgroundColor: string;
}

const TAG_GROUPS: TagGroup[] = [
	{
		name: 'critical',
		tags: ['ERROR', 'ERR', 'FIX', 'FIXME'],
		backgroundColor: '#D92626',
	},
	{
		name: 'warning',
		tags: ['WARNING', 'WARN'],
		backgroundColor: '#D99D26',
	},
	{
		name: 'ideas',
		tags: ['IDEA', 'OPTIMIZE'],
		backgroundColor: '#306DE8',
	},
	{
		name: 'info',
		tags: ['NOTE', 'INFO'],
		backgroundColor: '#309BE8',
	},
];

// ---------------------------------------------------------------------------
// Build decoration types & regex patterns
// ---------------------------------------------------------------------------

interface TagGroupRuntime {
	decorationType: vscode.TextEditorDecorationType;
	regex: RegExp;
}

function buildRuntimeGroups(): TagGroupRuntime[] {
	return TAG_GROUPS.map((group) => {
		const decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: group.backgroundColor,
			color: '#FFFFFF',
			fontWeight: 'bold',
			borderRadius: '3px',
			// Tiny horizontal padding so the tag doesn't feel cramped
			// VS Code expects a CSS-style string here
			before: undefined,
			after: undefined,
		});

		// Match comment prefixes (//, #, --, /*) followed by optional whitespace
		// and then one of the group's tags (case-insensitive).
		// Captures everything from the comment prefix through the tag colon.
		const tagsPattern = group.tags.join('|');
		const regex = new RegExp(
			`(//|#|--|/\\*)\\s*(${tagsPattern}):`,
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
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			decorations.push({ range: new vscode.Range(startPos, endPos) });
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

	context.subscriptions.push(onEditorChange, onDocChange);

	// Also push all decoration types so they get disposed automatically
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
	// Decoration types are disposed via context.subscriptions — nothing extra needed
}
