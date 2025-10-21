export type Episode = {
	metadata: EpisodeMetadata;
	lines: EpisodeLine[];
};

export type EpisodeMetadata = {
	title: string;
	seasonNumber: number;
	episodeNumber: number;
	code: string[6];
	acastUrl: string;
	description: string;
	duration: string;
	durationString: string;
	uploadTimestamp: string[10];
	uploadDate: string[10];
};

export type EpisodeLine = {
	start: number;
	startString: string[12];
	end: number;
	endString: string[12];
	content: string;
};

export type YtDlpEpisodeInfo = {
	title: string;
	season_number?: number;
	episode_number?: number;
	webpage_url: string;
	description: string;
	duration: string;
	duration_string: string;
	timestamp: string[10];
	upload_date: string[8];
};
