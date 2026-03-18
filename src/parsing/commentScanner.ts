import { DecorationBatch, DecorationRange, TagOccurrence } from '../models/dto';
import { ICommentScanner } from '../models/interfaces';

interface CommentBlock {
	start: number;
	end: number;
	singleLine: boolean;
}

export class CommentScanner implements ICommentScanner {
	public buildDecorationBatches(text: string, occurrences: TagOccurrence[]): DecorationBatch[] {
		const groupedRanges = new Map<string, DecorationRange[]>();
		const blocks = this.findCommentBlocks(text);
		const sortedOccurrences = [...occurrences].sort((a, b) => a.matchIndex - b.matchIndex);

		let occurrenceIndex = 0;
		for (const block of blocks) {
			if (block.singleLine) {
				continue;
			}

			while (
				occurrenceIndex < sortedOccurrences.length &&
				sortedOccurrences[occurrenceIndex].matchIndex < block.start
			) {
				occurrenceIndex += 1;
			}

			const blockOccurrences: TagOccurrence[] = [];
			let scanIndex = occurrenceIndex;
			while (
				scanIndex < sortedOccurrences.length &&
				sortedOccurrences[scanIndex].matchIndex < block.end
			) {
				blockOccurrences.push(sortedOccurrences[scanIndex]);
				scanIndex += 1;
			}
			occurrenceIndex = scanIndex;

			this.applyBlockHighlights(text, block, blockOccurrences, groupedRanges);
		}

		this.applySingleLineHighlights(text, sortedOccurrences, blocks, groupedRanges);

		const batches: DecorationBatch[] = [];
		for (const [groupName, ranges] of groupedRanges.entries()) {
			batches.push({ groupName, ranges });
		}

		return batches;
	}

	private findCommentBlocks(text: string): CommentBlock[] {
		const blocks: CommentBlock[] = [];
		let index = 0;

		while (index < text.length) {
			const slashStart = text.indexOf('/*', index);
			const htmlStart = text.indexOf('<!--', index);

			if (slashStart === -1 && htmlStart === -1) {
				break;
			}

			let startIndex = -1;
			let startToken = '';
			let endToken = '';

			if (slashStart !== -1 && (htmlStart === -1 || slashStart < htmlStart)) {
				startIndex = slashStart;
				startToken = '/*';
				endToken = '*/';
			} else {
				startIndex = htmlStart;
				startToken = '<!--';
				endToken = '-->';
			}

			const endIndex = text.indexOf(endToken, startIndex + startToken.length);
			const blockEnd = endIndex === -1 ? text.length : endIndex + endToken.length;
			const newlineIndex = text.indexOf('\n', startIndex);
			const singleLine = newlineIndex === -1 || newlineIndex >= blockEnd;

			blocks.push({ start: startIndex, end: blockEnd, singleLine });

			if (endIndex === -1) {
				break;
			}

			index = blockEnd;
		}

		return blocks;
	}

	private applyBlockHighlights(
		text: string,
		block: CommentBlock,
		occurrences: TagOccurrence[],
		groupedRanges: Map<string, DecorationRange[]>,
	): void {
		if (occurrences.length === 0) {
			return;
		}

		let lineStart = text.lastIndexOf('\n', block.start) + 1;
		let occurrenceIndex = 0;
		let activeGroup: string | null = null;

		while (lineStart < block.end) {
			let lineEnd = text.indexOf('\n', lineStart);
			if (lineEnd === -1) {
				lineEnd = text.length;
			}

			const cappedLineEnd = Math.min(lineEnd, block.end);
			const effectiveLineStart = Math.max(lineStart, block.start);
			const lineText = text.substring(effectiveLineStart, cappedLineEnd);

			let lineOccurrence: TagOccurrence | null = null;
			while (occurrenceIndex < occurrences.length) {
				const occurrence = occurrences[occurrenceIndex];
				if (occurrence.matchIndex < effectiveLineStart) {
					occurrenceIndex += 1;
					continue;
				}
				if (occurrence.matchIndex >= cappedLineEnd) {
					break;
				}
				lineOccurrence = occurrence;
				while (
					occurrenceIndex < occurrences.length &&
					occurrences[occurrenceIndex].matchIndex < cappedLineEnd
				) {
					occurrenceIndex += 1;
				}
				break;
			}

			if (lineOccurrence) {
				activeGroup = lineOccurrence.groupName;
			}

			const parsedLine = this.parseMultilineLine(lineText);
			if (parsedLine.content.trim().length === 0) {
				activeGroup = null;
			}

			if (activeGroup) {
				const highlightStart = effectiveLineStart + parsedLine.highlightOffset;
				const ranges = groupedRanges.get(activeGroup) ?? [];
				ranges.push({ start: highlightStart, end: cappedLineEnd });
				groupedRanges.set(activeGroup, ranges);
			}

			lineStart = lineEnd + 1;
		}
	}

