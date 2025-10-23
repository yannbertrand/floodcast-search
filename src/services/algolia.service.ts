import { liteClient as algoliasearch } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';

const searchClient = algoliasearch(
	'UA7S1T9E77',
	'263dbfb3c0765ad133b807b9701a9df8',
);

const algolia = instantsearch({
	indexName: 'floodcast-search-index',
	searchClient,
});

export default algolia;
