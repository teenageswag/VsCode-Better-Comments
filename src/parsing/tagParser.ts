import { TagGroupConfig, TagOccurrence } from '../models/dto';
import { ITagParser } from '../models/interfaces';

export class TagParser implements ITagParser {
	public parse(text: string, groups: TagGroupConfig[]): TagOccurrence[] {
		const occurrences: TagOccurrence[] = [];

		for (const group of groups) {
			const tagsPattern = group.tags.join('|');
			const regex = new RegExp(`\\b(${tagsPattern})\\s*:`, 'gi');

			let match: RegExpExecArray | null;
			while ((match = regex.exec(text)) !== null) {
				occurrences.push({
					groupName: group.name,
					matchIndex: match.index,
				});
			}
		}

		return occurrences;
	}
}
