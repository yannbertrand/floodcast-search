import { describe, expectTypeOf, it } from 'vitest';
import type { EpisodeForAlgolia } from '../src/types.ts';
import { removeEpisodeUnusedAttributes } from './write-algolia-json.ts';

describe('removeEpisodeUnusedAttributes', () => {
	it('should remove unused attributes', () => {
		const sampleEpisode = {
			id: 'S10E05_-_Folkloriste_Professionnel',
			metadata: {
				title: 'S10E05 - Folkloriste Professionnel',
				seasonNumber: 10,
				episodeNumber: 5,
				code: 'S10E05',
				acastUrl:
					'https://sphinx.acast.com/p/open/s/5ffe3facad3e633276e9ea57/e/670afa3c092cc24098db3148/media.mp3#__youtubedl_smuggle=%7B%22force_videoid%22%3A+%22670afa3c092cc24098db3148%22%7D',
				description:
					"<p>Avec Manon Bril et Patrick Baud. </p><br><p>Présenté par Florent Bernard et Adrien Ménielle.&nbsp;</p><br><p>On en parle de choses dans cet épisode : de folkloriste, de faire du sport, de bêtises d'enfants, de petites maisons dans des lieux insolites, de fêter son anniversaire, de chercher un trésor, d'opération chirurgicales et de Michel Blanc. </p><br><p>Tu peux nous laisser des bonnes notes sur ta plateforme d'écoute et/ou en parler autour de toi, le bouche-à-oreille, c'est toujours chanmé !&nbsp;</p><br><p>Bises,</p><p>Flo.&nbsp;</p>",
				duration: 6583.0,
				durationString: '1:49:43',
				uploadTimestamp: 1728871240,
				uploadDate: '20241014',
			},
			lines: [
				{
					startString: '00:00:00.000',
					start: 0,
					endString: '00:00:01.500',
					end: 2,
					content: "Il s'agit du FloodCast",
				},
			],
			guests: [],
		};

		expectTypeOf(removeEpisodeUnusedAttributes(sampleEpisode)).toEqualTypeOf<
			EpisodeForAlgolia[]
		>();
	});
});
