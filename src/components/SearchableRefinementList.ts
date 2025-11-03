import type { InstantSearchStatus } from 'instantsearch.js';
import type { RefinementListRenderState } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import connectRefinementList from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { getContainerNode } from 'instantsearch.js/es/lib/utils/getContainerNode';
import { refinementList } from 'instantsearch.js/es/widgets/index';
import type { RefinementListWidgetParams } from 'instantsearch.js/es/widgets/refinement-list/refinement-list';

function renderSearchBox(
	renderOptions: SearchBoxRenderState & {
		instantSearchInstance: { status: InstantSearchStatus };
	} & { widgetParams: SearchBoxWidgetParams },
	isFirstRender: boolean,
) {
	const { query, refine, instantSearchInstance, widgetParams } = renderOptions;
	const container = getContainerNode(widgetParams.container);
	const isSearchStalled = instantSearchInstance.status === 'stalled';
	const input = container.querySelector('input') as HTMLInputElement;

	if (isFirstRender) {
		input.addEventListener('input', (event) => {
			refine((event.currentTarget as HTMLInputElement).value);
		});
	}

	input.value = query;
	if (isSearchStalled) {
		input.classList.add('loading');
	} else {
		input.classList.remove('loading');
	}
}

let itemTemplate: HTMLLIElement = {} as HTMLLIElement;
let currentSearch = '';
const renderRefinementList = (
	renderOptions: RefinementListRenderState & {
		instantSearchInstance: { status: InstantSearchStatus };
	} & { widgetParams: RefinementListWidgetParams },
	isFirstRender: boolean,
) => {
	const { items, searchForItems, refine, instantSearchInstance, widgetParams } =
		renderOptions;
	const isSearchStalled = instantSearchInstance.status === 'stalled';
	const container = getContainerNode(widgetParams.container);
	const input = container.querySelector(
		'input[type="search"]',
	) as HTMLInputElement;
	const ul = container.querySelector('ul') as HTMLUListElement;

	if (isFirstRender) {
		itemTemplate = container.querySelector('li') as HTMLLIElement;
		input.addEventListener('input', (event) => {
			currentSearch = event.currentTarget.value;
			searchForItems(currentSearch);
		});

		container.addEventListener('click', (event) => {
			event.preventDefault();
			const checkbox = event.target.closest('input[type="checkbox"]');

			if (checkbox) {
				console.log('refine', checkbox.value, currentSearch);
				refine(checkbox.value);
				// searchForItems(currentSearch);
				// event.stopImmediatePropagation();
				// event.stopPropagation();
				// event.preventDefault();
			}
		});
	}

	ul.innerHTML = items
		.map((item) => getItem(item.label, item.count, item.isRefined))
		.join('');
	if (isSearchStalled) {
		input.classList.add('loading');
	} else {
		input.classList.remove('loading');
	}
};

function getItem(label, count, isRefined) {
	const item = itemTemplate.cloneNode(true);
	item.querySelector('input[type="checkbox"]').value = label;
	if (isRefined) {
		item.querySelector('input[type="checkbox"]').setAttribute('checked', '');
	}
	item.querySelector('.ais-RefinementList-labelText').textContent = label;
	item.querySelector('.ais-RefinementList-count').textContent = ` (${count})`;
	return item.innerHTML;
}

const customRefinementList = connectRefinementList(renderRefinementList);

const getSearchableRefinementList = () =>
	customRefinementList({
		container: '#guest',
		attribute: 'episode.guests',
		operator: 'and',
		// searchable: true,
	});

export default getSearchableRefinementList;
// return refinementList({
//     container: '#guest',
//     attribute: 'episode.guests',
//     cssClasses: {
//         list: 'list-guests'
//     },
//     operator: 'and',
//     searchable: true,
//     templates: {
//         item(item, { html }) {
//             const { label, count, isRefined } = item;

//             return html`
//                 <input type="checkbox" class="ais-RefinementList-checkbox" checked="${isRefined}" />
//                 <span class="ais-RefinementList-labelText">${label}</span>
//                 <span class="ais-RefinementList-count"> (${count})</span>
//             `
//         }
//     }
// })
