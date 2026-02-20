import * as vscode from 'vscode';
import { DecorationBatch, TagGroupConfig, TagOccurrence } from './dto';

export interface IConfigService {
	getTagGroups(): TagGroupConfig[];
}

export interface ITagParser {
	parse(text: string, groups: TagGroupConfig[]): TagOccurrence[];
}

export interface ICommentScanner {
	buildDecorationBatches(text: string, occurrences: TagOccurrence[]): DecorationBatch[];
}

export interface IHighlightService {
	rebuild(): void;
	update(editor: vscode.TextEditor): void;
	dispose(): void;
}
