
import * as React from 'react';
import { Wrapper } from '../../theme';
import { ServerListFilters } from '../../features/servers/ServerListFilters';
import throttle from 'lodash.throttle';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ServerListItem } from '../../features/servers/ServerListItem';
import { useSearchParams } from 'react-router-dom';
import { serverClient } from '../../api-types/client';
import { FieldName, ListServersRequest_FieldQuery, ListServersRequest_ListServersRequestFilter, ListServersRequest_Sort, Operator, Server } from '@buf/xeonr_sagl-servers.bufbuild_es/serversapi/v1/api_pb';
import { useQuery } from '@tanstack/react-query';
import { listServers } from '@buf/xeonr_sagl-servers.connectrpc_query-es/serversapi/v1/api-ServerService_connectquery';

const fieldMapping: { [key: string]: FieldName } = {
	'query': FieldName.QUERY,
	'game.gamemode': FieldName.GAME_MODE,
	'game.language': FieldName.GAME_LANGUAGE,
	'game.version': FieldName.GAME_VERSION,
	'network.country': FieldName.NETWORK_COUNTRY,
	'network.asn': FieldName.NETWORK_ASN,
	'isSupporter': FieldName.IS_SUPPORTER,
	'isPassworded': FieldName.IS_PASSWORDED,
	'isPublic': FieldName.IS_PUBLIC,
	'players.current': FieldName.CURRENT_PLAYERS,
	'isHosted': FieldName.IS_HOSTED,
}

function searchToFilter(data: URLSearchParams): ListServersRequest_FieldQuery[] {
	return Object.keys(fieldMapping).map(key => {
		if (data.has(key)) {
			const op = data.get(key)?.split(':') ?? [];

			if (op[0] === 'bt') {
				const val = op[1].split('-');

				return new ListServersRequest_FieldQuery({
					field: fieldMapping[key]!,
					operator: Operator.BETWEEN,
					value: val,
				});
			}

			if (op[0] === 'gt' || op[0] === 'lt') {
				return new ListServersRequest_FieldQuery({
					field: fieldMapping[key]!,
					operator: op[0] === 'gt' ? Operator.GREATER_THAN : Operator.LESS_THAN,
					value: [op[1]],
				});
			}

			if (op[0] === 'eq' || op[0] === 'ne') {
				return new ListServersRequest_FieldQuery({
					field: fieldMapping[key]!,
					operator: op[0] === 'ne' ? Operator.NOT_EQUAL : Operator.EQUAL,
					value: [op[1]],
				});
			}

			return new ListServersRequest_FieldQuery({
				field: fieldMapping[key]!,
				operator: Operator.EQUAL,
				value: [op[0]],
			});
		}

		return null;
	}).filter(v => !!v).map(v => v!);
}

const allowedParams = [
	...Object.keys(fieldMapping),
	'order',
]

function filterfn(searchParams: URLSearchParams): { [key: string]: string } {
	const filters: any = {
		order: 'players.current:desc'
	};

	for (const key of allowedParams) {
		if (searchParams.has(key)) {
			filters[key] = searchParams.get(key);
		}
	}

	return filters;
}

const Servers = React.memo(() => {
	const [searchParams, setSearchParams] = useSearchParams();

	const getServerQuery = React.useMemo(() => {
		const sort = searchParams.get('order')?.split(':') ?? ['players.current', 'desc'];
		const data: ListServersRequest_ListServersRequestFilter = new ListServersRequest_ListServersRequestFilter({
			sort: new ListServersRequest_Sort({
				field: fieldMapping[sort[0]],
				ascending: sort[1] === 'asc',
			}),
			filter: searchToFilter(searchParams),
			limit: 100,
		});

		return data;
	}, [searchParams])

	const query = useQuery({ ...listServers.useQuery({ requestType: { case: 'filter', value: getServerQuery}}), refetchOnWindowFocus: false, staleTime: 30000, keepPreviousData: true });

	const [items, setItems] = React.useState<Server[]>([]);
	const [nextLink, setNextLink] = React.useState<string | null>(null);

	React.useEffect(() => {
		setItems(query.data?.server ?? []);
		setNextLink(query.data?.continuationToken ?? null);
	}, [query.data]);

	const filter = React.useMemo(() => {
		return filterfn(searchParams);
	}, [searchParams]);

	const throttled = React.useMemo(() => {
		return throttle(setSearchParams, 200);
	}, [setSearchParams]);

	const onChange = React.useCallback((filters: any) => {
		throttled(filters);
	}, [throttled]);

	const getMore = React.useCallback(() => {
		if (!nextLink) {
			return;
		}

		serverClient.listServers({ requestType: { case: 'continuationToken', value: nextLink }})
			.then(async res => {

				if (res.server.length === 0) {
					setNextLink(null);
				} else {
					setNextLink(res.continuationToken);
					setItems(itm => ([...itm, ...res.server]));
				}
			})
	}, [nextLink]);

	return (
		<Wrapper>
			<ServerListFilters filters={filter} onChange={onChange} loading={query.isFetching}/>
			{!!items.length && (
				<InfiniteScroll dataLength={items.length} hasMore={!!nextLink} next={getMore} loader={<p style={{ textAlign: 'center' }}>loading..</p>}>
					{items.map(srv => <ServerListItem server={srv} key={srv.id} link="/server" />)}
				</InfiniteScroll>
			)}
			<div style={{ padding: 100, textAlign: 'center' }}>
				{!items.length && <h2> No servers found </h2>}
			</div>
		</Wrapper>
	)
});

Servers.displayName = 'Servers';
export default Servers;

