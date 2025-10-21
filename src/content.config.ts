import { defineCollection } from 'astro:content';

import { glob } from 'astro/loaders';

const episodes = defineCollection({
	loader: glob({ pattern: '*.json', base: './data/episodes' }),
});

export const collections = { episodes };