	private applySingleLineHighlights(
		text: string,
		occurrences: TagOccurrence[],
		blocks: CommentBlock[],
		groupedRanges: Map<string, DecorationRange[]>,
	): void {
		let blockIndex = 0;

		for (const occurrence of occurrences) {
			while (blockIndex < blocks.length && occurrence.matchIndex >= blocks[blockIndex].end) {
				blockIndex += 1;
			}

			if (
				blockIndex < blocks.length &&
				occurrence.matchIndex >= blocks[blockIndex].start &&
				occurrence.matchIndex < blocks[blockIndex].end
			) {
				const block = blocks[blockIndex];
				if (!block.singleLine) {
					continue;
				}

				const lineStart = text.lastIndexOf('\n', occurrence.matchIndex) + 1;
				const nextLineIndex = text.indexOf('\n', occurrence.matchIndex);
				const lineEnd = nextLineIndex === -1 ? text.length : nextLineIndex;
				const highlightStart = Math.max(block.start, lineStart);
				const highlightEnd = Math.min(lineEnd, block.end);

				const ranges = groupedRanges.get(occurrence.groupName) ?? [];
				ranges.push({ start: highlightStart, end: highlightEnd });
				groupedRanges.set(occurrence.groupName, ranges);
				continue;
			}

			const matchIndex = occurrence.matchIndex;
			const lineStart = text.lastIndexOf('\n', matchIndex) + 1;
			const nextLineIndex = text.indexOf('\n', matchIndex);
			const lineEnd = nextLineIndex === -1 ? text.length : nextLineIndex;
			const lineText = text.substring(lineStart, lineEnd);

			const singleLineComment = lineText.match(/^\s*(\/\/|#|--)/);
			if (!singleLineComment) {
				continue;
			}

			const markerMatch = lineText.match(/(\/\/|#|--)/);
			if (!markerMatch) {
				continue;
			}

			const markerIndex = lineText.indexOf(markerMatch[0]);
			const highlightStart = lineStart + markerIndex;

			const ranges = groupedRanges.get(occurrence.groupName) ?? [];
			ranges.push({ start: highlightStart, end: lineEnd });
			groupedRanges.set(occurrence.groupName, ranges);
		}
	}

	private parseMultilineLine(lineText: string): { content: string; highlightOffset: number } {
		const leadingWhitespaceMatch = lineText.match(/^\s*/);
		let offset = leadingWhitespaceMatch ? leadingWhitespaceMatch[0].length : 0;
		let remainder = lineText.slice(offset);

		const consumeToken = (token: string): boolean => {
			if (!remainder.startsWith(token)) {
				return false;
			}
			offset += token.length;
			remainder = remainder.slice(token.length);
			return true;
		};

		if (consumeToken('<!--')) {
			// noop
		} else if (consumeToken('-->')) {
			// noop
		} else if (consumeToken('/*')) {
			// noop
		} else if (consumeToken('*/')) {
			// noop
		}

		const extraWhitespace = remainder.match(/^\s*/);
		if (extraWhitespace) {
			offset += extraWhitespace[0].length;
			remainder = remainder.slice(extraWhitespace[0].length);
		}

		if (remainder.startsWith('*')) {
			offset += 1;
			remainder = remainder.slice(1);

			const starWhitespace = remainder.match(/^\s*/);
			if (starWhitespace) {
				offset += starWhitespace[0].length;
				remainder = remainder.slice(starWhitespace[0].length);
			}
		}

		return { content: remainder, highlightOffset: offset };
	}
}
