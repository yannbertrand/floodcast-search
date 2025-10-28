import { access, constants, writeFile } from 'node:fs/promises';
import type { Episode, EpisodeForAlgolia } from '../src/types.ts';
import {
	getEpisodeDestinationFilePath,
	getEpisodesFileNames,
} from './write-episodes.ts';

const ALGOLIA_DESTINATION_FILE_PATH = 'public/algolia/episodes.json';
async function writeAlgoliaJson(forceRewrite = false) {
	if (!forceRewrite) {
		try {
			await access(ALGOLIA_DESTINATION_FILE_PATH, constants.R_OK);
			console.debug(`ALGOLIA - Fichier destination déjà généré, stop.\n`);
			return;
		} catch {}
	}

	const episodesFileNames = await getEpisodesFileNames();
	const algoliaFileContent = [];
	for (const episodeFileName of episodesFileNames) {
		const episodeFileContent = (
			await import(
				`../${getEpisodeDestinationFilePath(episodeFileName.slice(0, -5))}`,
				{
					with: { type: 'json' },
				}
			)
		).default;

		algoliaFileContent.push(
			...removeEpisodeUnusedAttributes(episodeFileContent),
		);
	}

	await writeFile(
		ALGOLIA_DESTINATION_FILE_PATH,
		JSON.stringify(algoliaFileContent),
	);

	console.debug(`ALGOLIA - Enregistrement terminé.\n`);
}

await writeAlgoliaJson(process.argv.includes('--force'));

export function removeEpisodeUnusedAttributes(
	episode: Episode,
): EpisodeForAlgolia[] {
	return episode.lines.map((line, index) => ({
		id: `${episode.id}_${index}`,
		start: line.start,
		content: line.content,
		episode: {
			id: episode.id,
			code: episode.metadata.code,
			title: episode.metadata.title,
			seasonNumber: episode.metadata.seasonNumber,
			episodeNumber: episode.metadata.episodeNumber,
			description: episode.metadata.description.replace(/<[^>]*>?/gm, ''),
			durationString: episode.metadata.durationString,
			uploadDate: episode.metadata.uploadDate,
			guests: episode.guests,
		},
	}));
}
