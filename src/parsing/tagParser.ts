import { TagGroupConfig, TagOccurrence } from '../models/dto';
import { ITagParser } from '../models/interfaces';

const escapeRegex = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class TagParser implements ITagParser {
	public parse(text: string, groups: TagGroupConfig[]): TagOccurrence[] {
		const occurrences: TagOccurrence[] = [];

		for (const group of groups) {
			const tagsPattern = group.tags.map(escapeRegex).join('|');
			if (!tagsPattern) {
				continue;
			}

			const regex = new RegExp(
				`(^|[^\\w])(${tagsPattern})\\s*(\\([^\\r\\n)]*\\))?\\s*:`,
				'gi',
			);

			let match: RegExpExecArray | null;
			while ((match = regex.exec(text)) !== null) {
				occurrences.push({
					groupName: group.name,
					matchIndex: match.index + match[1].length,
				});
			}
		}

		return occurrences;
	}
}
