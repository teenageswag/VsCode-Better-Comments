export interface TagGroupConfig {
	name: string;
	tags: string[];
	defaultColor: string;
	color: string;
	backgroundColor: string;
	fontWeight: string;
}

export interface TagOccurrence {
	groupName: string;
	matchIndex: number;
}

export interface DecorationRange {
	start: number;
	end: number;
}

export interface DecorationBatch {
	groupName: string;
	ranges: DecorationRange[];
}
