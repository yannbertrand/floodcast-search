export type Episode = {
	id: string;
	metadata: EpisodeMetadata;
	lines: EpisodeLine[];
	guests: string[];
};

export type EpisodeMetadata = {
	title: string;
	seasonNumber: number;
	episodeNumber: number;
	code: string[6];
	acastUrl: string;
	description: string;
	duration: number;
	durationString: string;
	uploadTimestamp: number;
	uploadDate: string[10];
};

export type EpisodeForAlgolia = {
	id: string;
	start: number;
	content: string;
	episode: {
		id: string;
		code: string[6];
		title: string;
		seasonNumber: number;
		description: string;
		durationString: string;
		guests: string[];
	};
};

export type EpisodeLine = {
	start: number;
	startString: string[12];
	end: number;
	endString: string[12];
	content: string;
};

export type WikipediaInfos = {
	[code: string]: { guests: string[] };
};

export type YtDlpEpisodeInfo = {
	title: string;
	season_number?: number;
	episode_number?: number;
	webpage_url: string;
	description: string;
	duration: number;
	duration_string: string;
	timestamp: number;
	upload_date: string[8];
};
