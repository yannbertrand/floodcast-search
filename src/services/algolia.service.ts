import { liteClient as algoliasearch } from 'algoliasearch/lite';
import instantsearch, { type UiState } from 'instantsearch.js/es';
import { history } from 'instantsearch.js/es/lib/routers';

const searchClient = algoliasearch(
	'UA7S1T9E77',
	'263dbfb3c0765ad133b807b9701a9df8',
);

type HomeSearchQueryParams = {
	saison?: string[];
	recherche?: string;
};

type GenericObject = {
	// biome-ignore lint/suspicious/noExplicitAny: generic
	[key: string]: any;
};

const indexName = 'floodcast-search-index';
const algolia = instantsearch({
	indexName,
	searchClient,
	routing: {
		router: history({
			createURL({ qsModule, routeState, location }) {
				const baseUrl = location.origin;
				const queryParameters: HomeSearchQueryParams = {};
				if (routeState.query) {
					queryParameters.recherche = routeState.query as string;
				}
				if (routeState.seasons) {
					queryParameters.saison = routeState.seasons as string[];
				}

				const queryString = qsModule.stringify(queryParameters, {
					addQueryPrefix: true,
					arrayFormat: 'repeat',
				});

				return `${baseUrl}${queryString}`;
			},

			parseURL({ qsModule, location }): GenericObject {
				const { recherche = '', saison = [] } = qsModule.parse(
					location.search.slice(1),
				);

				const allSeasons = Array.isArray(saison) ? saison : [saison];

				return {
					query: recherche as string,
					seasons: allSeasons as string[],
				};
			},
		}),

		stateMapping: {
			stateToRoute(uiState): GenericObject {
				const indexUiState = uiState[indexName] || {};

				return {
					query: indexUiState.query,
					seasons: indexUiState.refinementList?.['episode.seasonNumber'],
				};
			},

			routeToState(routeState): UiState {
				return {
					[indexName]: {
						query: routeState.query,
						refinementList: {
							'episode.seasonNumber': routeState.seasons,
						},
					},
				};
			},
		},
	},
});

export default algolia;
