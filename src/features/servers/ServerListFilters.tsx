import { faFilter, faPlus, faRocket, faSearch, faSort, faSortDown, faSortUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Button, Checkbox, Input, InputGroup, RangeSlider, SelectPicker } from 'rsuite';
import omit from 'lodash.omit';
import { transformCountryName } from './ui/transformCountryName';
import { FilterDropdown } from './ui/FilterDropdown';
import { serverClient } from '../../api-types/client';
import { FieldName } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { AddServerModal } from './AddServerModal';

const globalOptions = [
	{ icon: faRocket, label: 'All Servers', value: "false" },
];

const renderValue = (_: React.ReactNode, config: any) => {
	return (
		<div>
			<FontAwesomeIcon icon={config.icon} />&nbsp;
			{config.label}
		</div>
	)
};

export const ServerListFilters = React.memo(({ filters: newFilters, onChange, loading }: { loading: boolean, filters: { [key: string]: string }; onChange(data: { [key: string]: string }): void }) => {
	const [more, setMore] = React.useState(Object.keys(newFilters).filter(i => [
		'network.asn', 'game.version', 'game.language', 'game.gamemode', 'isSupporter', 'isPassworded', 'players.current'
	].includes(i)).some(i => !!newFilters[i]));
	const [max, setMax] = React.useState(2000);
	const [modal, setModal] = React.useState(false);

	const [filters, setFiltersInt] = React.useState<{ [key: string]: string }>({
		order: 'players.current:desc',
		...newFilters,
	});

	const setFilters = React.useCallback((opts: (data: any) => any, forceOrder: boolean = false) => {
		setFiltersInt(data => {
			const resp = opts(data);

			const filterKeys = Object.keys(resp).filter(i => !['order'].includes(i));

			// Force specific filters when we can.
			if (resp['query']) {
				resp['order'] = 'relevance:asc';
			} else if (!filterKeys.length && !forceOrder) {
				resp['order'] = 'players.current:desc';
			} else if (filterKeys.length && !forceOrder) {
				resp['order'] = 'players.current:desc';
			}

			return resp;
		})
	}, []);


	const onToggle = React.useCallback(() => {
		setFilters(i => ({
			...i,
			order: i.order === 'players.current:asc' ?
				'players.current:desc'
				: i.order === 'players.current:desc'
					? 'players.current:asc' :  'players.current:desc'
		}), true);
	}, []);

	const onSetGameMode = React.useCallback((value: string) => {
		setFilters(i => {
			if (value) {
				return {
					...i,
					'game.gamemode': value,
				}
			}

			return omit(i, ['game.gamemode']);
		});
	}, [])

	const onSetGameVersion = React.useCallback((value: string) => {
		setFilters(i => {
			if (value) {
				return {
					...i,
					'game.version': value,
				}
			}

			return omit(i, ['game.version']);
		});
	}, [])

	const onSetGameLanguage = React.useCallback((value: string) => {
		setFilters(i => {
			if (value) {
				return {
					...i,
					'game.language': value,
				}
			}

			return omit(i, ['game.language']);
		});
	}, [])

	const onSetCountry = React.useCallback((value: string) => {
		setFilters(i => {
			if (value) {
				return {
					...i,
					'network.country': value,
				}
			}

			return omit(i, ['network.country']);
		});
	}, [])

	const onSetASN = React.useCallback((value: string) => {
		setFilters(i => {
			if (value) {
				return {
					...i,
					'network.asn': value,
				}
			}

			return omit(i, ['network.asn']);
		});
	}, [])

	const onSetQuery = React.useCallback((value: string) => {
		setFilters(({ query, ...i }) => value ? ({
			...i,
			'query': value,
		}) : ({
			...i,
		}));
	}, [])

	const onSelect = React.useCallback((value: boolean) => {
		setFilters(({ isHosted, ...i }) => value ? ({
			...i,
			'isHosted': 'true',
		}) : i);
	}, []);

	React.useEffect(() => {
		onChange(filters);
	}, [filters, onChange]);

	const toggleMore = React.useCallback(() => {
		setMore(m => !m);
	}, []);

	const onToggleSupporter = React.useCallback((_: any, checked: boolean) => {
		setFilters(({ isSupporter, ...i }) => checked ? ({
			...i,
			'isSupporter': 'true',
		}) : i);
	}, []);

	const onTogglePassworded = React.useCallback((_: any, checked: boolean) => {
		setFilters(({ isPassworded, isPublic, ...i }) => checked ? ({
			...i,
			'isPassworded': 'true',
		}) : i);
	}, []);

	const onTogglePublic = React.useCallback((_: any, checked: boolean) => {
		setFilters(({ isPassworded, isPublic, ...i }) => checked ? ({
			...i,
			'isPublic': 'true',
		}) : i);
	}, []);

	const onPlayerRange = React.useCallback(([min, max]: any) => {
		setFilters((i => ({
			...i,
			'players.current': `bt:${min}-${max}`,
		})));
	}, []);

	React.useEffect(() => {
		serverClient.listServers({ requestType: { case: 'filter', value: { limit: 1, sort: { field: FieldName.CURRENT_PLAYERS }}}})
			.then(server => {
				setMax(server.server?.[0]?.players?.currentPlayers ?? 1000);
			});
	}, []);

	const minValue = filters['players.current'] ? +filters['players.current'].split(':')[1].split('-')[0] : 0;
	const maxValue = filters['players.current'] ? +filters['players.current'].split(':')[1].split('-')[1] : max;

	const MoreFilters = (
		<div style={{ flexDirection: 'row', display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 15, marginBottom: 15 }}>
			<FilterDropdown align="bottomStart" onChange={onSetASN} value={filters['network.asn']} label="Hosting Provider" displayKey="name" valueKey="asn" serverKey="getNetworkASNDistribution" dataKey="networkAsns" />
			<FilterDropdown align="bottomStart" onChange={onSetGameVersion} value={filters['game.version']} label="Version" displayKey="version" valueKey="version" serverKey="getGameVersionDistribution" dataKey='gameVersions'/>
			<FilterDropdown align="bottomStart" onChange={onSetGameLanguage} value={filters['game.language']} label="Language" displayKey="language" valueKey="language" serverKey="getGameLanguageDistribution" dataKey='gameLanguages' />
			<FilterDropdown align="bottomStart" onChange={onSetGameMode} value={filters['game.gamemode']} label="Game mode" displayKey="gamemode" valueKey="gamemode" serverKey="getGameModeDistribution" dataKey='gameModes' />

			<Checkbox checked={filters['isSupporter'] === 'true'} onChange={onToggleSupporter}> SA:GL Supporter</Checkbox>
			<Checkbox checked={filters['isPassworded'] === 'true'} onChange={onTogglePassworded}> Passworded </Checkbox>
			<Checkbox checked={filters['isPublic'] === 'true'} onChange={onTogglePublic}> Public </Checkbox>

			<p style={{ padding: '0 15px' }}> Players: </p>
			<p>{minValue}</p>
			<RangeSlider defaultValue={[0, max]} value={[minValue, maxValue]} min={0} max={max} style={{ flex: 1, marginLeft: 10, marginRight: 10 }} onChange={onPlayerRange} />
			<p>{maxValue}</p>
		</div>
	);
	const handleClose = () => {
		setModal(false)
	}

	return (
		<>
			<div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', flexWrap: 'wrap', }}>
				<div>
					<SelectPicker onSelect={onSelect} value={String(!!filters['isHosted'])} size="lg" renderMenuItem={renderValue} searchable={false} cleanable={false} renderValue={renderValue} data={globalOptions} style={{ width: 200 }}></SelectPicker>
				</div>

				<div style={{ paddingLeft: 10 }}>
					<InputGroup inside>
						<InputGroup.Addon>
							<FontAwesomeIcon icon={faSearch} />
						</InputGroup.Addon>
						<Input type="text" placeholder="Search.. " value={filters['query']} onChange={onSetQuery} />
					</InputGroup>
				</div>

				<div style={{ flex: '1', display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center' }}>
					{loading && <div style={{ paddingRight: 20, fontSize: '1.2em', paddingTop: 5  }}>
						<FontAwesomeIcon icon={faSpinner} spin  />
					</div>}
					<Button appearance='primary' onClick={() => setModal(true)} style={{ marginRight: 10 }}>
						<FontAwesomeIcon icon={faPlus} />&nbsp;
						Add Server
					</Button>
					<FilterDropdown align="bottomEnd" onChange={onSetCountry} value={filters['network.country']} label="Country" displayKey="country" valueKey="country" serverKey="getNetworkCountryDistribution" transformer={transformCountryName} dataKey='networkCountries' />
					<Button onClick={onToggle} disabled={!!filters['query']}>
						{filters['order'].startsWith('distance:') && <FontAwesomeIcon icon={faSort} />}
						{!filters['order'].startsWith('distance:') && <FontAwesomeIcon icon={filters.order.endsWith('desc') ? faSortDown : faSortUp} />}
						&nbsp;
					</Button>
					<Button onClick={toggleMore} style={{ marginLeft: 10 }}>
						<FontAwesomeIcon icon={faFilter} />&nbsp;
						Filter
					</Button>
				</div>
			</div>

			<AddServerModal onClose={handleClose} open={modal} />

			{more && MoreFilters}
		</>
	)
})

ServerListFilters.displayName = 'ServerListFilters';
