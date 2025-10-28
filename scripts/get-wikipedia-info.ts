import type { WikipediaInfos } from '../src/types.ts';

export function getWikipediaInfo(rawTable: string): WikipediaInfos {
	const episodesRows = rawTable.match(
		/^\| ?(?<code>S\d{2}E\d{2}).+\{\{Heure.+\|\|(?<invites>.+)\|\|(?<recommendations>.+)?$/gm,
	);
	if (episodesRows === null) {
		return {};
	}

	const episodesInfo: WikipediaInfos = {};
	for (const episodeRow of episodesRows) {
		const episodeInfoMatch = episodeRow.match(
			/^\| ?(?<code>S\d{2}E\d{2}).+\{\{Heure.+\|\|(?<guests>.+)\|\|(?<recommendations>.+)?$/,
		);

		if (
			episodeInfoMatch === null ||
			episodeInfoMatch.groups === undefined ||
			episodeInfoMatch.groups.code === null ||
			episodeInfoMatch.groups.guests === null
		) {
			continue;
		}

		const episodeInfo = {
			guests: normalizeInfos(episodeInfoMatch.groups.guests),
		};

		episodesInfo[episodeInfoMatch.groups.code] = episodeInfo;
	}

	return episodesInfo;
}

export function normalizeInfos(info: string) {
	let result = info.replaceAll("''", '');
	result = result.replaceAll(
		/\{\{(?:[^|\]]*\|)?(?<displayName>[^\]]+)\}\}/g,
		(match, _p1, _offset, _string, groups) => {
			if (groups === undefined) {
				return match;
			}
			return groups.displayName;
		},
	);
	result = result.replaceAll(
		/\[\[(?:[^|\]]*\|)?(?<displayName>[^\]]+)\]\]/g,
		(match, _p1, _offset, _string, groups) => {
			if (groups === undefined) {
				return match;
			}
			return groups.displayName;
		},
	);

	result = result.trim();
	if (result === '-' || result === 'Aucun') {
		return [];
	}

	result = result.replace(
		'Ina Mihalache, dit Solange te Parle',
		'Ina Mihalache (Solange te Parle)',
	);
	result = result.replace(
		'Team Calmos (David Honnorat et Hugo Alexandre)',
		'David Honnorat (Team Calmos), Hugo Alexandre (Team Calmos)',
	);
	result = result.replace(
		'Medoc et Moguri (Cosy Corner)',
		'Medoc (Cosy Corner), Moguri (Cosy Corner)',
	);
	result = result.replace('Avec la participation de ', '');
	result = result.replace('dans le rôle du Maire Geek', '');

	return result
		.split(/ et |,|\. /)
		.map((r) => r.trim())
		.filter((r) => r.length > 0);
}
