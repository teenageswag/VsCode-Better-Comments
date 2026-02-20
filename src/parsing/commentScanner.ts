import { DecorationBatch, DecorationRange, TagOccurrence } from '../models/dto';
import { ICommentScanner } from '../models/interfaces';

export class CommentScanner implements ICommentScanner {
	public buildDecorationBatches(text: string, occurrences: TagOccurrence[]): DecorationBatch[] {
		const groupedRanges = new Map<string, DecorationRange[]>();

		for (const occurrence of occurrences) {
			const matchIndex = occurrence.matchIndex;
			const lineStart = text.lastIndexOf('\n', matchIndex) + 1;
			const nextLineIndex = text.indexOf('\n', matchIndex);
			const lineEnd = nextLineIndex === -1 ? text.length : nextLineIndex;
			const lineText = text.substring(lineStart, lineEnd);

			const singleLineComment = lineText.match(/^\s*(\/\/|#|--)/);
			const beforeMatch = text.substring(0, matchIndex);
			const lastCommentStart = beforeMatch.lastIndexOf('/*');
			const lastCommentEnd = beforeMatch.lastIndexOf('*/');
			const inMultiLineComment = lastCommentStart > lastCommentEnd;

			if (!singleLineComment && !inMultiLineComment) {
				continue;
			}

			let highlightStart = matchIndex;

			if (singleLineComment) {
				const markerMatch = lineText.match(/(\/\/|#|--)/);
				if (markerMatch) {
					const markerIndex = lineText.indexOf(markerMatch[0]);
					highlightStart = lineStart + markerIndex;
				}
			} else {
				const multiLineMarker = lineText.match(/^\s*\*/);
				if (multiLineMarker) {
					highlightStart = lineStart + lineText.indexOf('*');
				}
			}

			const ranges = groupedRanges.get(occurrence.groupName) ?? [];
			ranges.push({ start: highlightStart, end: lineEnd });
			groupedRanges.set(occurrence.groupName, ranges);
		}

		const batches: DecorationBatch[] = [];
		for (const [groupName, ranges] of groupedRanges.entries()) {
			batches.push({ groupName, ranges });
		}

		return batches;
	}
}
