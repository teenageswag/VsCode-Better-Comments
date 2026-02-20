import * as vscode from 'vscode';
import { TagGroupConfig } from '../models/dto';
import { IConfigService } from '../models/interfaces';

interface TagGroupDefinition {
	name: string;
	tags: string[];
	defaultColor: string;
}

const TAG_GROUP_DEFINITIONS: TagGroupDefinition[] = [
	{ name: 'critical', tags: ['ERROR', 'ERR', 'FIX', 'FIXME'], defaultColor: '#D92626' },
	{ name: 'warning', tags: ['WARNING', 'WARN'], defaultColor: '#D99D26' },
	{ name: 'ideas', tags: ['TODO', 'IDEA', 'OPTIMIZE'], defaultColor: '#306DE8' },
	{ name: 'info', tags: ['NOTE', 'INFO'], defaultColor: '#309BE8' },
];

export class ConfigService implements IConfigService {
	public getTagGroups(): TagGroupConfig[] {
		const config = vscode.workspace.getConfiguration('betterCommentTags');

		return TAG_GROUP_DEFINITIONS.map((group) => ({
			name: group.name,
			tags: group.tags,
			defaultColor: group.defaultColor,
			color: config.get<string>(`${group.name}.color`, group.defaultColor),
			backgroundColor: config.get<string>(`${group.name}.backgroundColor`, ''),
			fontWeight: config.get<string>(`${group.name}.fontWeight`, 'bold'),
		}));
	}
}
