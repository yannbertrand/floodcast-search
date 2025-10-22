import {
	access,
	constants,
	readdir,
	readFile,
	writeFile,
} from 'node:fs/promises';
import type {
	EpisodeLine,
	EpisodeMetadata,
	YtDlpEpisodeInfo,
} from '../src/types.ts';

const EPISODES_INFO_FILE_PATHS = 'data/yt-dlp/info/';
const EPISODES_SUBTITLES_FILE_PATHS = 'data/subtitles/';
const EPISODES_DESTINATION_FILE_PATHS = 'data/episodes/';

export async function writeEpisodes(forceRewrite = false) {
	const episodesYtDlpFileNames = await getEpisodesYtDlpFileNames();
	await writeEpisodeFiles(episodesYtDlpFileNames, forceRewrite);
}

await writeEpisodes(process.argv.includes('--force'));

export async function writeEpisodeFiles(
	episodesYtDlpFileNames: string[],
	forceRewrite: boolean,
): Promise<void> {
	for (const episodeYtDlpFileName of episodesYtDlpFileNames) {
		if (episodeYtDlpFileName === 'Il_s_agissait_du_Floodcast.info.json') {
			continue;
		}

		const baseFileName = episodeYtDlpFileName.slice(0, -10);
		const episodeDestinationFilePath =
			getEpisodeDestinationFilePath(baseFileName);
		console.debug(`${baseFileName} - Analyse en cours...`);
		if (!forceRewrite) {
			try {
				await access(episodeDestinationFilePath, constants.R_OK);
				console.debug(
					`${baseFileName} - Fichier destination déjà généré, passage à l'épisode suivant.\n`,
				);
				continue;
			} catch {}
		}

		const episodeSubtitleFilePath = getEpisodeSubtitleFilePath(baseFileName);
		try {
			await access(episodeSubtitleFilePath, constants.R_OK);
		} catch {
			console.warn(
				`${baseFileName} - Fichier de sous-titres non trouvé (${episodeSubtitleFilePath}), passage à l'épisode suivant.\n`,
			);
			continue;
		}

		console.debug(
			`${baseFileName} - Sous-titres disponibles, génération en cours...`,
		);

		const episodeInfoFilePath = getEpisodeInfoFilePath(baseFileName);
		const episodeInfoFileContent = (
			await import(`../${episodeInfoFilePath}`, {
				with: { type: 'json' },
			})
		).default;

		const episodeSubtitlesFileContent = await readFile(
			episodeSubtitleFilePath,
			{
				encoding: 'utf-8',
			},
		);

		const episodeFileContent = {
			id: baseFileName,
			metadata: getEpisodeMetadataFromYtDlpEpisodeInfo(episodeInfoFileContent),
			lines: getEpisodeLinesFromVtt(episodeSubtitlesFileContent),
		};

		console.debug(
			`${baseFileName} - Génération terminée, enregistement en cours...`,
		);
		await writeFile(
			episodeDestinationFilePath,
			JSON.stringify(episodeFileContent, null, '\t'),
		);

		console.debug(
			`${baseFileName} - Enregistrement terminé, passage à l'épisode suivant.\n`,
		);
	}
}

export async function getEpisodesYtDlpFileNames() {
	return readdir(`${EPISODES_INFO_FILE_PATHS}`);
}

export function getEpisodeInfoFilePath(episodeFileName: string): string {
	return `${EPISODES_INFO_FILE_PATHS}${episodeFileName}.info.json`;
}

export function getEpisodeSubtitleFilePath(episodeFileName: string): string {
	return `${EPISODES_SUBTITLES_FILE_PATHS}${episodeFileName}.vtt`;
}

export async function getEpisodesFileNames() {
	return readdir(`${EPISODES_DESTINATION_FILE_PATHS}`);
}

export function getEpisodeDestinationFilePath(episodeFileName: string): string {
	return `${EPISODES_DESTINATION_FILE_PATHS}${episodeFileName}.json`;
}

