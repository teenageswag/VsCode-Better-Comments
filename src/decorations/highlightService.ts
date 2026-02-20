import * as vscode from 'vscode';
import { TagGroupConfig } from '../models/dto';
import {
	ICommentScanner,
	IConfigService,
	IHighlightService,
	ITagParser,
} from '../models/interfaces';

export class HighlightService implements IHighlightService {
	private decorationTypes = new Map<string, vscode.TextEditorDecorationType>();
	private groups: TagGroupConfig[] = [];

	public constructor(
		private readonly configService: IConfigService,
		private readonly tagParser: ITagParser,
		private readonly commentScanner: ICommentScanner,
	) {
		this.rebuild();
	}

	public rebuild(): void {
		this.disposeDecorationTypes();
		this.groups = this.configService.getTagGroups();

		for (const group of this.groups) {
			const options: vscode.DecorationRenderOptions = {
				color: group.color,
				fontWeight: group.fontWeight,
			};

			if (group.backgroundColor) {
				options.backgroundColor = group.backgroundColor;
				options.borderRadius = '3px';
			}

			this.decorationTypes.set(
				group.name,
				vscode.window.createTextEditorDecorationType(options),
			);
		}
	}

	public update(editor: vscode.TextEditor): void {
		const text = editor.document.getText();
		const occurrences = this.tagParser.parse(text, this.groups);
		const batches = this.commentScanner.buildDecorationBatches(text, occurrences);

		for (const group of this.groups) {
			const decorationType = this.decorationTypes.get(group.name);
			if (!decorationType) {
				continue;
			}

			const batch = batches.find((item) => item.groupName === group.name);
			const decorations: vscode.DecorationOptions[] = (batch?.ranges ?? []).map((range) => ({
				range: new vscode.Range(
					editor.document.positionAt(range.start),
					editor.document.positionAt(range.end),
				),
			}));

			editor.setDecorations(decorationType, decorations);
		}
	}

	public dispose(): void {
		this.disposeDecorationTypes();
	}

	private disposeDecorationTypes(): void {
		for (const decorationType of this.decorationTypes.values()) {
			decorationType.dispose();
		}
		this.decorationTypes.clear();
	}
}
