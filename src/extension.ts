import * as vscode from 'vscode';
import { ConfigService } from './config/configService';
import { HighlightService } from './decorations/highlightService';
import { CommentScanner } from './parsing/commentScanner';
import { TagParser } from './parsing/tagParser';
import { createDisposableStore, debounce } from './platform/disposables';

export function activate(context: vscode.ExtensionContext): void {
	const disposables = createDisposableStore();
	const highlightService = new HighlightService(
		new ConfigService(),
		new TagParser(),
		new CommentScanner(),
	);

	const updateActiveEditor = (): void => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			highlightService.update(editor);
		}
	};

	const debouncedUpdate = debounce(updateActiveEditor, 150);

	disposables.add(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				highlightService.update(editor);
			}
		}),
		vscode.workspace.onDidChangeTextDocument((event) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && event.document === editor.document) {
				debouncedUpdate();
			}
		}),
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration('betterCommentTags')) {
				highlightService.rebuild();
				updateActiveEditor();
			}
		}),
	);

	context.subscriptions.push({
		dispose: () => {
			disposables.dispose();
			highlightService.dispose();
		},
	});

	updateActiveEditor();
}

export function deactivate(): void {
	// Cleanup happens via subscriptions in activate.
}