export function getEpisodeMetadataFromYtDlpEpisodeInfo(
	episode: YtDlpEpisodeInfo,
): EpisodeMetadata {
	const episodeInfos = getEpisodeInfoFromTitle(episode.title);

	const title = episodeInfos.episodeTitle;
	const seasonNumber = episode.season_number ?? episodeInfos.seasonNumber;
	const episodeNumber = episode.episode_number ?? episodeInfos.episodeNumber;
	const code = episodeInfos.code;

	const acastUrl = new URL(episode.webpage_url).toString();
	const description = episode.description;
	const duration = episode.duration;
	const durationString = episode.duration_string;
	const uploadTimestamp = episode.timestamp;
	const uploadDate = `${episode.upload_date.substring(0, 4)}-${episode.upload_date.substring(4, 6)}-${episode.upload_date.substring(6, 8)}`;

	return {
		title,
		seasonNumber,
		episodeNumber,
		code,
		acastUrl,
		description,
		duration,
		durationString,
		uploadTimestamp,
		uploadDate,
	};
}

function getEpisodeInfoFromTitle(
	episodeTitle: string,
): EpisodeInfoFromTitle | never {
	const episodeInfos = episodeTitle.match(
		/^(?<code>S(?<seasonNumber>\d{2})E(?<episodeNumber>\d{2})) - (?<episodeTitle>.+)$/,
	);

	if (
		episodeInfos === null ||
		episodeInfos.groups === undefined ||
		episodeInfos.groups.seasonNumber === null ||
		episodeInfos.groups.episodeNumber === null ||
		episodeInfos.groups.episodeTitle === null ||
		episodeInfos.groups.code === null
	) {
		throw new Error(
			"Les infos de l'épisode n'ont pas pu être trouvées dans son titre : saison, épisode, titre",
		);
	}

	return {
		episodeTitle: episodeInfos.groups.episodeTitle,
		seasonNumber: Number.parseInt(episodeInfos.groups.seasonNumber, 10),
		episodeNumber: Number.parseInt(episodeInfos.groups.episodeNumber, 10),
		code: episodeInfos.groups.code,
	};
}

type EpisodeInfoFromTitle = {
	episodeTitle: string;
	seasonNumber: number;
	episodeNumber: number;
	code: string[6];
};

export function getEpisodeLinesFromVtt(vttContent: string): EpisodeLine[] {
	const vttLines = vttContent.split('\n');
	const lines = [];
	for (let index = 0; index < vttLines.length; index++) {
		const vttLine = vttLines[index];
		if (vttLine.startsWith('WEBVTT') || vttLine === '') {
			continue;
		}

		const lineInfo = vttLine.match(
			/^(?<start>\d{2}:\d{2}:\d{2}\.\d{3}) --> (?<end>\d{2}:\d{2}:\d{2}\.\d{3})$/,
		);
		if (
			lineInfo === null ||
			lineInfo.groups === undefined ||
			lineInfo.groups.start === null ||
			lineInfo.groups.end === null
		) {
			continue;
		}

		const start = convertVttTimecodeToNumber(lineInfo.groups.start);
		const end = convertVttTimecodeToNumber(lineInfo.groups.end);

		const line = {
			start: Math.floor(start),
			startString: lineInfo.groups.start,
			end: Math.ceil(end),
			endString: lineInfo.groups.end,
			content: vttLines[index + 1],
		};
		lines.push(line);
	}

	return lines;
}

function convertVttTimecodeToNumber(vttTimecode: string): number {
	const timecodeInfo = vttTimecode.match(
		/^(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})\.(?<milliseconds>\d{3})$/,
	);
	if (timecodeInfo === null || timecodeInfo.groups === undefined) {
		throw new Error("Un timecode VTT n'a pas pu être décodé");
	}

	return (
		Number.parseInt(timecodeInfo.groups.hours, 10) * 3_600 +
		Number.parseInt(timecodeInfo.groups.minutes, 10) * 60 +
		Number.parseInt(timecodeInfo.groups.seconds, 10) +
		Number.parseInt(timecodeInfo.groups.milliseconds, 10) / 1_000
	);
}
