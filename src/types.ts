export type Episode = {
	id: string;
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
		title: string;
		seasonNumber: number;
		episodeNumber: number;
		description: string;
		durationString: string;
		uploadDate: string[10];
	};
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
	duration: number;
	duration_string: string;
	timestamp: number;
	upload_date: string[8];
};
