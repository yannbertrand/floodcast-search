import { liteClient as algoliasearch } from 'algoliasearch/lite';

export const searchClient = algoliasearch(
	'UA7S1T9E77',
	'263dbfb3c0765ad133b807b9701a9df8',
);

export const indexName = 'floodcast-search-distinct-by-episodes';
